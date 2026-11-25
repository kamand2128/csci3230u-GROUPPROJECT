import { useParams } from "react-router-dom";
import GameDetails from "./GameDetails";

export default function GameDetailsRoute({
  games,
  loading,
  error,
  favourites,
  toggleFavourite,
  gameStatuses,
  setGameStatuses,
  returnToLibrary,
}) {
  const { id } = useParams();

  const game = games.find((game) => String(game.id) === id);

  if (loading) {
    return <p role="status">Loading game...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!game) {
    return (
      <main>
        <h1>Game not found</h1>
        <button onClick={returnToLibrary}>
          Return to Library
        </button>
      </main>
    );
  }

  return (
    <GameDetails
      key={game.id}
      game={game}
      isFavourite={favourites.includes(game.id)}
      onToggleFavourite={toggleFavourite}
      onBack={returnToLibrary}
      gameStatus={gameStatuses[game.id] || "not-started"}
      onStatusChange={(status) =>
        setGameStatuses((previous) => ({
          ...previous,
          [game.id]: status,
        }))
      }
    />
  );
}