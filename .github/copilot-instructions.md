Short, focused instructions for AI coding agents working on this repo.

Repository snapshot
- Simple client-side A-Frame WebXR app under `docs/` (no server code).
- Custom A-Frame components live in `docs/components/` (e.g. `blankwall.js`, `chair_component.js`, `door.js`).
- Skybox helper in `docs/skybox/alt_sky.js` creates a THREE.BoxGeometry skybox.
- Docker workflow in `README.md` provides the primary development/run commands.

What matters most (big picture)
- This is a static VR scene: `docs/index.html` composes an `<a-scene>` and wires custom components.
- Custom components are small, pure DOM/AFRAME scripts that register with `AFRAME.registerComponent(...)`.
  - They construct and mutate child `a-entity` nodes and set attributes (`geometry`, `material`, `position`, etc.).
- There is no backend or build step: editing files under `docs/` and reloading the page is the main dev loop.

Project-specific conventions
- Component files follow a pattern: `schema` defines parameters; `init`, `update`, `remove` handle lifecycle.
  - Example: `docs/components/chair_component.js` rebuilds geometry on parameter changes and stores parts in `this.parts`.
- Units/anchors: `blank-wall` uses `units: 'ft'|'m'` and auto-anchors to ground when `anchor: 'ground'` is set.
- Skybox file names expected under `docs/skybox/` (see `alt_sky.js` names map). If images differ, set `swapUpDown` or rename to match.

Dev & run tasks (explicit)
- Quick local run (Docker, Windows PowerShell):
  - Build image: `docker build -t vrxp_img .`
  - Run container (mounts local `docs/`):
    `docker run -it --rm -p 8080:8080 -v "$PWD\public":/app/public --name vrxp_con vrxp_img`
  - Inspect a shell inside container: `docker exec -it vrxp_con /bin/sh`
- No `npm start` / bundler present. Editing `docs/*.js` and reloading the served page is expected.

Patterns to follow when modifying code
- Keep components small and idempotent: use `schema` + `update()` to reapply attribute/material changes.
- Use `this.parts` or similar to track created DOM children so `remove()` can clean up.
- Prefer setting A-Frame attributes (e.g., `el.setAttribute('geometry', {...})`) over manual three.js plumbing unless necessary.

Files to read first (in order)
1. `README.md` — Docker run/dev notes.
2. `docs/index.html` — scene composition and how components are used.
3. `docs/components/*.js` — implementation patterns and lifecycle.
4. `docs/skybox/alt_sky.js` — THREE/texture expectations for sky images.

Common gotchas and checks for AI edits
- Avoid introducing external build steps; the repo expects static files served from `docs/`.
- When changing component schema defaults, check `docs/index.html` usage for implicit assumptions (units, anchor behavior).
- If adding image assets, verify filenames match `alt_sky.js` naming (`graycloud_rt`, `graycloud_lf`, etc.) or update the component.

If something is unclear
- Ask where new assets should be placed (usually `docs/` or `docs/skybox/`).
- Confirm whether the user wants a bundler/build step before adding package.json scripts.

When you finish a change
- Run the Docker container (or a simple static server) and open localhost:8080 to verify the scene loads and console has no errors.

End of file — ask me if you want this expanded with code examples or tests.
