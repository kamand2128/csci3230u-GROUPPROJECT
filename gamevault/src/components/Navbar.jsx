
function Navbar({ view, onNavigate }) {
  return (
    <header className="site-header">
      <a
        href="#library"
        className="logo"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("library");
        }}
      >
        <span className="logo-star" aria-hidden="true">✧</span>
        <span className="logo-text">GAMEVAULT</span>
      </a>

      <nav aria-label="Main navigation">
        <a
          href="#library"
          aria-current={view === "library" ? "page" : undefined}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("library");
          }}
        >
          LIBRARY
        </a>

        <a
          href="#favourites"
          aria-current={view === "favourites" ? "page" : undefined}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("favourites");
          }}
        >
          FAVOURITES
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
