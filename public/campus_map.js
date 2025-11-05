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
        block.setAttribute('position', '5 0.5 0');
        block.setAttribute('material', 'color: #eaeaea');
        campus.appendChild(block);

        // ===== Center Circle =====
        // ===== Center Circle =====
        // const centerCircle = document.createElement('a-circle');
        // centerCircle.setAttribute('geometry', 'primitive: circle; radius: 50');
        // centerCircle.setAttribute('position', '0 0.1 0');
        // centerCircle.setAttribute('rotation', '90 0 0');
        // centerCircle.setAttribute('anchor', 'ground');
        // centerCircle.setAttribute('material', 'color: #12d33f');
        // campus.appendChild(centerCircle);
        
        // ===== Ring around pool =====
        const poolRing = document.createElement('a-entity');
        poolRing.setAttribute('position', '0 0.1 0');
        poolRing.setAttribute('rotation', '-90 0 0');
        poolRing.setAttribute('radius-inner', '5');
        poolRing.setAttribute('radius-outer', '20');
        poolRing.setAttribute('color', '#7BC8A4');
        campus.appendChild(poolRing);

        // ===== Pool =====
        const pool = document.createElement('a-cylinder');
        pool.setAttribute('geometry', 'radius: 5; height: 3; openEnded: true');
        pool.setAttribute('material', 'color: #0099ff; side: double');
        pool.setAttribute('position', '0 -1.3 0');
        pool.setAttribute('rotation', '0 0 0');
        campus.appendChild(pool);
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
