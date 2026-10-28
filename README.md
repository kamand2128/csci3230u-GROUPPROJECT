
# GameVault

## Project Overview

GameVault is a video game library web application that allows users to discover, browse, and keep track of video games. The aim is to create a simple and accessible website where users can search for games, explore different genres, view game information, and save titles they are interested in.

## Course Information

- Course: CSCI 3230U
- Project: Group Project
- Project Name: GameVault

## Team Members

| Member | GitHub Username | Role |
|--------|-----------------|------|
| Pending | kamand2128 | Project planning and development |

## Project Topic

**Domain:** Video Games

GameVault will focus on providing an easy way for users to explore video games through a searchable and filterable catalogue.

Planned features include:
- Browsing a collection of video games
- Searching for games by title
- Filtering games by genre or platform
- Sorting games by rating or release date
- Viewing detailed information about individual games
- Saving favourite games
- Keeping track of games users want to play

These are the current features I am aiming for but may be subject to change in the future.

## Candidate API

**API:** FreeToGame

**Documentation:** https://www.freetogame.com/api-doc

FreeToGame provides access to video game information such as titles, genres, platforms, release dates, ratings, descriptions, and images.

This API is being considered because it offers the information needed to create a searchable video game catalogue with individual game detail pages.

API suitability, access requirements, and usage limitations will be reviewed during development.

## Technology

The project is expected to use:

- HTML5
- CSS3
- JavaScript
- Git and GitHub
- RAWG API

## Project Milestones

- [ ] M0 - Team and Topic
- [ ] M1 - Proposal and Static Prototype
- [ ] M2 - React Foundation
- [ ] M3 - Working Application
- [ ] M4 - Independent Concept and Video

## Project Status

GameVault is currently in the initial planning and setup stage.


## Milestone 2 — React Foundation

GameVault has been converted from a static HTML/CSS prototype into an interactive single-page application using Vite and React.

### Running the Application

Make sure Node.js and npm are installed.

From the repository root, run:

```bash
cd gamevault
npm install
npm run dev
```

Open the local URL displayed in the terminal.

### Implemented Features

- Reusable React components
- Game library with six games using local mock data
- Search and genre/platform filtering
- Interactive favourites
- Overwatch game details page
- Screenshot gallery
- Game status selection
- State management with React hooks

### Testing

The application has been tested using:

```bash
npm run build
npm run lint
```

Both commands completed successfully.
