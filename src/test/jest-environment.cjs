/**
 * Custom Jest test environment that extends jsdom but injects Node.js native
 * fetch and other Web APIs that MSW v2 requires.
 *
 * Node.js 18+ exposes these globals but jest-environment-jsdom does not
 * inherit them from the Node context. We capture them before jsdom's setup
 * and restore them afterwards.
 */
'use strict';

const { TestEnvironment } = require('jest-environment-jsdom');
const { TextDecoder, TextEncoder } = require('util');
const {
  ReadableStream,
  ReadableStreamDefaultReader,
  ReadableStreamBYOBReader,
  TransformStream,
  TransformStreamDefaultController,
  WritableStream,
  WritableStreamDefaultWriter,
  WritableStreamDefaultController,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  TextEncoderStream,
  TextDecoderStream,
  CompressionStream,
  DecompressionStream,
} = require('stream/web');
const { performance } = require('perf_hooks');
const { BroadcastChannel } = require('worker_threads');

// Capture Node.js native fetch BEFORE jsdom replaces global scope
const nodeFetch = globalThis.fetch;
const nodeRequest = globalThis.Request;
const nodeResponse = globalThis.Response;
const nodeHeaders = globalThis.Headers;
const nodeFormData = globalThis.FormData;

class CustomJsdomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    // Re-inject Web APIs that jsdom does not provide but MSW requires
    Object.assign(this.global, {
      // Encoding
      TextDecoder,
      TextEncoder,
      // Streams
      ReadableStream,
      ReadableStreamDefaultReader,
      ReadableStreamBYOBReader,
      TransformStream,
      TransformStreamDefaultController,
      WritableStream,
      WritableStreamDefaultWriter,
      WritableStreamDefaultController,
      ByteLengthQueuingStrategy,
      CountQueuingStrategy,
      TextEncoderStream,
      TextDecoderStream,
      CompressionStream,
      DecompressionStream,
      // Timing / workers
      performance,
      BroadcastChannel,
      // Native fetch (MSW v2 depends on these being the real Node.js versions)
      fetch: nodeFetch,
      Request: nodeRequest,
      Response: nodeResponse,
      Headers: nodeHeaders,
      FormData: nodeFormData,
    });

    // IntersectionObserver mock for react-intersection-observer
    this.global.IntersectionObserver = class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

module.exports = CustomJsdomEnvironment;
