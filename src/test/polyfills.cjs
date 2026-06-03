// Polyfills needed by MSW v2 in a jsdom environment.
// Must run in setupFiles (CJS) so they are applied before any ESM module loads.

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
const crossFetch = require('cross-fetch');

Object.assign(global, {
  // Encoding
  TextDecoder,
  TextEncoder,
  // Streams (needed by @mswjs/interceptors)
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
  // Timing / threading
  performance,
  BroadcastChannel,
  // Fetch API (cross-fetch works in both node and jsdom environments)
  fetch: crossFetch.fetch,
  Request: crossFetch.Request,
  Response: crossFetch.Response,
  Headers: crossFetch.Headers,
});

// Mock IntersectionObserver for react-intersection-observer
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;
