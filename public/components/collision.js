AFRAME.registerComponent('collision', {
  schema: {
    // What to track / collide against
    target: { type: 'selector' },         // e.g. target: #player

    // Your local collision box (relative to THIS entity)
    origin: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    width:  { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth:  { type: 'number', default: 1 },
    Yrot: {type: 'number', default: 0}, // rotation of the box around the Y axis in degrees (optional, not implemented in this example)

    // Optional logging toggle
    log: { type: 'boolean', default: true }
  },

  init: function () {
    this.targetEl = this.data.target;

    // Re-try target resolution after scene loads (helps when target spawns later)
    if (!this.targetEl) {
      this.el.sceneEl.addEventListener('loaded', () => {
        this.targetEl = this.data.target;
      });
    }

    // Scratch objects to avoid garbage every tick
    this._v3 = new THREE.Vector3();
    this._box = new THREE.Box3();
    this._center = new THREE.Vector3();
    this._size = new THREE.Vector3();

    this.past_position = new THREE.Vector3(); // store past position for simple collision response example
    this.past_position.set(0, 0, 0);

    this._rel = new THREE.Vector3();   // target relative to box center
    this._pLocal = new THREE.Vector3(); // rotated point in box-local space
  },

  tick: function () {
    
    const targetEl = this.targetEl || this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    // WORLD position is usually what you want for debugging movement
    targetEl.object3D.getWorldPosition(this._v3);

    if (this.data.log) {
      console.log(this._v3.x.toFixed(3), this._v3.y.toFixed(3), this._v3.z.toFixed(3));
    }

    // Build THIS entity's AABB in world space (basic, axis-aligned)
    // center = worldPos(this.el) + origin (in local space rotated? ignored here)
    this.el.object3D.getWorldPosition(this._center);
    this._center.add(new THREE.Vector3(this.data.origin.x, this.data.origin.y, this.data.origin.z));

    this._size.set(this.data.width, this.data.height, this.data.depth);
    this._box.setFromCenterAndSize(this._center, this._size);

    // --- Y-rotation support (bare minimum) ---
    // Treat the box as rotated around Y by Yrot by rotating the target point the opposite way.
    const rad = THREE.MathUtils.degToRad(this.data.Yrot);

    // target relative to box center
    this._rel.copy(this._v3).sub(this._center);

    // rotate target point into "box local space"
    this._pLocal.copy(this._rel);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // rotate by -rad (inverse) so we can still do axis-aligned bounds check
    const x = this._pLocal.x;
    const z = this._pLocal.z;
    this._pLocal.x =  x * cos + z * sin;
    this._pLocal.z = -x * sin + z * cos;

    // axis-aligned check in box-local space
    const hit =
      Math.abs(this._pLocal.x) <= this.data.width  / 2 &&
      Math.abs(this._pLocal.y) <= this.data.height / 2 &&
      Math.abs(this._pLocal.z) <= this.data.depth / 2;
    if (hit) {
        console.log('HIT');

        this.targetEl.setAttribute('position', this.past_position); 
    } 

    this.past_position.copy(this.targetEl.getAttribute('position'));
    
  }

});