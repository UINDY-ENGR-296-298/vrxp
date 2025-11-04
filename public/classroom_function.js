/*<!--------------------------Classroom function-------------------------->
    <!-- Everything is this function is chatgpt slightly tweaked by Josiah-->
    <script>*/

// THESE COMPONENTS ARE AVAILABLE
/*
    <script src="components/blankwall.js"></script>
    <script src="components/chair.js"></script>
    <script src="components/table.js"></script>
    <script src="components/projector.js"></script>
    <script src="components/whiteboard.js"></script>
    <script src="components/projection-screen.js"></script>
    <script src="components/double-door.js"></script>
    <script src="components/window-pane.js"></script>
    <script src="components/ceiling-light-square.js"></script>
    <script src="components/air-vent.js"></script>
    <script src="components/classroom-floor.js"></script>
*/

(function () {
    // ====== CONFIG (now meters directly) ======
    const classroomOrigin = new AFRAME.THREE.Vector3(-12.9, 0, -8);

    const ROOM_W = 9.75359968788481;    // 32 ft
    const ROOM_D = 7.924799746406408;   // 26 ft
    const WALL_H = 4.5719998536960045;  // 15 ft
    const WALL_T = 0.15239999512320015; // 0.5 ft
    const DOOR_W = 1.828799941478402;   // 6 ft
    const SIDE_OPENING_W = 1.828799941478402; // 6 ft

    function ensureRoot(scene) {
        let root = scene.querySelector('#classroom-root');
        if (!root) {
            root = document.createElement('a-entity');
            root.id = 'classroom-root';
            scene.appendChild(root);
        }
        if (root.dataset.built === 'true') return null;
        root.dataset.built = 'true';
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
        wBack.setAttribute('position', `0 0 ${-ROOM_D/2}`);
        room.appendChild(wBack);

        // Front wall
        const wFront = document.createElement('a-entity');
        wFront.setAttribute(
            'blank-wall',
            `width:${ROOM_W}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        wFront.setAttribute('position', `0 0 ${ROOM_D/2}`);
        wFront.setAttribute('rotation', '0 180 0');
        room.appendChild(wFront);

        // Left wall
        const wLeft = document.createElement('a-entity');
        wLeft.setAttribute(
            'blank-wall',
            `width:${ROOM_D}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        wLeft.setAttribute('rotation', '0 90 0');
        wLeft.setAttribute('position', `${-ROOM_W/2} 0 0`);
        room.appendChild(wLeft);

        // Right wall split around opening
        const segDepth = (ROOM_D - SIDE_OPENING_W) / 2;
        const rightA = document.createElement('a-entity');
        rightA.setAttribute(
            'blank-wall',
            `width:${segDepth}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        rightA.setAttribute('rotation', '0 -90 0');
        rightA.setAttribute(
            'position',
            `${ROOM_W/2} 0 ${(SIDE_OPENING_W/2 + segDepth/2)}`
        );
        room.appendChild(rightA);

        const rightB = document.createElement('a-entity');
        rightB.setAttribute(
            'blank-wall',
            `width:${segDepth}; height:${WALL_H}; thickness:${WALL_T}; color:#ffffff; anchor:ground`
        );
        rightB.setAttribute('rotation', '0 -90 0');
        rightB.setAttribute(
            'position',
            `${ROOM_W/2} 0 ${-(SIDE_OPENING_W/2 + segDepth/2)}`
        );
        room.appendChild(rightB);

        // ===== Ceiling =====
        const ceiling = document.createElement('a-box');
        ceiling.setAttribute('width', ROOM_W);
        ceiling.setAttribute('depth', ROOM_D);
        ceiling.setAttribute('height', 0.06); // already meters-ish thickness
        ceiling.setAttribute('material', 'color:#f3f4f6; roughness:1');
        ceiling.setAttribute('position', `0 ${WALL_H} 0`);
        room.appendChild(ceiling);

        // ===== Back wall fixtures: whiteboard, screen, double doors =====
        const board = document.createElement('a-entity');
        board.setAttribute(
            'whiteboard',
            'width:3.6575998829568037; height:1.3715999561088015; frameColor:#222; surfaceColor:#f7fafc'
            // width 12 ft, height 4.5 ft
        );
        board.setAttribute(
            'position',
            `0 ${1.524} ${-ROOM_D/2 + 0.12}`
            // 5 ft -> 1.524 m up; pull 0.12m off wall
        );
        room.appendChild(board);

        const screen = document.createElement('a-entity');
        screen.setAttribute(
            'projection-screen',
            'width:3.048; height:1.524; color:#f0f0f0'
            // width 10 ft, height 5 ft
        );
        screen.setAttribute(
            'position',
            `0 ${2.133599931724802} ${-ROOM_D/2 + 0.115}`
            // 7 ft -> 2.1336 m up
        );
        room.appendChild(screen);

        // Double doors left & right
        const doorOffsetX = 2.4383999219712025; // 8 ft
        const mkBackDoor = (sign) => {
            const d = document.createElement('a-entity');
            d.setAttribute(
            'double-door',
            `width:${DOOR_W}; height:${WALL_H}; autoOpen:true; frameColor:#444; leafColor:#9aa0a6`
            );
            d.setAttribute(
            'position',
            `${sign * doorOffsetX} ${1.066799965862401} ${-ROOM_D/2 + 0.15}`
            // y = 3.5 ft -> 1.0668 m
            );
            return d;
        };
        room.appendChild(mkBackDoor(-1));
        room.appendChild(mkBackDoor( 1));

        // ===== Windows on left wall =====
        for (let i = 0; i < 3; i++) {
            const win = document.createElement('a-entity');
            win.setAttribute('window-pane', 'width:1.2191999609856012; height:1.2191999609856012; opacity:0.4');
            win.setAttribute(
            'position',
            `${-ROOM_W/2 + 0.02} 1.7 ${(-1.828799941478402 + i*1.828799941478402)}`
            // (-6 + i*6) ft  → each 1.8288 m step
            );
            win.setAttribute('rotation', '0 90 0');
            room.appendChild(win);
        }

        // ===== Ceiling projectors =====
        for (let i = 0; i < 2; i++) {
            const proj = document.createElement('a-entity');
            proj.setAttribute('ceiling-projector', '');
            const px = (-0.914399970739201 + i*1.828799941478402); // (-3 + i*6) ft
            proj.setAttribute(
            'position',
            `${px} ${WALL_H - 0.1066799965862401} ${-1.524}`
            // y offset 0.35 ft -> 0.10668 m; z -5 ft -> -1.524 m
            );
            room.appendChild(proj);
        }

        // ===== Light grid =====
        for (let x = -3; x <= 3; x += 3) {
            for (let z = -6; z <= 6; z += 6) {
            const light = document.createElement('a-entity');
            light.setAttribute('ceiling-light-square', 'size:0.6096; intensity:1.0');
            const lx = (x*2)/3.28084; // original x*FT*2
            const lz = (z)/3.28084;  // original z*FT
            light.setAttribute('position', `${lx} ${WALL_H - 0.12} ${lz}`);
            room.appendChild(light);
            }
        }

        // ===== Air vents =====
        for (let i = 0; i < 2; i++) {
            const vent = document.createElement('a-entity');
            vent.setAttribute('air-vent', 'width:0.6096; height:0.3048');
            const vx = (-8 + i*16)/3.28084;           // (-8 + i*16) ft
            const vy = WALL_H - 0.02;                 // keep ~same offset down from ceiling (0.02 m already fine)
            const vz = (ROOM_D/2 - 2)/3.28084;        // (ROOM_D/2 - 2 ft)
            vent.setAttribute('rotation', '-90 0 0');
            vent.setAttribute('position', `${vx} ${vy} ${vz}`);
            room.appendChild(vent);
        }

        // ===== Tables & chairs =====
        const rows = 3, cols = 4;
        const tableWft = 4.0;    // ft
        const tableDft = 1.8;    // ft
        const spacingXft = 6.8;  // ft
        const spacingZft = 5.6;  // ft
        const startX = -((cols-1) * spacingXft)/2;
        const startZ = -2.2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
            const tx = (startX + c*spacingXft)/3.28084;
            const tz = (startZ + r*spacingZft)/3.28084;

            const table = document.createElement('a-entity');
            table.setAttribute(
                'classroom-table',
                `width:${1.2191999609856012}; depth:${0.5486399853664003}; height:0.7620000091440001`
                // 4.0ft, 1.8ft, 2.5ft
            );
            table.setAttribute('position', `${tx} 0 ${tz}`);
            room.appendChild(table);

            const chair = document.createElement('a-entity');
            chair.setAttribute('classroom-chair', '');

            chair.setAttribute('position', `${tx} 0 ${tz + 0.3809999878080004}`); // 1.25 ft forward
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

    // NEW WRAP
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
//    </script>

//    <!---------------------------End Classroom function--------------------------->