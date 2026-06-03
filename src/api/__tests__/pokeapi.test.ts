import { rest } from 'msw';
import { server } from '../../test/msw/server';
import {
  getPokemonDetail,
  getPokemonPage,
  getPokemonTypes,
  getPokemonsByType,
} from '../pokeapi';

const API = 'https://pokeapi.co/api/v2';

describe('getPokemonPage', () => {
  it('fetches the first page of pokemon', async () => {
    const page = await getPokemonPage(0, 20);
    expect(page.results).toHaveLength(3);
    expect(page.results[0].name).toBe('bulbasaur');
    expect(page.next).not.toBeNull();
  });

  it('uses default page size when limit is not provided', async () => {
  const page = await getPokemonPage(0);

  expect(page.results).toHaveLength(3);
  expect(page.results[0].name).toBe('bulbasaur');
  expect(page.next).not.toBeNull();
});

  it('fetches subsequent pages', async () => {
    const page = await getPokemonPage(20, 20);
    expect(page.results).toHaveLength(2);
    expect(page.results[0].name).toBe('venusaur');
    expect(page.next).toBeNull();
  });

  it('throws when page request fails', async () => {
    server.use(
      rest.get(`${API}/pokemon`, (_req, res, ctx) => res(ctx.status(500)))
    );

    await expect(getPokemonPage(0, 20)).rejects.toThrow(
      /PokeAPI request failed/i
    );
  });
});

describe('getPokemonDetail', () => {
  it('fetches detail for a named pokemon', async () => {
    const detail = await getPokemonDetail('bulbasaur');
    expect(detail.name).toBe('bulbasaur');
    expect(detail.types).toHaveLength(2);
    expect(detail.sprites.front_default).toBeTruthy();
  });

  it('throws when detail request fails', async () => {
    server.use(
      rest.get(`${API}/pokemon/:name`, (_req, res, ctx) => res(ctx.status(404)))
    );

    await expect(getPokemonDetail('missingno')).rejects.toThrow(
      /PokeAPI request failed/i
    );
  });
});

describe('getPokemonTypes', () => {
  it('fetches pokemon types', async () => {
    const types = await getPokemonTypes();

    expect(types.results).toBeDefined();
    expect(types.results.length).toBeGreaterThan(0);
    expect(types.results.some((type) => type.name === 'fire')).toBe(true);
  });

  it('throws when pokemon types request fails', async () => {
    server.use(
      rest.get(`${API}/type`, (_req, res, ctx) => res(ctx.status(500)))
    );

    await expect(getPokemonTypes()).rejects.toThrow(/PokeAPI request failed/i);
  });
});

describe('getPokemonsByType', () => {
  it('fetches pokemons for a type', async () => {
    const result = await getPokemonsByType('fire');

    expect(result.name).toBe('fire');
    expect(result.pokemon.length).toBeGreaterThan(0);
    expect(result.pokemon[0].pokemon.name).toBe('charmander');
  });

  it('returns empty pokemon list for unknown mocked type', async () => {
    const result = await getPokemonsByType('ghost');

    expect(result.name).toBe('ghost');
    expect(result.pokemon).toEqual([]);
  });

  it('throws when type detail request fails', async () => {
    server.use(
      rest.get(`${API}/type/:typeName`, (_req, res, ctx) => res(ctx.status(500)))
    );

    await expect(getPokemonsByType('fire')).rejects.toThrow(
      /PokeAPI request failed/i
    );
  });
});