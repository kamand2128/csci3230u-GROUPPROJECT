
import { useState } from "react";

function GameDetails({
  game,
  isFavourite,
  onToggleFavourite,
  onBack,
  gameStatus,
  onStatusChange //added so played/not started, etc status is rememberd

}) {
  const screenshots = [
    game.thumbnail,
    "https://www.freetogame.com/g/540/overwatch-2-1.jpg",
    "https://www.freetogame.com/g/540/overwatch-2-2.jpg",
    "https://www.freetogame.com/g/540/overwatch-2-3.jpg"
  ];

  const [selectedImage, setSelectedImage] = useState(game.thumbnail);

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
            Shooter | PC (Windows) | 2022-10-04
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
                <dd>Shooter</dd>
              </div>
              <div>
                <dt>PLATFORM</dt>
                <dd>PC (Windows)</dd>
              </div>
              <div>
                <dt>RELEASE DATE</dt>
                <dd>2022-10-04</dd>
              </div>
              <div>
                <dt>DEVELOPER</dt>
                <dd>Blizzard Entertainment</dd>
              </div>
              <div>
                <dt>PUBLISHER</dt>
                <dd>Activision Blizzard</dd>
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
          <p>
            Overwatch is a team-based first-person shooter
            developed by Blizzard Entertainment. Players
            choose from a range of heroes with different
            abilities and work together to complete
            objectives in multiplayer matches.
          </p>
        </section>

        <section
          className="game-reviews"
          aria-labelledby="reviews-heading"
        >
          <div className="reviews-header">
            <h2 id="reviews-heading">REVIEWS</h2>
            <button type="button" className="review-button" disabled>
              ✎ WRITE A REVIEW
            </button>
          </div>

          <article className="review">
            <div className="review-details">
              <strong>PlayerOne</strong>
              <time dateTime="2026-10-10">2026-10-10</time>
            </div>
            <p>
              Really enjoyable team-based gameplay with
              a good variety of heroes.
            </p>
          </article>

          <article className="review">
            <div className="review-details">
              <strong>GameFan</strong>
              <time dateTime="2026-10-12">2026-10-12</time>
            </div>
            <p>
              Fun with friends, especially when working
              together as a team.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default GameDetails;
