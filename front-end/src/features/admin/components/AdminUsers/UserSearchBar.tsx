interface UserSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  return (
    <div className="user-search-bar">
      <i className="fa-solid fa-magnifying-glass" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="clear-search" onClick={() => onChange('')} aria-label="Clear search">
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}
