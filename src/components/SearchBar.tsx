interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Поиск товара",
  onClear,
}: SearchBarProps) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
      />
      {value && (
        <button
          className="searchbar-clear"
          type="button"
          onClick={handleClear}
          aria-label="Очистить поиск"
        >
          X
        </button>
      )}
    </div>
  );
}
