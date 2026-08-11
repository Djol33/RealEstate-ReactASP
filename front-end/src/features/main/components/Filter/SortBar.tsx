interface SortBarProps {
  sortBy: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SortBar({ sortBy, onChange }: SortBarProps) {
  return (
    <div className="row">
      <label htmlFor="sortBy">Sort by</label>
      <select name="sortBy" id="sortBy" value={sortBy} onChange={onChange}>
        <option value="">Newest</option>
        <option value="priceAsc">Price: low to high</option>
        <option value="priceDesc">Price: high to low</option>
        <option value="areaDesc">Largest area</option>
      </select>
    </div>
  );
}
