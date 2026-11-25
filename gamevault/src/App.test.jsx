import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mockGames = [
  {
    id: 1,
    title: "Alpha Shooter",
    genre: "Shooter",
    platform: "PC (Windows)",
    thumbnail: "alpha.jpg",
    release_date: "2024-01-01",
    developer: "Alpha Studio",
    publisher: "Alpha Studio",
    short_description: "A shooting game.",
  },
  {
    id: 2,
    title: "Beta Strategy",
    genre: "Strategy",
    platform: "Web Browser",
    thumbnail: "beta.jpg",
    release_date: "2025-01-01",
    developer: "Beta Studio",
    publisher: "Beta Studio",
    short_description: "A strategy game.",
  },
];

function renderApp(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url) => ({
      ok: true,
      json: async () =>
        String(url).includes("/api/game?")
          ? {
              ...mockGames[0],
              description: "Full game description.",
              screenshots: [],
            }
          : mockGames,
    }))
  );

  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GameVault", () => {
  it("loads games from the API", async () => {
    renderApp();

    expect(await screen.findByText("Alpha Shooter")).toBeInTheDocument();
    expect(screen.getByText("Beta Strategy")).toBeInTheDocument();
  });

  it("filters games using search", async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Alpha Shooter");

    await user.type(
        screen.getByRole("searchbox"),
        "Alpha Shooter"
    );

    expect(screen.getByText("Alpha Shooter")).toBeInTheDocument();
    expect(screen.queryByText("Beta Strategy")).not.toBeInTheDocument();
    });

  it("filters games by genre", async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Alpha Shooter");

    await user.selectOptions(
      screen.getByLabelText("GENRE"),
      "Strategy"
    );

    expect(screen.getByText("Beta Strategy")).toBeInTheDocument();
    expect(screen.queryByText("Alpha Shooter")).not.toBeInTheDocument();
  });

  it("filters games by platform", async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Alpha Shooter");

    await user.selectOptions(
      screen.getByLabelText("PLATFORM"),
      "browser"
    );

    expect(screen.getByText("Beta Strategy")).toBeInTheDocument();
    expect(screen.queryByText("Alpha Shooter")).not.toBeInTheDocument();
  });

  it("sorts games by newest release date", async () => {
    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Alpha Shooter");

    await user.selectOptions(
      screen.getByLabelText("SORT BY"),
      "newest"
    );

    const cards = screen.getAllByRole("article");

    expect(cards[0]).toHaveTextContent("Beta Strategy");
    expect(cards[1]).toHaveTextContent("Alpha Shooter");
  });

  it("adds and saves a favourite game", async () => {
    const user = userEvent.setup();
    renderApp();

    const heading = await screen.findByText("Alpha Shooter");
    const card = heading.closest("article");

    await user.click(
      within(card).getByRole("button", { name: /favourite/i })
    );

    expect(
      within(card).getByRole("button", { name: /favourited/i })
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      JSON.parse(localStorage.getItem("gamevault-favourites"))
    ).toContain(1);
  });

  it("loads saved favourites", async () => {
    localStorage.setItem("gamevault-favourites", "[1]");

    renderApp("/favourites");

    expect(await screen.findByText("Alpha Shooter")).toBeInTheDocument();
    expect(screen.queryByText("Beta Strategy")).not.toBeInTheDocument();
  });

  it("opens an individual game using its route", async () => {
    renderApp("/games/1");

    expect(
      await screen.findByText("Full game description.")
    ).toBeInTheDocument();
  });

  it("handles invalid game URLs", async () => {
    renderApp("/games/999999");

    expect(
      await screen.findByText("Game not found")
    ).toBeInTheDocument();
  });

  it("displays an error when the API fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    renderApp();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Network error"
    );
  });
});