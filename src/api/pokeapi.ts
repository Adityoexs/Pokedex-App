import type {
  PokemonListPage,
  PokemonDetail,
  TypeList,
  TypeDetail,
} from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_PAGE_SIZE = 20;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PokeAPI request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getPokemonPage(
  offset: number,
  limit = DEFAULT_PAGE_SIZE
): Promise<PokemonListPage> {
  return fetchJson<PokemonListPage>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
}

export async function getPokemonDetail(name: string): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(`${BASE_URL}/pokemon/${name}`);
}

export async function getPokemonTypes(): Promise<TypeList> {
  return fetchJson<TypeList>(`${BASE_URL}/type?limit=100`);
}

export async function getPokemonsByType(type: string): Promise<TypeDetail> {
  return fetchJson<TypeDetail>(`${BASE_URL}/type/${type}`);
}
