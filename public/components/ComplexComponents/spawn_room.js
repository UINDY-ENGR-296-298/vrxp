(function () {
  const roomOrigin = new AFRAME.THREE.Vector3(0, 0, 0);

  // Public folder font (both must be reachable):
  // /fonts/Roboto-msdf.json
  // /fonts/Roboto-msdf.png
  const FONT_URL = "/fonts/Roboto-msdf.json";
  const FONT_IMAGE_URL = "/fonts/Roboto-msdf.png";

  function ensureRoot(scene) {
    let root = scene.querySelector("#room-root");
    if (!root) {
      root = document.createElement("a-entity");
      root.id = "room-root";
      scene.appendChild(root);
    }
    if (root.dataset.built === "true") return null;
    root.dataset.built = "true";
    root.setAttribute("position", `${roomOrigin.x} ${roomOrigin.y} ${roomOrigin.z}`);
    return root;
  }

  function makeFloor(width, depth, y = 0) {
    const floor = document.createElement("a-plane");
    floor.setAttribute("geometry", `primitive: plane; width: ${width}; height: ${depth}`);
    floor.setAttribute("position", `0 ${y} 0`);
    floor.setAttribute("rotation", "-90 0 0");
    floor.setAttribute("material", "color: #bdbdbd");
    floor.setAttribute("shadow", "receive: true");
    return floor;
  }

  // Path that starts at (startX,startZ) and extends forward by `length` in direction rotY
  function makePath(startX, startZ, length, y = 0.02, width = 2, rotY = 0) {
    const path = document.createElement("a-plane");
    path.setAttribute("geometry", `primitive: plane; width: ${width}; height: ${length}`);
    path.setAttribute("rotation", `-90 ${rotY} 0`);

    const rad = (rotY * Math.PI) / 180;
    const dirX = Math.sin(rad);
    const dirZ = -Math.cos(rad);

    const centerX = startX + dirX * (length / 2);
    const centerZ = startZ + dirZ * (length / 2);

    path.setAttribute("position", `${centerX} ${y} ${centerZ}`);
    path.setAttribute("material", `src: #pathTex; repeat: 1 ${Math.max(1, length / 2)};`);
    path.setAttribute("shadow", "receive: true");
    return path;
  }

  // Path between two points, using makePath under the hood
  function makePathBetween(startX, startZ, endX, endZ, y = 0.02, width = 2) {
    const dx = endX - startX;
    const dz = endZ - startZ;
    const length = Math.sqrt(dx * dx + dz * dz);
    const rotY = (Math.atan2(dx, -dz) * 180) / Math.PI; // rotY=0 points toward -Z
    return makePath(startX, startZ, length, y, width, rotY);
  }

  // Path between points, extended past the end by extraLength
  function makePathBetweenExtended(startX, startZ, endX, endZ, y = 0.02, width = 2, extraLength = 0) {
    const dx = endX - startX;
    const dz = endZ - startZ;

    const baseLen = Math.sqrt(dx * dx + dz * dz);
    if (baseLen === 0) return null;

    const ux = dx / baseLen;
    const uz = dz / baseLen;

    const extendedEndX = endX + ux * extraLength;
    const extendedEndZ = endZ + uz * extraLength;

    return makePathBetween(startX, startZ, extendedEndX, extendedEndZ, y, width);
  }

  function makeCeiling(width, depth, height) {
    const ceiling = document.createElement("a-plane");
    ceiling.setAttribute("geometry", `primitive: plane; width: ${width}; height: ${depth}`);
    ceiling.setAttribute("position", `0 ${height} 0`);
    ceiling.setAttribute("rotation", "90 0 0");
    ceiling.setAttribute("material", "color: #efefef; side: double");
    return ceiling;
  }

  function makeWall(width, height, thickness, x, y, z, rotY) {
    const wall = document.createElement("a-box");
    wall.setAttribute("geometry", `primitive: box; width: ${width}; height: ${height}; depth: ${thickness}`);
    wall.setAttribute("position", `${x} ${y} ${z}`);
    wall.setAttribute("rotation", `0 ${rotY} 0`);
    wall.setAttribute("material", "color: #e6e6e6");
    wall.setAttribute("shadow", "cast: true; receive: true");
    return wall;
  }

  function makeTeleportPad(opts) {
    const pad = document.createElement("a-entity");
    pad.setAttribute("position", `${opts.x} ${opts.y || 0} ${opts.z}`);
    pad.setAttribute("rotation", `0 ${opts.rotY || 0} 0`);

    // teleport-pad component must already be registered (teleport-pad.js loaded before this file)
    pad.setAttribute(
      "teleport-pad",
      `to: ${opts.to}; radius: ${opts.radius || 1.2}; fadetime: ${opts.fadetime || 800}; ` +
        `width: ${opts.width || 2}; depth: ${opts.depth || 2}; ` +
        `color: ${opts.color || "#1e90ff"}; glowColor: ${opts.glowColor || "#00ffff"}`
    );

    return pad;
  }

  // MSDF text helper: forces both JSON and PNG to be requested.
  function makeMsdfText(opts) {
    const t = document.createElement("a-entity");
    t.setAttribute("position", `${opts.x || 0} ${opts.y || 0} ${opts.z || 0}`);
    t.setAttribute("rotation", `${opts.rx || 0} ${opts.ry || 0} ${opts.rz || 0}`);

    t.setAttribute(
      "text",
      `value: ${opts.value || "TEXT"}; ` +
        `align: ${opts.align || "center"}; ` +
        `color: ${opts.color || "#111"}; ` +
        `width: ${opts.width || 10}; ` +
        `wrapCount: ${opts.wrapCount || 28}; ` +
        `shader: msdf; ` +
        `font: ${FONT_URL}; ` +
        `fontImage: ${FONT_IMAGE_URL};`
    );

    return t;
  }

  // Flat panel (plane) with MSDF text on top, now clickable + dismissible.
  function makeTextPanel(opts) {
  const panel = document.createElement("a-entity");
  panel.setAttribute("position", `${opts.x || 0} ${opts.y || 0} ${opts.z || 0}`);
  panel.setAttribute("rotation", `0 ${opts.rotY || 0} 0`);

  const w = opts.width || 10;
  const h = opts.height || 3;
  const yCenter = opts.centerY !== undefined ? opts.centerY : h / 2;

  const dismissOnClick = opts.dismissOnClick !== undefined ? opts.dismissOnClick : true;

  // helper: hide whole panel
  const hidePanel = () => {
    panel.setAttribute("visible", "false");
  };

  // Background plane (this is what you usually hit)
  const bg = document.createElement("a-plane");
  bg.setAttribute("geometry", `primitive: plane; width: ${w}; height: ${h}`);
  bg.setAttribute(
    "material",
    `color: ${opts.bgColor || "#ffffff"}; opacity: ${opts.bgOpacity ?? 0.85}; transparent: true; side: double`
  );
  bg.setAttribute("position", `0 ${yCenter} 0`);

  // Make the BG hittable by your raycaster
  bg.classList.add("clickable");

  if (dismissOnClick) {
    bg.addEventListener("click", (e) => {
      e.stopPropagation();
      hidePanel();
    });
  }

  panel.appendChild(bg);

  // Text entity (also make it clickable, in case you click letters)
  const txt = makeMsdfText({
    value: opts.value || "Text",
    x: 0,
    y: yCenter,
    z: 0.01,
    width: opts.textWidth || 14,
    wrapCount: opts.wrapCount || 34,
    color: opts.textColor || "#111",
    align: opts.align || "center"
  });

  txt.classList.add("clickable");

  if (dismissOnClick) {
    txt.addEventListener("click", (e) => {
      e.stopPropagation();
      hidePanel();
    });
  }

  panel.appendChild(txt);

  return panel;
}

  function buildRoom(root) {
    const room = document.createElement("a-entity");
    room.id = "room";
    root.appendChild(room);

    const ROOM_WIDTH = 20;
    const ROOM_DEPTH = 30;
    const ROOM_HEIGHT = 6;
    const WALL_THICKNESS = 0.2;

    const halfW = ROOM_WIDTH / 2;
    const halfD = ROOM_DEPTH / 2;

    room.appendChild(makeFloor(ROOM_WIDTH, ROOM_DEPTH, 0));
    room.appendChild(makeCeiling(ROOM_WIDTH, ROOM_DEPTH, ROOM_HEIGHT));

    const wallY = ROOM_HEIGHT / 2;
    room.appendChild(makeWall(ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS, 0, wallY, halfD, 0));
    room.appendChild(makeWall(ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS, 0, wallY, -halfD, 0));
    room.appendChild(makeWall(ROOM_DEPTH, ROOM_HEIGHT, WALL_THICKNESS, halfW, wallY, 0, 90));
    room.appendChild(makeWall(ROOM_DEPTH, ROOM_HEIGHT, WALL_THICKNESS, -halfW, wallY, 0, 90));

    // ===== Teleporter location =====
    const portalX = 0;
    const portalZ = -halfD + 3;

    const teleporter = makeTeleportPad({
      x: portalX,
      y: 0,
      z: portalZ,
      rotY: 0,
      to: "three_d_map.html",
      radius: 1.2,
      fadetime: 800,
      width: 2.2,
      depth: 2.2,
      color: "#cb4abc",
      glowColor: "#a01fa7"
    });
    room.appendChild(teleporter);

    // ===== Path from spawn to teleporter =====
    const spawnX = 0;
    const spawnZ = 8;

    const path1 = makePathBetweenExtended(spawnX, spawnZ, portalX, portalZ, 0.02, 2, 1.5);
    if (path1) room.appendChild(path1);

    const path2 = makePathBetween(0, 0, -7, 0, 0.02, 2);
    if (path2) room.appendChild(path2);

    // ===== Clickable instruction panels (click to dismiss) =====
    room.appendChild(
      makeTextPanel({
        x: portalX + 2,
        y: 0.5,
        z: portalZ,
        rotY: -45,
        value: "This is a Teleportor, they may appeir in many different colors. Simply step inside to use.",
        width: 2,
        height: 2,
        textWidth: 2,
        wrapCount: 14,
        bgColor: "#d27c7c",
        bgOpacity: 0.85,
        textColor: "#111",
        align: "center",
        dismissOnClick: true
      })
    );

    room.appendChild(
      makeTextPanel({
        x: spawnX,
        y: 1,
        z: spawnZ - 8,
        rotY: 0,
        value: "Use WASD to move and the arrow keys to look around. Explor the Path to learn more. \n\nBy clicking on text pannels you confirm your understanding and may continue",
        width: 2,
        height: 3.5,
        textWidth: 2,
        wrapCount: 14,
        bgColor: "#cb5c3b",
        bgOpacity: 0.85,
        textColor: "#111",
        align: "center",
        dismissOnClick: true
      })
    );

    const aimDot = document.querySelector("#aimDot");
        if (aimDot && aimDot.components && aimDot.components.raycaster) {
        aimDot.components.raycaster.refreshObjects();
        }

  }

  function onSceneReady() {
    const scene = document.querySelector("a-scene");
    const root = ensureRoot(scene);
    if (!root) return;
    buildRoom(root);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const scene = document.querySelector("a-scene");
    if (!scene) {
      console.error("No <a-scene> found in DOM. Room cannot build.");
      return;
    }
    if (scene.hasLoaded) onSceneReady();
    else scene.addEventListener("loaded", onSceneReady);
  });
})();
