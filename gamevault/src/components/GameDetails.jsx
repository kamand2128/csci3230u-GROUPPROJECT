import { useState, useEffect } from "react";

function GameDetails({
  game,
  isFavourite,
  onToggleFavourite,
  onBack,
  gameStatus,
  onStatusChange //added so played/not started, etc status is rememberd

}) {
  const [selectedImage, setSelectedImage] = useState(game.thumbnail);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(() => {
    return JSON.parse(
      localStorage.getItem(`gamevault-reviews-${game.id}`) || "[]"
    );
  });

  useEffect(() => {
    localStorage.setItem(
      `gamevault-reviews-${game.id}`,
      JSON.stringify(reviews)
    );
  }, [reviews, game.id]);

  function handleReviewSubmit(event) {
    event.preventDefault();

    if (!reviewName.trim() || !reviewText.trim()) {
      return;
    }

    const newReview = {
      id: crypto.randomUUID(),
      name: reviewName.trim(),
      text: reviewText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews((previous) => [newReview, ...previous]);

    setReviewName("");
    setReviewText("");
    setShowReviewForm(false);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetails() {
      try {
        setDetailsLoading(true);
        setDetailsError(null);

        const response = await fetch(
          `https://www.freetogame.com/api/game?id=${game.id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load game details.");
        }

        const data = await response.json();
        setDetails(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setDetailsError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailsLoading(false);
        }
      }
    }

    fetchDetails();

    return () => controller.abort();
  }, [game.id]);

  const screenshots = [
    game.thumbnail,
    ...(details?.screenshots || []).map((image) => image.image),
  ];

  return (
    <main className="game-details">
      <button
        type="button"
        className="back-link"
        onClick={onBack}
      >
        ← BACK TO LIBRARY
      </button>

      <section className="game-overview" aria-label="Game overview">
        <div className="game-gallery">
          <img
            className="game-main-image"
            src={selectedImage}
            alt={`${game.title} artwork`}
          />

          <div className="game-thumbnails">
            {screenshots.map((image, index) => (
              <button
                key={image}
                type="button"
                className="thumbnail-button"
                onClick={() => setSelectedImage(image)}
                aria-label={`View screenshot ${index + 1}`}
                aria-pressed={selectedImage === image}
              >
                <img
                  src={image}
                  alt={`${game.title} screenshot ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="game-information">
          <div className="game-title-row">
            <h1>{game.title.toUpperCase()}</h1>

            <button
              type="button"
              className="favourite-button"
              aria-pressed={isFavourite}
              onClick={() => onToggleFavourite(game.id)}
            >
              {isFavourite
                ? "♥ REMOVE FAVOURITE"
                : "♡ ADD TO FAVOURITES"}
            </button>
          </div>

          <p className="game-meta">
            {game.genre} | {game.platform === "pc" ? "PC (Windows)" : "Web Browser"} | {game.release_date}
          </p>

          <div className="game-status">
            <label htmlFor="game-status">GAME STATUS</label>

            <select
              id="game-status"
              value={gameStatus}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="not-started">Not Started</option>
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <section className="quick-info">
            <h2>QUICK INFO</h2>

            <dl>
              <div>
                <dt>GENRE</dt>
                <dd>{game.genre}</dd>
              </div>
              <div>
                <dt>PLATFORM</dt>
                <dd>{game.platform === "pc" ? "PC (Windows)" : "Web Browser"}</dd>
              </div>
              <div>
                <dt>RELEASE DATE</dt>
                <dd>{game.release_date}</dd>
              </div>
              <div>
                <dt>DEVELOPER</dt>
                <dd>{game.developer}</dd>
              </div>
              <div>
                <dt>PUBLISHER</dt>
                <dd>{game.publisher}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>

      <div className="game-bottom">
        <section
          className="game-description"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading">ABOUT THIS GAME</h2>
          {detailsLoading && <p role="status">Loading game details...</p>}

          {detailsError && <p role="alert">{detailsError}</p>}

          <p>{details?.description || game.short_description}</p>
        </section>

        <section
          className="game-reviews"
          aria-labelledby="reviews-heading"
        >
          <div className="reviews-header">
            <h2 id="reviews-heading">REVIEWS</h2>
            <button
              type="button"
              className="review-button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              aria-expanded={showReviewForm}
            >
              {showReviewForm ? "CANCEL" : "✎ WRITE A REVIEW"}
            </button>
          </div>
            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <label htmlFor="review-name">Your name</label>
                <input
                  id="review-name"
                  type="text"
                  value={reviewName}
                  onChange={(event) => setReviewName(event.target.value)}
                  maxLength={50}
                  required
                />

                <label htmlFor="review-text">Your review</label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  required
                />

                <button type="submit" className="review-button">
                  SUBMIT REVIEW
                </button>
              </form>
            )}

            {reviews.length === 0 && (
              <p>No reviews yet. Be the first to write one!</p>
            )}

            {reviews.map((review) => (
              <article className="review" key={review.id}>
                <div className="review-details">
                  <strong>{review.name}</strong>
                  <time dateTime={review.date}>{review.date}</time>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}

export default GameDetails;
