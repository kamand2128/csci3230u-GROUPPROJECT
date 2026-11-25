import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import GameCard from "./components/GameCard";
import "./gamevault.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import GameDetailsRoute from "./components/GameDetailsRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const view = location.pathname === "/favourites"
    ? "favourites"
    : location.pathname.startsWith("/games/")
      ? "details"
      : "library";
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [favourites, setFavourites] = useState(() => {
    return JSON.parse(localStorage.getItem("gamevault-favourites") || "[]");
  }); 
  const [gameStatuses, setGameStatuses] = useState(() => {
    return JSON.parse(localStorage.getItem("gamevault-statuses") || "{}");
  });

  useEffect(() => {
    localStorage.setItem(
      "gamevault-favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem(
      "gamevault-statuses",
      JSON.stringify(gameStatuses)
    );
  }, [gameStatuses]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://www.freetogame.com/api/games", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load games.");
        }

        const data = await response.json();

        setGames(
          data.map((game) => ({
            ...game,
            platform: game.platform.toLowerCase().includes("browser")
              ? "browser"
              : "pc",
            detailsAvailable: true,
          })),
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchGames();

    return () => controller.abort();
  }, []);

  function toggleFavourite(id) {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function openGameDetails(game) {
    navigate(`/games/${game.id}`);
    window.scrollTo(0, 0);
  }

  function returnToLibrary() {
    navigate("/");
    window.scrollTo(0, 0);
  }

  function handleNavigate(page) {
    navigate(page === "favourites" ? "/favourites" : "/");
  }

  const genres = [...new Set(games.map((game) => game.genre))].sort(
    (a, b) => a.localeCompare(b)
  );

  const filteredGames = games
    .filter((game) =>
      game.title.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter((game) => genre === "all" || game.genre === genre)
    .filter((game) => platform === "all" || game.platform === platform)
    .filter((game) => view !== "favourites" || favourites.includes(game.id))
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);

      if (sort === "newest") {
        return new Date(b.release_date) - new Date(a.release_date);
      }

      if (sort === "oldest") {
        return new Date(a.release_date) - new Date(b.release_date);
      }

      return 0;
    });

  return (
    <>
      <Navbar view={view} onNavigate={handleNavigate} />
        <Routes>
          <Route
            path="/games/:id"
            element={
              <GameDetailsRoute
                games={games}
                loading={loading}
                error={error}
                favourites={favourites}
                toggleFavourite={toggleFavourite}
                gameStatuses={gameStatuses}
                setGameStatuses={setGameStatuses}
                returnToLibrary={returnToLibrary}
              />
            }
          />

          <Route
            path="*"
            element={
        <main>
          <section
            className="search-section"
            aria-labelledby="discover-heading"
          >
            <h1 id="discover-heading">
              <span aria-hidden="true">&gt;&gt;</span> DISCOVER GAMES
            </h1>
            <p>FIND YOUR NEXT FREE-TO-PLAY GAME</p>

            <form
              className="search-form"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="game-search">Search games</label>
              <input
                type="search"
                id="game-search"
                placeholder="Search for games..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit" aria-label="Search games">
                →
              </button>
            </form>
          </section>

          <div className="library-layout">
            <aside className="filters" aria-label="Game filters">
              <h2>FILTERS</h2>

              <label htmlFor="genre">GENRE</label>
              <select
                id="genre"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                <option value="all">All Genres</option>
                {genres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="platform">PLATFORM</label>
              <select
                id="platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="pc">PC (Windows)</option>
                <option value="browser">Web Browser</option>
              </select>

              <label htmlFor="sort">SORT BY</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="relevance">Default</option>
                <option value="newest">Release Date (Newest)</option>
                <option value="oldest">Release Date (Oldest)</option>
                <option value="az">Title (A–Z)</option>
                <option value="za">Title (Z–A)</option>
              </select>
            </aside>

            <section className="games-section" aria-labelledby="games-heading">
              <h2 id="games-heading">
                {view === "favourites" ? "FAVOURITE GAMES" : "AVAILABLE GAMES"}
              </h2>

              {loading && (
                <p role="status">Loading games...</p>
              )}

              {error && (
                <p role="alert">{error}</p>
              )}

              <div className="games-grid">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavourite={favourites.includes(game.id)}
                    onToggleFavourite={toggleFavourite}
                    onViewDetails={openGameDetails}
                  />
                ))}
              </div>

              {!loading && !error && filteredGames.length === 0 && (
                <p>No games found.</p>
              )}
            </section>
          </div>
        </main>
      }
        />
</Routes>

      <footer>
        <p>GameVault — CSCI 3230U Group Project</p>
      </footer>
    </>
  );
}

export default App;
