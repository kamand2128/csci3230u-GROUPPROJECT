import GameDetails from "./components/GameDetails";
import { useState } from "react";
import games from "./data/games.json";
import Navbar from "./components/Navbar";
import GameCard from "./components/GameCard";
import "./gamevault.css";

function App() {
  const [view, setView] = useState("library");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [favourites, setFavourites] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameStatuses, setGameStatuses] = useState({});

  function toggleFavourite(id) {
    setFavourites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function openGameDetails(game) {
  setSelectedGame(game);
  setView("details");
  window.scrollTo(0, 0);
  } 

  function returnToLibrary() {
    setSelectedGame(null);
    setView("library");
    window.scrollTo(0, 0);
  }

  const filteredGames = games
    .filter((game) =>
      game.title.toLowerCase().includes(search.toLowerCase().trim())
    )
    .filter((game) =>
      genre === "all" ||
      game.genre.toLowerCase().replaceAll(" ", "-") === genre ||
      (genre === "rpg" && game.genre.includes("RPG"))
    )
    .filter((game) => platform === "all" || game.platform === platform)
    .filter((game) =>
      view !== "favourites" || favourites.includes(game.id)
    )
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <>
      <Navbar view={view} onNavigate={setView} />

      {view === "details" && selectedGame ? (
      <GameDetails
        key={selectedGame.id}
        game={selectedGame}
        isFavourite={favourites.includes(selectedGame.id)}
        onToggleFavourite={toggleFavourite}
        onBack={returnToLibrary}
        gameStatus={gameStatuses[selectedGame.id] || "not-started"}
        onStatusChange={(status) =>
          setGameStatuses((previous) => ({
            ...previous,
            [selectedGame.id]: status
          }))
        }
      />
    ) : (
      <main>
        <section className="search-section" aria-labelledby="discover-heading">
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
            <button type="submit" aria-label="Search games">→</button>
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
              <option value="shooter">Shooter</option>
              <option value="mmorpg">MMORPG</option>
              <option value="rpg">RPG</option>
              <option value="strategy">Strategy</option>
              <option value="moba">MOBA</option>
              <option value="battle-royale">Battle Royale</option>
              <option value="fighting">Fighting</option>
              <option value="sports">Sports</option>
              <option value="racing">Racing</option>
              <option value="card-game">Card Game</option>
              <option value="sandbox">Sandbox</option>
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

            {filteredGames.length === 0 && (
              <p>No games found.</p>
            )}
          </section>
        </div>
      </main>
      )}

      <footer>
        <p>GameVault — CSCI 3230U Group Project</p>
      </footer>
    </>
  );
}

export default App;
