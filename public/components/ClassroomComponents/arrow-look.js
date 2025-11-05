AFRAME.registerComponent('arrow-look', {
  schema: {
    yawSpeed:   {type: 'number', default: 90},   // deg per second
    pitchSpeed: {type: 'number', default: 75},   // deg per second
    clamp:      {type: 'number', default: 85}    // deg up:down
  },
  init() {
    this.state = { left:false, right:false, up:false, down:false };
    this.onKeyDown = e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault();
      if (e.code === 'ArrowLeft')  this.state.left  = true;
      if (e.code === 'ArrowRight') this.state.right = true;
      if (e.code === 'ArrowUp')    this.state.up    = true;
      if (e.code === 'ArrowDown')  this.state.down  = true;
    };
    this.onKeyUp = e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault();
      if (e.code === 'ArrowLeft')  this.state.left  = false;
      if (e.code === 'ArrowRight') this.state.right = false;
      if (e.code === 'ArrowUp')    this.state.up    = false;
      if (e.code === 'ArrowDown')  this.state.down  = false;
    };
    window.addEventListener('keydown', this.onKeyDown, {passive:false});
    window.addEventListener('keyup',   this.onKeyUp,   {passive:false});
  },
  tick(time, dt) {
    const dsec = dt / 1000;
    const deg2rad = Math.PI / 180;

    // prefer look-controls if present
    const lc = this.el.components['look-controls'];
    if (lc && lc.pitchObject && lc.yawObject) {
      const yaw = lc.yawObject.rotation;
      const pitch = lc.pitchObject.rotation;

      // apply yaw, left negative, right positive
      if (this.state.left)  yaw.y += this.data.yawSpeed * dsec * deg2rad;
      if (this.state.right) yaw.y +=  -this.data.yawSpeed * dsec * deg2rad;

      // apply pitch, up negative, down positive
      if (this.state.up)    pitch.x += this.data.pitchSpeed * dsec * deg2rad;
      if (this.state.down)  pitch.x +=  -this.data.pitchSpeed * dsec * deg2rad;

      // clamp pitch
      const clampRad = this.data.clamp * deg2rad;
      pitch.x = Math.max(-clampRad, Math.min(clampRad, pitch.x));
    } else {
      // fallback, no look-controls present
      const rot = this.el.getAttribute('rotation');
      if (this.state.left)  rot.y -= this.data.yawSpeed * dsec;
      if (this.state.right) rot.y += this.data.yawSpeed * dsec;
      if (this.state.up)    rot.x -= this.data.pitchSpeed * dsec;
      if (this.state.down)  rot.x += this.data.pitchSpeed * dsec;
      rot.x = Math.max(-this.data.clamp, Math.min(this.data.clamp, rot.x));
      this.el.setAttribute('rotation', `${rot.x} ${rot.y} ${rot.z}`);
    }
  },
  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup',   this.onKeyUp);
  }
});