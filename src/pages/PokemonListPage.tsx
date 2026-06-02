import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePokemonInfiniteList } from '../features/hooks/usePokemonInfiniteList';
import type { PokemonListResult } from '../api/types';
import PokemonCard from '../features/components/PokemonCard';
import LoadingSpinner from '../features/components/LoadingSpinner';
import ErrorState from '../features/components/ErrorState';

function PokemonListPage() {

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const {
    data: infiniteData,
    isLoading: infiniteLoading,
    isError: infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchInfinite,
  } = usePokemonInfiniteList();
  
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const isLoading = infiniteLoading;
  const isError = infiniteError;
  const onRetry = refetchInfinite;

  const pokemonList: PokemonListResult[] = infiniteData?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🎮 Pokedex
            </h1>
          </div>
        </div>
      </header>

      
      <main className="mx-auto max-w-6xl px-4 py-8">
        {isLoading && <LoadingSpinner message="Loading Pokémon..." />}

        {isError && (
          <ErrorState
            message="Failed to load Pokémon. Please check your connection."
            onRetry={onRetry}
          />
        )}

        {!isLoading && !isError && pokemonList.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No Pokémon found for this type.
          </div>
        )}

        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          data-testid="pokemon-grid"
        >
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
          ))}
        </div>

          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isFetchingNextPage && (
              <LoadingSpinner message="Loading more Pokémon..." />
            )}
            {!hasNextPage && pokemonList.length > 0 && (
              <p className="text-sm text-gray-400">
                You&apos;ve seen all {pokemonList.length} Pokémon!
              </p>
            )}
          </div>
      </main>
    </div>
  );
}

export default PokemonListPage;
