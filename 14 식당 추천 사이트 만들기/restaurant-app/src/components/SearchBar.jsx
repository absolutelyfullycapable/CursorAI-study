export default function SearchBar({ value, onChange, onSearch, disabled }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="식당 이름 또는 주소를 입력하세요"
        disabled={disabled}
        aria-label="식당 검색"
      />
      <button className="search-bar__button" type="submit" disabled={disabled}>
        검색하기
      </button>
    </form>
  );
}
