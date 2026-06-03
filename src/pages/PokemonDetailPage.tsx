import { Link, useParams } from 'react-router-dom';
import { usePokemonDetail } from '../features/hooks/usePokemonDetail';
import type { PokemonType, PokemonStat, PokemonAbility } from '../api/types';
import TypeBadge from '../features/components/TypeBadge';
import LoadingSpinner from '../features/components/LoadingSpinner';
import ErrorState from '../features/components/ErrorState';
import { formatStatName } from '../lib/utils';

function PokemonDetailPage() {
  const { name = '' } = useParams<{ name: string }>();
  const { data: pokemon, isLoading, isError, refetch } = usePokemonDetail(name);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message={`Loading ${name}...`} />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message={`Failed to load Pokémon "${name}".`}
          onRetry={refetch}
        />
      </div>
    );
  }

  const officialArtwork =
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default;

  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
          >
            ← Back to Pokédex
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          
          <div className="flex flex-col items-center gap-8 p-8 sm:flex-row sm:items-start">
            
            <div className="flex-shrink-0">
              <img
                src={officialArtwork ?? ''}
                alt={displayName}
                className="h-48 w-48 object-contain"
                data-testid="pokemon-image"
              />
            </div>

            
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm font-medium text-gray-400">
                  #{String(pokemon.id).padStart(4, '0')}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {displayName}
                </h1>
              </div>

              
              <div className="flex gap-2" data-testid="pokemon-types">
                {pokemon.types.map(({ type }: PokemonType) => (
                  <TypeBadge key={type.name} type={type.name} />
                ))}
              </div>

              
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Height: </span>
                  <span className="font-medium text-gray-800">
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Weight: </span>
                  <span className="font-medium text-gray-800">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Base EXP: </span>
                  <span className="font-medium text-gray-800">
                    {pokemon.base_experience}
                  </span>
                </div>
              </div>

              
              <div>
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Abilities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(({ ability, is_hidden }: PokemonAbility) => (
                    <span
                      key={ability.name}
                      className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                        is_hidden
                          ? 'bg-gray-100 text-gray-500 ring-1 ring-gray-300'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {ability.name.replace(/-/g, ' ')}
                      {is_hidden && (
                        <span className="ml-1 text-gray-400">(hidden)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

         
          <div className="border-t border-gray-100 px-8 py-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Base Stats
            </h2>
            <div className="flex flex-col gap-3">
              {pokemon.stats.map(({ stat, base_stat }: PokemonStat) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <span className="w-24 text-right text-xs font-medium text-gray-500">
                    {formatStatName(stat.name)}
                  </span>
                  <span className="w-10 text-center text-sm font-semibold text-gray-800">
                    {base_stat}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${Math.min((base_stat / 255) * 100, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={base_stat}
                      aria-valuemin={0}
                      aria-valuemax={255}
                      aria-label={`${formatStatName(stat.name)}: ${base_stat}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PokemonDetailPage;
