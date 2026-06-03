// PokeAPI response types

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}

export interface TypeListResult {
  name: string;
  url: string;
}

export interface TypeList {
  count: number;
  results: TypeListResult[];
}

export interface TypePokemonEntry {
  pokemon: {
    name: string;
    url: string;
  };
}

export interface TypeDetail {
  name: string;
  pokemon: TypePokemonEntry[];
}
