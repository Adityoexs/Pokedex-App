import { usePokemonTypes } from '../hooks/usePokemonTypes';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  const { data, isLoading } = usePokemonTypes();

  return (
    <div className="flex items-center gap-3" data-testid="type-filter">
      <label
        htmlFor="type-select"
        className="text-sm font-medium text-gray-600"
      >
        Filter by type:
      </label>
      <select
        id="type-select"
        value={selectedType ?? ''}
        onChange={(e) => onTypeChange(e.target.value || null)}
        disabled={isLoading}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="">All types</option>
        {data?.results.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
          </option>
        ))}
      </select>
      {selectedType && (
        <button
          onClick={() => onTypeChange(null)}
          className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Clear type filter"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default TypeFilter;
