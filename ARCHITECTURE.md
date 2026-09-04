# VRXP Architecture

## Overview

This repository is a static A-Frame WebXR experience built entirely in the browser with no frontend build step.
The app is served from `public/`, and the scene is composed from HTML, A-Frame primitives, and custom components.
The primary runtime entry point is `public/index.html`, with additional scene pages in `public/*.html`.

## Key Technologies

- A-Frame 1.5.0 via CDN
- A-Frame Physics System via CDN (`aframe-physics-system`)
- Custom A-Frame components under `public/components/`
- Static assets in `public/fonts/`, `public/images/`, `public/media/`, `public/models/`
- Docker + nginx for hosting from the root `Dockerfile`

## Repository Layout

- `ARCHITECTURE.md` — this document
- `USAGE.md` - detailed instructions on how to deploy and run the project
- `README.md` — basic docker commands and naming conventions
- `Dockerfile` — copies `public/` into nginx and exposes port 80
- `public/` — served web app root
  - `index.html` — main VR load-in scene
  - `*.html` — additional scene pages and demo pages
  - `components/` — custom A-Frame components and reusable scripts
  - `skybox/` — skybox loader scripts and sky helper code
  - `fonts/`, `images/`, `media/`, `models/` — static assets
  - `package.json` — metadata; not required for runtime

## Runtime Architecture

### Scene Composition

`public/index.html` is the primary scene page and includes:

- `aframe.min.js`
- `aframe-physics-system.min.js`
- Custom scripts from `public/components/` and `public/skybox/`
- A single `<a-scene>` with:
  - `scene-fade` for page fade transitions
  - `skybox-box` for the environmental skybox
- A camera rig entity `#rig` that contains:
  - `dynamic-body` for physics interaction
  - `wasd-move-only` for keyboard movement
  - `arrow-look` for look rotation controls
  - A child `<a-camera>` with raycast cursor and `hud-coords` HUD entity

### Navigation and Interaction

The main scene uses `teleport-pad` entities as teleport stations.
When the player enters a `teleport-pad` zone, the component fades the screen and changes `window.location.href` to a different HTML page.
This is the primary navigation model between distinct pages in the app.

## Component Architecture

Custom components are organized into categories but share a common implementation style:

- `schema` defines configurable component properties
- `init()` performs setup, creates child entities, and registers event listeners
- `tick()` runs per frame when needed
- `remove()` cleans up listeners and DOM state

### Component folders

- `public/components/` — core application components
- `public/components/CoffeeShopComponents/` — components specifically used in the coffee shop
- `public/components/ComplexComponents/` — larger scene builders and room constructors
- `public/components/OtherComponents/` — utility or interaction helpers

### Important components

- `wasd-move.js` — custom WASD locomotion on the rig
- `arrow-look.js` — rotate view using arrow keys and pointer drag
- `teleport-pad.js` — teleport triggers, glowing pad visuals, page transitions, objective completion
- `scene-fade.js` — screen fade overlay for transitions
- `collision.js` — collision/collider helper component
- `hud.js` — on-screen coordinate readout and objective display
- `cookies.js` — cookie utilities and objective persistence helpers
- `ComplexComponents/spawn_room.js` — procedural room builder and interactive instruction panels

### Skybox code

- `public/skybox/skycomponent.js` — skybox loader used by `index.html`
- `public/skybox/alt_sky.js` and `public/skybox/chang_skycomponent.js` — alternative skybox implementations

## Objective and HUD System

The project contains a simple HUD and objective system:

- `hud-coords` renders current rig coordinates and objective text using MSDF fonts
- HUD events include `hud-set-objective`, `hud-set-objectives`, and `hud-complete-objective`
- `cookies.js` manages cookie storage for objective progress using `objectives_v2`
- `index.html` contains inline initialization logic for the current mission list

> Note: `public/index.html` references `components/objectives-init.js`, but this file does not exist in the repo. Objective initialization is currently performed by inline script in `index.html` and the persistence helper functions in `public/components/cookies.js`.

## Deployment and Run Workflow

- Build the Docker image from repo root:
  - `docker build -t vrxp_img .`
- Run the container with `public/` mounted into nginx:
  - Windows: `docker run -it --rm -p 8080:80 -v "$PWD\public":/usr/share/nginx/html --name vrxp_con vrxp_img`
- Access the app in a browser at `http://localhost:8080`

## Development Notes

- This is a static web project: edit files under `public/` and reload the served page.
- There is no bundler or build pipeline in the repo.

## Recommended Focus for Future Developers

1. Start with `public/index.html` to understand the main scene bootstrap.
2. Learn the base components in `public/components/` before modifying page-specific scenes.
3. Use `public/components/ComplexComponents/` for larger procedural room logic rather than inline HTML.
4. Keep component behavior idempotent and clean up DOM/listeners in `remove()`.
5. Keep static assets reachable from `/` paths when referenced from served pages.
