import { useQuery } from '@tanstack/react-query';
import { getPokemonTypes } from '../../api/pokeapi';
import type { TypeList } from '../../api/types';

const EXCLUDED_TYPES = ['shadow', 'unknown'];

export function usePokemonTypes() {
  return useQuery<TypeList>({
    queryKey: ['pokemon', 'types'],
    queryFn: getPokemonTypes,
    select: (data) => ({
      ...data,
      results: data.results.filter(
        (t) => !EXCLUDED_TYPES.includes(t.name)
      ),
    }),
    staleTime: 1000 * 60 * 60,
  });
}
