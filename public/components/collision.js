AFRAME.registerComponent('collision', {
  schema: {
    // What to track / collide against
    target: { type: 'selector' },         // e.g. target: #player

    // Your local collision box (relative to THIS entity)
    origin: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    width:  { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth:  { type: 'number', default: 1 },

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

    // Later: check if target point is inside the box
    const hit = this._box.containsPoint(this._v3);
    if (hit) {
        console.log('HIT');

        this.targetEl.setAttribute('position', this.past_position); 
    } 

    this.past_position.copy(this.targetEl.getAttribute('position'));
    
  }

});