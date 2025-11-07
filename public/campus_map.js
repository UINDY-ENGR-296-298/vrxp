(function () {
    // ====== CONFIG ======
    const campusOrigin = new AFRAME.THREE.Vector3(0, 0, 0);

    function ensureRoot(scene) {
        let root = scene.querySelector('#campus-root'); 
        if (!root) {
            root = document.createElement('a-entity');
            root.id = 'campus-root';
            scene.appendChild(root);
        }

        // If already built once, don't rebuild
        if (root.dataset.built === 'true') return null;

        root.dataset.built = 'true';
        root.setAttribute(
            'position',
            `${campusOrigin.x} ${campusOrigin.y} ${campusOrigin.z}`
        );
        return root;
    }

    function building(width, height, depth, PosX, PosY, PosZ, RotX, RotY, RotZ) {
        const newCube = document.createElement('a-box');
        newCube.setAttribute(
            'geometry',
            `primitive: box; width: ${width}; height: ${height}; depth: ${depth}`
        );
        newCube.setAttribute('position', `${PosX} ${PosY} ${PosZ}`);
        newCube.setAttribute('rotation', `${RotX} ${RotY} ${RotZ}`)
        newCube.setAttribute('material', 'color: #eaeaea');
        return newCube
    }

    function walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth) {

        // Direction vector in XZ-plane
        const dx = PathEndX - PathStartX;
        const dz = PathEndZ - PathStartZ;

        // Length of the path (distance between start and end)
        const length = Math.sqrt(dx * dx + dz * dz);

        // Midpoint for positioning the path
        const midX = (PathStartX + PathEndX) / 2;
        const midZ = (PathStartZ + PathEndZ) / 2;

        // Yaw angle so the plane points along the path direction
        // A-Frame (Three.js) rotations are in degrees
        const yawDeg = Math.atan2(dz, dx) * 180 / Math.PI;

        const path = document.createElement('a-plane');
        path.setAttribute(
            'geometry', 
            `primitive: plane; height: ${PathWidth}; width: ${length}`
        );
        path.setAttribute('position', `${midX} 0.2 ${midZ}`);
        path.setAttribute('rotation', `-90 ${yawDeg} 0`);
        path.setAttribute('material', 'color: #93a2a7');
        path.setAttribute('shadow', 'receive: true');

        return path;
    }


    function road() {

    }

    function parkingLot(X, Z, length, width) {
        const lot = document.createElement('a-plane');
        lot.setAttribute(
            'geometry', 
            `primitive: plane; height: ${length}; width: ${width}`
        );
        lot.setAttribute('position', `${X} 0.1 ${Z}`);
        lot.setAttribute('rotation', '-90 0 0');
        lot.setAttribute('material', 'color: #3a3f41');
        lot.setAttribute('shadow', 'receive: true');

        return lot;
    }

    function buildCampus(root) {
        // Parent entity for the campus
        const campus = document.createElement('a-entity');
        campus.id = 'campus';
        root.appendChild(campus);

        // ===== Simple block example =====
        const block = document.createElement('a-box');
        block.setAttribute(
            'geometry',
            'primitive: box; width: 1; height: 1; depth: 1'
        );
        block.setAttribute('position', '0 0 -10');
        block.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(block);

        // =========================== Center Circle ===========================
        // === Far Half ===
        const centerGreenFarHalf = document.createElement('a-circle');
        centerGreenFarHalf.setAttribute(
            'geometry',
            'primitive: circle; radius:50; thetaStart:0; thetaLength:180'
        );
        centerGreenFarHalf.setAttribute('position', '0 -1 -40');
        centerGreenFarHalf.setAttribute('rotation', '-90 0 0');
        centerGreenFarHalf.setAttribute('material', 'color: #11750a');
        campus.appendChild(centerGreenFarHalf);

        // === Near Half ===
        const centerGreenNearHalf = document.createElement('a-circle');
        centerGreenNearHalf.setAttribute(
            'geometry',
            'primitive: circle; radius:50; thetaStart:0; thetaLength:180'
        );
        centerGreenNearHalf.setAttribute('position', '0 -1 -35');
        centerGreenNearHalf.setAttribute('rotation', '-90 180 0');
        centerGreenNearHalf.setAttribute('material', 'color: #11750a');
        campus.appendChild(centerGreenNearHalf);

        // === Pool far wall ===
        const poolFarWall = document.createElement('a-plane');
        poolFarWall.setAttribute(
            'geometry', 
            'primitive:plane; height:2; width:100'
        )
        poolFarWall.setAttribute('position', '0 -2 -40');
        poolFarWall.setAttribute('rotation', '0 0 0');
        poolFarWall.setAttribute('material', 'color: #11c0f0');
        campus.appendChild(poolFarWall);

        // === Pool near wall ===
        const poolNearWall = document.createElement('a-plane');
        poolNearWall.setAttribute(
            'geometry', 
            'primitive:plane; height:2; width:100'
        )
        poolNearWall.setAttribute('position', '0 -2 -35');
        poolNearWall.setAttribute('rotation', '180 0 0');
        poolNearWall.setAttribute('material', 'color: #11c0f0');
        campus.appendChild(poolNearWall);

        // === Pool Floor ===
        const poolFloor = document.createElement('a-plane');
        poolFloor.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:100'
        )
        poolFloor.setAttribute('position', '0 -1.8 -37.5');
        poolFloor.setAttribute('rotation', '-90 0 0');
        poolFloor.setAttribute('material', 'color: #11c0f0');
        campus.appendChild(poolFloor);

        // === Pool left wall ===
        const poolLeftWall = document.createElement('a-plane');
        poolLeftWall.setAttribute(
            'geometry', 
            'primitive:plane; height:2; width:5'
        )
        poolLeftWall.setAttribute('position', '-50 -2 -37.5');
        poolLeftWall.setAttribute('rotation', '0 90 0');
        poolLeftWall.setAttribute('material', 'color: #11c0f0');
        campus.appendChild(poolLeftWall);

        // === Pool right wall ===
        const poolRightWall = document.createElement('a-plane');
        poolRightWall.setAttribute(
            'geometry', 
            'primitive:plane; height:2; width:5'
        )
        poolRightWall.setAttribute('position', '50 -2 -37.5');
        poolRightWall.setAttribute('rotation', '0 -90 0');
        poolRightWall.setAttribute('material', 'color: #11c0f0');
        campus.appendChild(poolRightWall);

        // === Ground - Far half ===
        const farHalfRing = document.createElement('a-ring');
        farHalfRing.setAttribute(
        'geometry',
        'primitive: ring; radiusInner: 50.9; radiusOuter: 500; thetaStart: 0; thetaLength: 180'
        );
        farHalfRing.setAttribute('position', '0 0 -37.5');
        farHalfRing.setAttribute('rotation', '-90 0 0');
        farHalfRing.setAttribute('material', 'color: #6a767a; side: double');
        campus.appendChild(farHalfRing);

        // === Ground - Near half ===
        const nearHalfRing = document.createElement('a-ring');
        nearHalfRing.setAttribute(
        'geometry',
        'primitive: ring; radiusInner: 50.9; radiusOuter: 500; thetaStart: 0; thetaLength: 180'
        );
        nearHalfRing.setAttribute('position', '0 0 -37.5');
        nearHalfRing.setAttribute('rotation', '-90 0 180');
        nearHalfRing.setAttribute('material', 'color: #6a767a; side: double');
        campus.appendChild(nearHalfRing);

        // === Transition from ground to center circle ===
        const invertedCone = document.createElement('a-entity');
        invertedCone.setAttribute(
        'geometry',
        'primitive: cone; radiusBottom: 51; radiusTop: 50.1; height: 2; openEnded: true'
        );
        invertedCone.setAttribute('material', 'color: #11750a; side: double');
        invertedCone.setAttribute('rotation', '180 0 0');
        invertedCone.setAttribute('position', '0 -1 -37.5');
        campus.appendChild(invertedCone);

        // === Walkway around center green ===
        const centerWalkWay = document.createElement('a-ring');
        centerWalkWay.setAttribute(
        'geometry',
        'primitive: ring; radiusInner: 50.9; radiusOuter: 61;'
        );
        centerWalkWay.setAttribute('position', '0 0.1 -37.5');
        centerWalkWay.setAttribute('rotation', '-90 0 180');
        centerWalkWay.setAttribute('material', 'color: #93a2a7; side: double');
        campus.appendChild(centerWalkWay);

        // =========================== Library Segment ===========================

        // === Walkway to library ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(0, 18, 0, 58, 5));

        // === Library ===
        campus.appendChild(building(100, 40, 80, 0, 0, 98, 0, 0, 0));
        
        // === Walkway in front of library ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-60, 50, 50, 50, 5));

        // === Walkway left of library ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-57.7, 50, -57.5, 230, 5));

        // =========================== Martin Hall + Lilly ===========================

        // === Path to between ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-55, -37.5, -95, -37.5, 5));

        // === Lilly Front ===
        campus.appendChild(building(30, 60, 60, -105, 0, -62.5, 0, 0, 0));

        // === Lilly Back ===
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(50, 60, 15, -125, 0, -85, 0, 0, 0));

        // === Path in front of Lilly also leading to Martin ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-80, 20, -80, -110, 5));

        // === Martin Front ===
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(20, 80, 10, -80, 0, 20, 0, 90, 0));
        
        // === Martin Mid ===
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(40, 80, 60, -115, 0, 15, 0, 90, 0));

        // === Martin Back === 
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(80, 80, 10, -150, 0, -5, 0, 90, 0));

        // === Sky Bridge between Martin/Lilly
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(50, 10, 20, -105, 15, -30, 0, 90, 0));
        
        // === Path between Martin and Lilly - Stage 1 ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-80, -17.5, -135, -17.5, 10));

        // === Path between Martin and Lilly - Stage 2 ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-135, 0, -135, -65, 10));

        // === Path between Martin and Lilly - Stage 3 ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-130, -65, -172.5, -65, 10));

        // === Walkway behind Martin/Lilly ===
        // walkway(PathStartX, PathStartZ, PathEndX, PathEndZ, PathWidth)
        campus.appendChild(walkway(-170, 230, -170, -110, 5));

        // =========================== Parking Lots ===========================

        // === Parking Lot beside cafe ===
        // parkingLot(X, Z, length, width)
        campus.appendChild(parkingLot(-107.5, -160, 100, 130));

        // === Parking Lot in front of Entry to Martin and beside library ===
        campus.appendChild(parkingLot(-115, 110, 100, 100))

        // === Parking Lot to the back left of library ===
        campus.appendChild(parkingLot(-115, 200, 50, 100))

        // =========================== Miscillaneous Walkways ===========================

        // === Path in front of Entry to Martin ===
        campus.appendChild(walkway( -115, 35, -115, 60, 10))

        // === Path around that parking lot ===
        campus.appendChild(walkway(-172.5, 230, -55, 230, 5))

        // =========================== Switzer ===========================

        // === Schwitzer === 
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(120, 40, 60, 17.5, 0, -150, 0, 0, 0));

        // === Schwitzer Deck === 
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(90, 10, 60, 0, 0, -140, 0, 0, 0));

        // === Schwitzer Entry === 
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(70, 5, 60, 35, 0, -140, 0, 0, 0));

        // === Schwitzer Stairs === 
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(30, 4, 60, 57, 0, -138, 0, 0, 0));
        campus.appendChild(building(32, 3, 60, 58, 0, -137, 0, 0, 0));
        campus.appendChild(building(34, 2, 60, 59, 0, -136, 0, 0, 0));
        campus.appendChild(building(36, 1, 60, 60, 0, -135, 0, 0, 0));

        // === Path in front of Schwitzer Entry ===
        campus.appendChild(walkway(42, -102.5, 78, -102.5, 5));

        // === Path from center-circle path to Schwitzer ===
        campus.appendChild(walkway(57, -30, 57, -105, 5));

        // =========================== Esch ===========================

        // === Esch ===
        // Width, Height, Depth, X, Y, Z, RotationAxis: X, Y, Z
        campus.appendChild(building(130, 60, 40, 130, 0, -20, 0, 90, 0));

        // === Esch Wall left ===
        campus.appendChild(building(30, 30, 40, 120, 0, -70, 0, 90, 0));

        // === Esch Wall Right ===
        campus.appendChild(building(30, 30, 40, 120, 0, 30, 0, 90, 0));

        // === Esch entry ===
        campus.appendChild(building(70, 7, 40, 115, 0, -20, 0, 90, 0));

        // === Esch stairs ===
        campus.appendChild(building(72, 6, 40, 114, 0, -20, 0, 90, 0));
        campus.appendChild(building(74, 5, 40, 113, 0, -20, 0, 90, 0));
        campus.appendChild(building(76, 4, 40, 112, 0, -20, 0, 90, 0));
        campus.appendChild(building(78, 3, 40, 111, 0, -20, 0, 90, 0));
        campus.appendChild(building(80, 2, 40, 110, 0, -20, 0, 90, 0));
        campus.appendChild(building(82, 1, 40, 109, 0, -20, 0, 90, 0));
        
    }

    function onSceneReady() {
        const scene = document.querySelector('a-scene');
        const root = ensureRoot(scene);
        if (!root) return; // already built
        buildCampus(root);
    }

    // Wait for DOM and scene
    document.addEventListener('DOMContentLoaded', () => {
        const scene = document.querySelector('a-scene');
        if (!scene) {
            console.error('No <a-scene> found in DOM. Campus cannot build.');
            return;
        }

        if (scene.hasLoaded) {
            onSceneReady();
        } else {
            scene.addEventListener('loaded', onSceneReady);
        }
    });
})();


