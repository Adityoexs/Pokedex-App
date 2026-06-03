import { getPokemonIdFromUrl, capitalise, formatStatName } from '../utils';

describe('getPokemonIdFromUrl', () => {
  it('extracts numeric id from url', () => {
    expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1);
    expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/150/')).toBe(150);
  });

  it('handles urls without trailing slash', () => {
    expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25')).toBe(25);
  });
});

describe('capitalise', () => {
  it('capitalises first letter', () => {
    expect(capitalise('bulbasaur')).toBe('Bulbasaur');
    expect(capitalise('pikachu')).toBe('Pikachu');
  });

  it('handles empty string', () => {
    expect(capitalise('')).toBe('');
  });
});

describe('formatStatName', () => {
  it('returns HP for hp', () => {
    expect(formatStatName('hp')).toBe('HP');
  });

  it('formats mapped stats correctly', () => {
    expect(formatStatName('attack')).toBe('Attack');
    expect(formatStatName('defense')).toBe('Defense');
    expect(formatStatName('special-attack')).toBe('Sp. Attack');
    expect(formatStatName('special-defense')).toBe('Sp. Defense');
    expect(formatStatName('speed')).toBe('Speed');
  });

  it('falls back to capitalised stat for unknown stats', () => {
    expect(formatStatName('accuracy')).toBe('Accuracy');
  });
});