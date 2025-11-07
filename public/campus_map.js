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
        centerGreenFarHalf.setAttribute('material', 'color: #148a0b');
        campus.appendChild(centerGreenFarHalf);

        // === Near Half ===
        const centerGreenNearHalf = document.createElement('a-circle');
        centerGreenNearHalf.setAttribute(
            'geometry',
            'primitive: circle; radius:50; thetaStart:0; thetaLength:180'
        );
        centerGreenNearHalf.setAttribute('position', '0 -1 -35');
        centerGreenNearHalf.setAttribute('rotation', '-90 180 0');
        centerGreenNearHalf.setAttribute('material', 'color: #148a0b');
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
        invertedCone.setAttribute('material', 'color: #78858a; side: double');
        invertedCone.setAttribute('rotation', '180 0 0');
        invertedCone.setAttribute('position', '0 -1 -37.5');
        campus.appendChild(invertedCone);

        // === Walkway around center green ===
        const centerWalkWay = document.createElement('a-ring');
        centerWalkWay.setAttribute(
        'geometry',
        'primitive: ring; radiusInner: 50.9; radiusOuter: 55.9;'
        );
        centerWalkWay.setAttribute('position', '0 0.1 -37.5');
        centerWalkWay.setAttribute('rotation', '-90 0 180');
        centerWalkWay.setAttribute('material', 'color: #93a2a7; side: double');
        campus.appendChild(centerWalkWay);

        // =========================== Library Segment ===========================

        // === Walkway to library ===
        const walkwayGreenToLibrary = document.createElement('a-plane');
        walkwayGreenToLibrary.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:40'
        )
        walkwayGreenToLibrary.setAttribute('position', '0 0.1 38');
        walkwayGreenToLibrary.setAttribute('rotation', '-90 90 0');
        walkwayGreenToLibrary.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(walkwayGreenToLibrary);

        // === Library ===
        const library = document.createElement('a-box');
        library.setAttribute(
            'geometry',
            'primitive: box; width: 100; height: 40; depth: 80'
        );
        library.setAttribute('position', '0 0 98');
        library.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(library);
        
        // === Walkway in front of library ===
        const walkwayFrontLibrary = document.createElement('a-plane');
        walkwayFrontLibrary.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:120'
        )
        walkwayFrontLibrary.setAttribute('position', '0 0.1 50');
        walkwayFrontLibrary.setAttribute('rotation', '-90 0 0');
        walkwayFrontLibrary.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(walkwayFrontLibrary);

        // === Walkway left of library ===
        const walkwayLeftLibrary = document.createElement('a-plane');
        walkwayLeftLibrary.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:100'
        )
        walkwayLeftLibrary.setAttribute('position', '-57.5 0.1 100');
        walkwayLeftLibrary.setAttribute('rotation', '-90 90 0');
        walkwayLeftLibrary.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(walkwayLeftLibrary);

        // =========================== Martin Hall + Lilly ===========================

        // === Path to between ===
        const walkwayToBetweenMartinLilly = document.createElement('a-plane');
        walkwayToBetweenMartinLilly.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:40'
        )
        walkwayToBetweenMartinLilly.setAttribute('position', '-75 0.1 -37.5');
        walkwayToBetweenMartinLilly.setAttribute('rotation', '-90 0 0');
        walkwayToBetweenMartinLilly.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(walkwayToBetweenMartinLilly);

        // === Lilly Front ===
        const lillyFront = document.createElement('a-box');
        lillyFront.setAttribute(
            'geometry',
            'primitive: box; width: 30; height: 100; depth: 60'
        );
        lillyFront.setAttribute('position', '-105 0 -62.5');
        lillyFront.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(lillyFront);

        // === Lilly Back ===
        const lillyBack = document.createElement('a-box');
        lillyBack.setAttribute(
            'geometry',
            'primitive: box; width: 50; height: 100; depth: 15'
        );
        lillyBack.setAttribute('position', '-125 0 -85');
        lillyBack.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(lillyBack);

        // === Path in front of Lilly also leading to Martin ===
        const crossMartinLilly = document.createElement('a-plane');
        crossMartinLilly.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:100'
        )
        crossMartinLilly.setAttribute('position', '-80 0.1 -30');
        crossMartinLilly.setAttribute('rotation', '-90 90 0');
        crossMartinLilly.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(crossMartinLilly);

        // === Martin Front ===
        const martinFront = document.createElement('a-box');
        martinFront.setAttribute(
            'geometry',
            'primitive: box; width: 20; height: 120; depth: 10'
        );
        martinFront.setAttribute('position', '-80 0 20');
        martinFront.setAttribute('rotation', '0 90 0')
        martinFront.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(martinFront);

        
        // === Martin Mid ===
        const martinMid = document.createElement('a-box');
        martinMid.setAttribute(
            'geometry',
            'primitive: box; width: 40; height: 120; depth: 60'
        );
        martinMid.setAttribute('position', '-115 0 15');
        martinMid.setAttribute('rotation', '0 90 0')
        martinMid.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(martinMid);

        // === Martin Back === 
        const martinBack = document.createElement('a-box');
        martinBack.setAttribute(
            'geometry',
            'primitive: box; width: 80; height: 120; depth: 10'
        );
        martinBack.setAttribute('position', '-150 0 -5');
        martinBack.setAttribute('rotation', '0 90 0')
        martinBack.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(martinBack);

        // === Sky Bridge between Martin/Lilly
        const skyBridge = document.createElement('a-box');
        skyBridge.setAttribute(
            'geometry',
            'primitive: box; width: 50; height: 10; depth: 20'
        );
        skyBridge.setAttribute('position', '-105 20 -30');
        skyBridge.setAttribute('rotation', '0 90 0')
        skyBridge.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(skyBridge);
        
        // === Path between Martin and Lilly - Stage 1 ===
        const betweenMartinLillyStageOne = document.createElement('a-plane');
        betweenMartinLillyStageOne.setAttribute(
            'geometry', 
            'primitive:plane; height:10; width:55'
        )
        betweenMartinLillyStageOne.setAttribute('position', '-107.5 0.1 -17.5');
        betweenMartinLillyStageOne.setAttribute('rotation', '-90 0 0');
        betweenMartinLillyStageOne.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(betweenMartinLillyStageOne);
        // === Path between Martin and Lilly - Stage 2 ===
        const betweenMartinLillyStageTwo = document.createElement('a-plane');
        betweenMartinLillyStageTwo.setAttribute(
            'geometry', 
            'primitive:plane; height:10; width:65'
        )
        betweenMartinLillyStageTwo.setAttribute('position', '-135 0.1 -25');
        betweenMartinLillyStageTwo.setAttribute('rotation', '-90 90 0');
        betweenMartinLillyStageTwo.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(betweenMartinLillyStageTwo);
        // === Path between Martin and Lilly - Stage 3 ===
        const betweenMartinLillyStageThree = document.createElement('a-plane');
        betweenMartinLillyStageThree.setAttribute(
            'geometry', 
            'primitive:plane; height:10; width:40'
        )
        betweenMartinLillyStageThree.setAttribute('position', '-150 0.1 -60');
        betweenMartinLillyStageThree.setAttribute('rotation', '-90 0 0');
        betweenMartinLillyStageThree.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(betweenMartinLillyStageThree);

        // === Walkway behind Martin/Lilly ===
        const walkwayBehindMartinLilly = document.createElement('a-plane');
        walkwayBehindMartinLilly.setAttribute(
            'geometry', 
            'primitive:plane; height:5; width:300'
        )
        walkwayBehindMartinLilly.setAttribute('position', '-170 0.1 50');
        walkwayBehindMartinLilly.setAttribute('rotation', '-90 90 0');
        walkwayBehindMartinLilly.setAttribute('material', 'color: #93a2a7');
        campus.appendChild(walkwayBehindMartinLilly);

        
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


