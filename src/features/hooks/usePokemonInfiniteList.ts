import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonPage } from '../../api/pokeapi';

const PAGE_SIZE = 20;

export function usePokemonInfiniteList() {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonPage(pageParam as number, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get('offset'));
    },
  });
}
