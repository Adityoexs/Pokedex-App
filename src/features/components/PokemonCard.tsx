import { Link } from 'react-router-dom';
import { getPokemonIdFromUrl } from '../../lib/utils';

interface PokemonCardProps {
  name: string;
  url: string;
}

function PokemonCard({ name, url }: PokemonCardProps) {
  const id = getPokemonIdFromUrl(url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Link
      to={`/pokemon/${name}`}
      className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      data-testid={`pokemon-card-${name}`}
    >
      <div className="flex h-28 w-28 items-center justify-center">
        <img
          src={imageUrl}
          alt={displayName}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="mt-2 text-xs font-medium text-gray-400">
        #{String(id).padStart(4, '0')}
      </span>
      <span className="mt-1 text-sm font-semibold text-gray-700 capitalize">
        {displayName}
      </span>
    </Link>
  );
}

export default PokemonCard;
