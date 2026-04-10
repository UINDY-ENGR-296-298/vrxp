AFRAME.registerComponent('collision', {
  schema: {
    // What to track / collide against
    target: { type: 'selector' },

    // Your local collision box (relative to THIS entity)
    origin: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    width:  { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth:  { type: 'number', default: 1 },
    Yrot:   { type: 'number', default: 0 },

    // Optional logging toggle
    log: { type: 'boolean', default: true }
  },

  init: function () {
    this.targetEl = this.data.target;

    if (!this.targetEl) {
      this.el.sceneEl.addEventListener('loaded', () => {
        this.targetEl = this.data.target;
        this.captureSafePosition(true);
      });
    }

    // scratch objects
    this._targetWorld = new THREE.Vector3();
    this._prevTargetWorld = new THREE.Vector3();
    this._center = new THREE.Vector3();
    this._originWorld = new THREE.Vector3();
    this._prevLocal = new THREE.Vector3();
    this._currLocal = new THREE.Vector3();

    // last known good LOCAL target position
    this.past_position = new THREE.Vector3();
    this._hasSafePosition = false;
    this._hasPrevWorld = false;

    // small padding so the rig does not have to be mathematically inside by a perfect point
    this.PLAYER_RADIUS_XZ = 0.18;
    this.PLAYER_RADIUS_Y = 0.08;

    this.captureSafePosition(true);
  },

  update: function () {
    this.targetEl = this.data.target || this.targetEl;
    this.captureSafePosition(true);
  },

  tick: function () {
    const targetEl = this.targetEl || this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    targetEl.object3D.getWorldPosition(this._targetWorld);

    if (!this._hasPrevWorld) {
      this._prevTargetWorld.copy(this._targetWorld);
      this._hasPrevWorld = true;
    }

    if (this.data.log) {
      console.log(
        this._targetWorld.x.toFixed(3),
        this._targetWorld.y.toFixed(3),
        this._targetWorld.z.toFixed(3)
      );
    }

    // transform origin from this entity's local space into world space
    this._originWorld.set(this.data.origin.x, this.data.origin.y, this.data.origin.z);
    this._center.copy(this._originWorld).applyMatrix4(this.el.object3D.matrixWorld);

    // keep the SAME Yrot behavior as before:
    // rotate the target point by -Yrot into box-local space
    const rad = THREE.MathUtils.degToRad(this.data.Yrot);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    this.worldToBoxLocal(this._prevTargetWorld, this._center, cos, sin, this._prevLocal);
    this.worldToBoxLocal(this._targetWorld, this._center, cos, sin, this._currLocal);

    const halfW = this.data.width / 2 + this.PLAYER_RADIUS_XZ;
    const halfH = this.data.height / 2 + this.PLAYER_RADIUS_Y;
    const halfD = this.data.depth / 2 + this.PLAYER_RADIUS_XZ;

    // hit if current point is inside OR if movement crossed through the box this frame
    const hit =
      this.pointInsideAABB(this._currLocal, halfW, halfH, halfD) ||
      this.segmentIntersectsAABB(this._prevLocal, this._currLocal, halfW, halfH, halfD);

    if (hit) {
      if (this.data.log) console.log('HIT');
      this.restoreSafePosition();
      targetEl.object3D.getWorldPosition(this._prevTargetWorld);
      return;
    }

    // only update safe position when not colliding
    this.past_position.copy(targetEl.object3D.position);
    this._hasSafePosition = true;
    this._prevTargetWorld.copy(this._targetWorld);
  },

  worldToBoxLocal: function (worldPoint, center, cos, sin, out) {
    out.copy(worldPoint).sub(center);

    const x = out.x;
    const z = out.z;

    out.x =  x * cos + z * sin;
    out.z = -x * sin + z * cos;

    return out;
  },

  pointInsideAABB: function (p, halfW, halfH, halfD) {
    return (
      Math.abs(p.x) <= halfW &&
      Math.abs(p.y) <= halfH &&
      Math.abs(p.z) <= halfD
    );
  },

  segmentIntersectsAABB: function (p0, p1, halfW, halfH, halfD) {
    const dirX = p1.x - p0.x;
    const dirY = p1.y - p0.y;
    const dirZ = p1.z - p0.z;

    let tMin = 0;
    let tMax = 1;

    const axes = [
      { p0: p0.x, dir: dirX, min: -halfW, max: halfW },
      { p0: p0.y, dir: dirY, min: -halfH, max: halfH },
      { p0: p0.z, dir: dirZ, min: -halfD, max: halfD }
    ];

    for (let i = 0; i < axes.length; i++) {
      const a = axes[i];

      if (Math.abs(a.dir) < 1e-8) {
        if (a.p0 < a.min || a.p0 > a.max) return false;
        continue;
      }

      let t1 = (a.min - a.p0) / a.dir;
      let t2 = (a.max - a.p0) / a.dir;

      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }

      if (t1 > tMin) tMin = t1;
      if (t2 < tMax) tMax = t2;
      if (tMin > tMax) return false;
    }

    return tMax >= 0 && tMin <= 1;
  },

  captureSafePosition: function (force) {
    const targetEl = this.targetEl || this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    if (!this._hasSafePosition || force) {
      this.past_position.copy(targetEl.object3D.position);
      targetEl.object3D.getWorldPosition(this._prevTargetWorld);
      this._hasSafePosition = true;
      this._hasPrevWorld = true;
    }
  },

  restoreSafePosition: function () {
    const targetEl = this.targetEl || this.data.target;
    if (!targetEl || !targetEl.object3D || !this._hasSafePosition) return;

    targetEl.object3D.position.copy(this.past_position);
    targetEl.setAttribute('position', {
      x: this.past_position.x,
      y: this.past_position.y,
      z: this.past_position.z
    });

    // if physics is attached, stop leftover momentum from shoving through
    if (targetEl.body) {
      if (targetEl.body.velocity && typeof targetEl.body.velocity.set === 'function') {
        targetEl.body.velocity.set(0, 0, 0);
      }
      if (targetEl.body.angularVelocity && typeof targetEl.body.angularVelocity.set === 'function') {
        targetEl.body.angularVelocity.set(0, 0, 0);
      }
    }
  }
});