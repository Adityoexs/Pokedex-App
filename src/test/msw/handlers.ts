import { rest } from 'msw';

const API = 'https://pokeapi.co/api/v2';

const makePokemonDetail = ({
  id,
  name,
  height,
  weight,
  base_experience,
  types,
  abilities,
  stats,
}: {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: string[];
  abilities: { name: string; is_hidden?: boolean }[];
  stats: { name: string; base_stat: number }[];
}) => ({
  id,
  name,
  height,
  weight,
  base_experience,
  abilities: abilities.map((ability, index) => ({
    ability: { name: ability.name, url: `${API}/ability/${index + 1}` },
    is_hidden: ability.is_hidden ?? false,
    slot: index + 1,
  })),
  sprites: {
    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    other: {
      'official-artwork': {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      },
    },
  },
  types: types.map((type, index) => ({
    slot: index + 1,
    type: { name: type, url: `${API}/type/${index + 1}` },
  })),
  stats: stats.map((stat) => ({
    base_stat: stat.base_stat,
    stat: { name: stat.name },
  })),
});

const pokemonDetails: Record<string, ReturnType<typeof makePokemonDetail>> = {
  bulbasaur: makePokemonDetail({
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    types: ['grass', 'poison'],
    abilities: [
      { name: 'overgrow' },
      { name: 'chlorophyll', is_hidden: true },
    ],
    stats: [
      { name: 'hp', base_stat: 45 },
      { name: 'attack', base_stat: 49 },
      { name: 'defense', base_stat: 49 },
    ],
  }),
  ivysaur: makePokemonDetail({
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    base_experience: 142,
    types: ['grass', 'poison'],
    abilities: [{ name: 'overgrow' }],
    stats: [
      { name: 'hp', base_stat: 60 },
      { name: 'attack', base_stat: 62 },
    ],
  }),
  charmander: makePokemonDetail({
    id: 4,
    name: 'charmander',
    height: 6,
    weight: 85,
    base_experience: 62,
    types: ['fire'],
    abilities: [{ name: 'blaze' }],
    stats: [
      { name: 'hp', base_stat: 39 },
      { name: 'attack', base_stat: 52 },
    ],
  }),
  venusaur: makePokemonDetail({
    id: 3,
    name: 'venusaur',
    height: 20,
    weight: 1000,
    base_experience: 236,
    types: ['grass', 'poison'],
    abilities: [{ name: 'overgrow' }],
    stats: [
      { name: 'hp', base_stat: 80 },
      { name: 'attack', base_stat: 82 },
    ],
  }),
  charmeleon: makePokemonDetail({
    id: 5,
    name: 'charmeleon',
    height: 11,
    weight: 190,
    base_experience: 142,
    types: ['fire'],
    abilities: [{ name: 'blaze' }],
    stats: [
      { name: 'hp', base_stat: 58 },
      { name: 'attack', base_stat: 64 },
    ],
  }),
  charizard: makePokemonDetail({
    id: 6,
    name: 'charizard',
    height: 17,
    weight: 905,
    base_experience: 240,
    types: ['fire', 'flying'],
    abilities: [{ name: 'blaze' }],
    stats: [
      { name: 'hp', base_stat: 78 },
      { name: 'attack', base_stat: 84 },
    ],
  }),
};

export const handlers = [
  rest.get(`${API}/pokemon`, (req, res, ctx) => {
    const offset = Number(req.url.searchParams.get('offset') ?? '0');
    const limit = Number(req.url.searchParams.get('limit') ?? '20');

    // Mocked pagination specifically to match tests
    if (offset === 0 && limit === 20) {
      return res(
        ctx.status(200),
        ctx.json({
          count: 5,
          next: `${API}/pokemon?offset=20&limit=20`,
          previous: null,
          results: [
            { name: 'bulbasaur', url: `${API}/pokemon/1` },
            { name: 'ivysaur', url: `${API}/pokemon/2` },
            { name: 'charmander', url: `${API}/pokemon/4` },
          ],
        })
      );
    }

    if (offset === 20 && limit === 20) {
      return res(
        ctx.status(200),
        ctx.json({
          count: 5,
          next: null,
          previous: `${API}/pokemon?offset=0&limit=20`,
          results: [
            { name: 'venusaur', url: `${API}/pokemon/3` },
            { name: 'charmeleon', url: `${API}/pokemon/5` },
          ],
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        count: 5,
        next: null,
        previous: null,
        results: [],
      })
    );
  }),

  rest.get(`${API}/pokemon/:name`, (req, res, ctx) => {
    const rawName = String(req.params.name);
    const byId = Object.values(pokemonDetails).find(
      (pokemon) => String(pokemon.id) === rawName
    );
    const pokemon = pokemonDetails[rawName] ?? byId;

    if (!pokemon) {
      return res(ctx.status(404), ctx.json({ message: 'Not found' }));
    }

    return res(ctx.status(200), ctx.json(pokemon));
  }),

  rest.get(`${API}/type`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          { name: 'grass', url: `${API}/type/12` },
          { name: 'fire', url: `${API}/type/10` },
          { name: 'water', url: `${API}/type/11` },
          { name: 'electric', url: `${API}/type/13` },
        ],
      })
    );
  }),

  rest.get(`${API}/type/:typeName`, (req, res, ctx) => {
    const { typeName } = req.params;

    if (typeName === 'fire') {
      return res(
        ctx.status(200),
        ctx.json({
          name: 'fire',
          pokemon: [
            { pokemon: { name: 'charmander', url: `${API}/pokemon/4` } },
            { pokemon: { name: 'charmeleon', url: `${API}/pokemon/5` } },
            { pokemon: { name: 'charizard', url: `${API}/pokemon/6` } },
          ],
        })
      );
    }

    if (typeName === 'grass') {
      return res(
        ctx.status(200),
        ctx.json({
          name: 'grass',
          pokemon: [
            { pokemon: { name: 'bulbasaur', url: `${API}/pokemon/1` } },
            { pokemon: { name: 'ivysaur', url: `${API}/pokemon/2` } },
          ],
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        name: typeName,
        pokemon: [],
      })
    );
  }),
];