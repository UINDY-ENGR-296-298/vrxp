AFRAME.registerComponent('wasd-move-only', {
  schema: { speed: {type: 'number', default: 3} }, // meters per second
  init() {
    this.state = {w:false, a:false, s:false, d:false};
    this._vecF = new THREE.Vector3();
    this._vecR = new THREE.Vector3();

    this.onKeyDown = e => {
      if (e.code === 'KeyW') this.state.w = true;
      if (e.code === 'KeyA') this.state.a = true;
      if (e.code === 'KeyS') this.state.s = true;
      if (e.code === 'KeyD') this.state.d = true;
    };
    this.onKeyUp = e => {
      if (e.code === 'KeyW') this.state.w = false;
      if (e.code === 'KeyA') this.state.a = false;
      if (e.code === 'KeyS') this.state.s = false;
      if (e.code === 'KeyD') this.state.d = false;
    };
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  tick(time, dt) {
    const dsec = dt / 1000;
    if (!(this.state.w || this.state.a || this.state.s || this.state.d)) return;

    const obj = this.el.object3D;
    // get yaw object if present, so movement follows where we look
    const lc = this.el.components['look-controls'];
    const yawObj = lc && lc.yawObject ? lc.yawObject : obj;

    // forward on XZ plane
    this._vecF.set(0, 0, -1).applyQuaternion(yawObj.quaternion);
    this._vecF.y = 0;
    this._vecF.normalize();

    // right vector
    this._vecR.copy(this._vecF).cross(new THREE.Vector3(0, 1, 0)).normalize();

    let moveX = 0, moveZ = 0;
    if (this.state.w) { moveX += this._vecF.x; moveZ += this._vecF.z; }
    if (this.state.s) { moveX -= this._vecF.x; moveZ -= this._vecF.z; }
    if (this.state.d) { moveX += this._vecR.x; moveZ += this._vecR.z; }
    if (this.state.a) { moveX -= this._vecR.x; moveZ -= this._vecR.z; }

    const speed = this.data.speed * dsec;
    obj.position.x += moveX * speed;
    obj.position.z += moveZ * speed;
  },
  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
});
