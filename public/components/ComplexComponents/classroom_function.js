(function () {
    // ====== CONFIG (now meters directly) ======
    const classroomOrigin = new AFRAME.THREE.Vector3(-15.3, 0, -8);

    const x = 1.5; // scale factor

    // Scale helper
    const S = (v) => v * x;

    // ====== Base dims (meters) -> scaled dims ======
    const ROOM_W = S(9.75359968788481);    // 32 ft
    const ROOM_D = S(7.924799746406408);   // 26 ft
    const WALL_H = S(4.5719998536960045);  // 15 ft
    const WALL_T = S(0.15239999512320015); // 0.5 ft
    const DOOR_W = S(1.828799941478402);   // 6 ft
    const SIDE_OPENING_W = S(1.828799941478402); // 6 ft

    function ensureRoot(scene) {
        let root = scene.querySelector('#classroom-root');
        if (!root) {
            root = document.createElement('a-entity');
            root.id = 'classroom-root';
            scene.appendChild(root);
        }
        if (root.dataset.built === 'true') return null;
        root.dataset.built = 'true';

        // NOTE: origin is left unscaled so the room stays anchored in world space.
        root.setAttribute('position', `${classroomOrigin.x} ${classroomOrigin.y} ${classroomOrigin.z}`);
        return root;
    }

    function buildClassroom(root) {
        const room = document.createElement('a-entity');
        room.id = 'classroom';
        root.appendChild(room);

        // ===== Floor =====
        const floor = document.createElement('a-entity');
        floor.setAttribute('classroom-floor', `width:${ROOM_W}; depth:${ROOM_D}; color:#e7e7ea`);
        room.appendChild(floor);

        // ===== Walls =====
        // Back wall
        const wBack = document.createElement('a-entity');
        wBack.setAttribute(
            'blank-wall',
            `width:${ROOM_W}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        wBack.setAttribute('position', `0 0 ${-ROOM_D / 2}`);
        room.appendChild(wBack);

        // Front wall
        const wFront = document.createElement('a-entity');
        wFront.setAttribute(
            'blank-wall',
            `width:${ROOM_W}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        wFront.setAttribute('position', `0 0 ${ROOM_D / 2}`);
        wFront.setAttribute('rotation', '0 180 0');
        room.appendChild(wFront);

        // Left wall
        const wLeft = document.createElement('a-entity');
        wLeft.setAttribute(
            'blank-wall',
            `width:${ROOM_D}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        wLeft.setAttribute('rotation', '0 90 0');
        wLeft.setAttribute('position', `${-ROOM_W / 2} 0 0`);
        room.appendChild(wLeft);

        // Right wall split around opening
        const segDepth = (ROOM_D - SIDE_OPENING_W) / 2;

        const rightA = document.createElement('a-entity');
        rightA.setAttribute(
            'blank-wall',
            `width:${segDepth}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        rightA.setAttribute('rotation', '0 -90 0');
        rightA.setAttribute('position', `${ROOM_W / 2} 0 ${(SIDE_OPENING_W / 2 + segDepth / 2)}`);
        room.appendChild(rightA);

        const rightB = document.createElement('a-entity');
        rightB.setAttribute(
            'blank-wall',
            `width:${segDepth}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        rightB.setAttribute('rotation', '0 -90 0');
        rightB.setAttribute('position', `${ROOM_W / 2} 0 ${-(SIDE_OPENING_W / 2 + segDepth / 2)}`);
        room.appendChild(rightB);

        // ===== Ceiling =====
        const ceiling = document.createElement('a-box');
        ceiling.setAttribute('width', ROOM_W);
        ceiling.setAttribute('depth', ROOM_D);
        ceiling.setAttribute('height', S(0.06)); // scale thickness too
        ceiling.setAttribute('material', 'color:#f3f4f6; roughness:1');
        ceiling.setAttribute('position', `0 ${WALL_H} 0`);
        room.appendChild(ceiling);

        // ===== Back wall fixtures: whiteboard, screen, double doors =====
        const board = document.createElement('a-entity');
        board.setAttribute(
            'whiteboard',
            `width:${S(3.6575998829568037)}; height:${S(1.3715999561088015)}; frameColor:#222; surfaceColor:#f7fafc`
        );
        board.setAttribute('position', `0 ${S(1.524)} ${-ROOM_D / 2 + S(0.12)}`);
        room.appendChild(board);

        const screen = document.createElement('a-entity');
        screen.setAttribute(
            'projection-screen',
            `width:${S(3.048)}; height:${S(1.524)}; color:#f0f0f0`
        );
        screen.setAttribute('position', `0 ${S(2.133599931724802)} ${-ROOM_D / 2 + S(0.115)}`);
        room.appendChild(screen);

        // Double doors left & right
        const doorOffsetX = S(2.4383999219712025); // 8 ft
        const mkBackDoor = (sign) => {
            const d = document.createElement('a-entity');
            d.setAttribute(
                'double-door',
                `width:${DOOR_W}; height:${WALL_H}; autoOpen:true; frameColor:#444; leafColor:#9aa0a6`
            );
            d.setAttribute(
                'position',
                `${sign * doorOffsetX} ${S(1.066799965862401)} ${-ROOM_D / 2 + S(0.15)}`
            );
            return d;
        };
        room.appendChild(mkBackDoor(-1));
        room.appendChild(mkBackDoor(1));

        // ===== Windows on left wall =====
        for (let i = 0; i < 3; i++) {
            const win = document.createElement('a-entity');
            win.setAttribute(
                'window-pane',
                `width:${S(1.2191999609856012)}; height:${S(1.2191999609856012)}; opacity:0.4`
            );
            win.setAttribute(
                'position',
                `${-ROOM_W / 2 + S(0.02)} ${S(1.7)} ${(-S(1.828799941478402) + i * S(1.828799941478402))}`
            );
            win.setAttribute('rotation', '0 90 0');
            room.appendChild(win);
        }

        // ===== Ceiling projectors =====
        for (let i = 0; i < 2; i++) {
            const proj = document.createElement('a-entity');
            proj.setAttribute('ceiling-projector', '');
            const px = S(-0.914399970739201 + i * 1.828799941478402); // scale after sum
            proj.setAttribute(
                'position',
                `${px} ${WALL_H - S(0.1066799965862401)} ${S(-1.524)}`
            );
            room.appendChild(proj);
        }

        // ===== Light grid =====
        for (let xft = -3; xft <= 3; xft += 3) {
            for (let zft = -6; zft <= 6; zft += 6) {
                const light = document.createElement('a-entity');
                light.setAttribute('ceiling-light-square', `size:${S(0.6096)}; intensity:1.0`);
                const lx = S((xft * 2) / 3.28084); // convert ft->m then scale
                const lz = S(zft / 3.28084);       // convert ft->m then scale
                light.setAttribute('position', `${lx} ${WALL_H - S(0.12)} ${lz}`);
                room.appendChild(light);
            }
        }

        // ===== Air vents =====
        for (let i = 0; i < 2; i++) {
            const vent = document.createElement('a-entity');
            vent.setAttribute('air-vent', `width:${S(0.6096)}; height:${S(0.3048)}`);
            const vx = S((-8 + i * 16) / 3.28084);     // ft->m then scale
            const vy = WALL_H - S(0.02);
            const vz = S((ROOM_D / 2 - 2) / 3.28084);  // keep your original math, then scale
            vent.setAttribute('rotation', '-90 0 0');
            vent.setAttribute('position', `${vx} ${vy} ${vz}`);
            room.appendChild(vent);
        }

        // ===== Tables & chairs =====
        const rows = 3, cols = 4;
        const tableWft = 4.0;    // ft (kept for reference)
        const tableDft = 1.8;    // ft
        const spacingXft = 6.8;  // ft
        const spacingZft = 5.6;  // ft
        const startX = -((cols - 1) * spacingXft) / 2;
        const startZ = -2.2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tx = S((startX + c * spacingXft) / 3.28084);
                const tz = S((startZ + r * spacingZft) / 3.28084);

                const table = document.createElement('a-entity');
                table.setAttribute(
                    'classroom-table',
                    `width:${S(1.2191999609856012)}; depth:${S(0.5486399853664003)}; height:${S(0.7620000091440001)}`
                );
                table.setAttribute('position', `${tx} 0 ${tz}`);
                room.appendChild(table);

                const chair = document.createElement('a-entity');
                chair.setAttribute('classroom-chair', '');
                chair.setAttribute('scale', `${x} ${x} ${x}`);
                chair.setAttribute('position', `${tx} 0 ${tz + S(0.3809999878080004)}`);
                chair.setAttribute('rotation', '0 180 0');
                room.appendChild(chair);
            }
        }
    }

    function onSceneReady() {
        const scene = document.querySelector('a-scene');
        const root = ensureRoot(scene);
        if (!root) return;
        buildClassroom(root);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error("No <a-scene> found in DOM. Classroom cannot build.");
            return;
        }

        if (scene.hasLoaded) {
            onSceneReady();
        } else {
            scene.addEventListener('loaded', onSceneReady);
        }
    });

})();
