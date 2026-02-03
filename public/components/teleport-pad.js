AFRAME.registerComponent('teleport-pad', {
  schema: {
    to:       {type: 'string'},        // HTML file to teleport to
    width:    {type: 'number', default: 2},
    depth:    {type: 'number', default: 2},
    height:   {type: 'number', default: 0.2},
    color:    {type: 'string', default: '#1e90ff'}, // base color
    glowColor:{type: 'string', default: '#00ffff'}, // ring and beam color
    radius:   {type: 'number', default: 1.2},       // trigger distance on XZ
    fadetime: {type: 'number', default: 800}        // fade duration in ms
  },

  init: function () {
    const data = this.data;
    const el   = this.el;

    // make sure the main entity has no strange default geometry
    el.setAttribute('geometry', 'primitive: box; width: 0.001; height: 0.001; depth: 0.001; visible: false');
    el.setAttribute('material', 'opacity: 0; transparent: true');

    // create a base disc
    const base = document.createElement('a-entity');
    base.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: data.width * 0.5,
      height: 0.05
    });
    base.setAttribute('position', '0 0.025 0');
    base.setAttribute('rotation', '-90 0 0');
    base.setAttribute('material', {
      color: data.color,
      metalness: 0.3,
      roughness: 0.2,
      emissive: data.color,
      emissiveIntensity: 0.4
    });
    // subtle pulsing on the base
    base.setAttribute('animation__pulse', {
      property: 'material.emissiveIntensity',
      dir: 'alternate',
      dur: 900,
      loop: true,
      from: 0.2,
      to: 0.7,
      easing: 'easeInOutSine'
    });

    // spinning ring
    const ring = document.createElement('a-entity');
    ring.setAttribute('geometry', {
      primitive: 'torus',
      radius: data.width * 0.55,
      radiusTubular: 0.04,
      segmentsRadial: 16,
      segmentsTubular: 32
    });
    ring.setAttribute('position', '0 0.2 0');
    ring.setAttribute('material', {
      color: data.glowColor,
      emissive: data.glowColor,
      emissiveIntensity: 0.9,
      metalness: 0.1,
      roughness: 0.1
    });
    ring.setAttribute('animation__spin', {
      property: 'rotation',
      to: '0 360 0',
      dur: 4000,
      loop: true,
      easing: 'linear'
    });

    // vertical energy beam
    const beam = document.createElement('a-entity');
    beam.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: data.width * 0.18,
      height: 2.5
    });
    beam.setAttribute('position', '0 1.3 0');
    beam.setAttribute('material', {
      color: data.glowColor,
      emissive: data.glowColor,
      emissiveIntensity: 0.6,
      opacity: 0.35,
      transparent: true
    });
    beam.setAttribute('animation__beamPulse', {
      property: 'material.opacity',
      dir: 'alternate',
      dur: 1200,
      loop: true,
      from: 0.18,
      to: 0.5,
      easing: 'easeInOutSine'
    });

    // slight hover wobble on the ring
    ring.setAttribute('animation__hover', {
      property: 'position',
      dir: 'alternate',
      dur: 1100,
      loop: true,
      from: '0 0.15 0',
      to: '0 0.25 0',
      easing: 'easeInOutSine'
    });

    // attach visuals to pad entity
    el.appendChild(base);
    el.appendChild(ring);
    el.appendChild(beam);

    // references for teleport logic
    this.rigEl = document.querySelector('#rig');
    this._padPos = new THREE.Vector3();
    this._rigPos = new THREE.Vector3();
    this._teleported = false;
  },

  tick: function () {
    if (this._teleported) return;
    if (!this.data.to) return;
    if (!this.rigEl) {
      this.rigEl = document.querySelector('#rig');
      if (!this.rigEl) return;
    }

    // world positions
    this.el.object3D.getWorldPosition(this._padPos);
    this.rigEl.object3D.getWorldPosition(this._rigPos);

    // distance in XZ plane
    const dx = this._rigPos.x - this._padPos.x;
    const dz = this._rigPos.z - this._padPos.z;
    const distSq = dx * dx + dz * dz;

    if (distSq <= this.data.radius * this.data.radius) {
      this._teleported = true;
      this.startFadeAndTeleport();
    }
  },

  startFadeAndTeleport: function () {
    const url = this.data.to;
    const duration = this.data.fadetime;

    let overlay = document.getElementById('screen-fade-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'screen-fade-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'black';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.style.transition = 'opacity ' + duration + 'ms ease';
      document.body.appendChild(overlay);
    } else {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity ' + duration + 'ms ease';
    }

    requestAnimationFrame(function () {
      overlay.style.opacity = '1';
    });

    setTimeout(function () {
      window.location.href = url;
    }, duration);
  }
});
