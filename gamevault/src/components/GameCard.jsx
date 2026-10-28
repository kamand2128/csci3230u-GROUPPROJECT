
function GameCard({ game, isFavourite, onToggleFavourite, onViewDetails }) {
  return (
    <article className="game-card">
      <img src={game.thumbnail} alt={`${game.title} game thumbnail`} />

      <h3>{game.title}</h3>
      <p>{game.genre}</p>

      <button
        type="button"
        onClick={() => onToggleFavourite(game.id)}
        aria-pressed={isFavourite}
      >
        {isFavourite ? "★ Favourited" : "☆ Favourite"}
      </button>

      {game.detailsAvailable ? (
        <button type="button" onClick={() => onViewDetails(game)}>
          View Details
        </button>
      ) : (
        <span className="unavailable">Details Coming Soon</span>
      )}
    </article>
  );
}

export default GameCard;
