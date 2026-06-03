import { useQuery } from '@tanstack/react-query';
import { getPokemonDetail } from '../../api/pokeapi';

export function usePokemonDetail(name: string) {
  return useQuery({
    queryKey: ['pokemon', 'detail', name],
    queryFn: () => getPokemonDetail(name),
    enabled: !!name,
  });
}
