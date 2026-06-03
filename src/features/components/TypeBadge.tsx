
const TYPE_COLOURS: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-300 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-stone-500 text-white',
  ghost: 'bg-violet-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-slate-400 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

interface TypeBadgeProps {
  type: string;
}

function TypeBadge({ type }: TypeBadgeProps) {
  const colour = TYPE_COLOURS[type] ?? 'bg-gray-400 text-white';
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${colour}`}
    >
      {type}
    </span>
  );
}

export default TypeBadge;
