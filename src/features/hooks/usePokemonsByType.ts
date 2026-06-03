import { useQuery } from '@tanstack/react-query';
import { getPokemonsByType } from '../../api/pokeapi';

export function usePokemonsByType(type: string | null) {
  return useQuery({
    queryKey: ['pokemon', 'byType', type],
    queryFn: () => getPokemonsByType(type!),
    enabled: !!type,
    staleTime: 1000 * 60 * 10,
  });
}
