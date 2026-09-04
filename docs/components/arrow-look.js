AFRAME.registerComponent('arrow-look', {
  schema: {
    yawSpeed:   {type: 'number', default: 120},   // deg per second left/right
    pitchSpeed: {type: 'number', default: 90},    // deg per second up/down
    clamp:      {type: 'number', default: 80}     // pitch clamp in degrees
  },

  init() {
    this.state = { left:false, right:false, up:false, down:false };

    this.onKeyDown = e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft')  this.state.left  = true;
      if (e.code === 'ArrowRight') this.state.right = true;
      if (e.code === 'ArrowUp')    this.state.up    = true;
      if (e.code === 'ArrowDown')  this.state.down  = true;
    };

    this.onKeyUp = e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }
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
    const rad = Math.PI / 180;

    const lc = this.el.components['look-controls'];
    if (!lc || !lc.pitchObject || !lc.yawObject) return;

    const pitch = lc.pitchObject.rotation;
    const yaw   = lc.yawObject.rotation;

    if (this.state.left)  yaw.y += this.data.yawSpeed  * dsec * rad;
    if (this.state.right) yaw.y -= this.data.yawSpeed  * dsec * rad;

    if (this.state.up)    pitch.x += this.data.pitchSpeed * dsec * rad;
    if (this.state.down)  pitch.x -= this.data.pitchSpeed * dsec * rad;

    const clampRad = this.data.clamp * rad;
    pitch.x = Math.max(-clampRad, Math.min(clampRad, pitch.x));
  },

  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup',   this.onKeyUp);
  }
});
