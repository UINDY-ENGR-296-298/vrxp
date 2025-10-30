// components/door.js
(function () {

  AFRAME.registerComponent('door', {
    schema: {
      width:       {type: 'number', default: 0.914399970739201},   // 3 ft
      height:      {type: 'number', default: 2.133599931724802},   // 7 ft
      thickness:   {type: 'number', default: 0.045719998536960044},// 0.15 ft
      color:       {type: 'color',  default: '#8B4513'},

      hinge:       {type: 'string', default: 'left'}, // 'left' | 'right'
      openAngle:   {type: 'number', default: 90},     // degrees (+Y)
      speed:       {type: 'number', default: 700},    // ms
      easing:      {type: 'string', default: 'easeInOutQuad'},

      // If true, door only collides when closed; when opening/open, collisions are disabled.
      collideWhenClosed: {type: 'boolean', default: true},
    },

    init() {
      const el = this.el;
      const d  = this.data;

      this.isOpen = false;

      // Create the door panel
      this.panel = document.createElement('a-box');
      const w = d.width;
      const h = d.height;
      const t = d.thickness;

      const hingeSign = (d.hinge === 'right') ? -1 : 1;
      this.panel.setAttribute('position', `${hingeSign * (w / 2)} ${h / 2} 0`);
      this.panel.setAttribute('geometry', {width: w, height: h, depth: t});
      this.panel.setAttribute('material', {color: d.color, shader: 'standard'});

      el.appendChild(this.panel);

      // Keep pivot at ground
      const pos = Object.assign({x:0,y:0,z:0}, el.getAttribute('position') || {});
      if (Math.abs(pos.y) < 1e-4) {
        el.setAttribute('position', `${pos.x} 0 ${pos.z}`);
      }

      // Start closed
      el.setAttribute('rotation', '0 0 0');

      // Collisions: apply only when closed (optional).
      if (d.collideWhenClosed) this._applyCollisionClosed(true);

      // toggle on click
      el.addEventListener('click', () => this.toggle());

      // clear any hot-reload animations
      ['animation__open'].forEach(a => el.removeAttribute(a));
    },

    _applyCollisionClosed(closed) {
      if (!this.panel) return;
      if (closed) {
        if (!this.panel.hasAttribute('static-body')) {
          this.panel.setAttribute('static-body', 'shape: box');
        }
      } else {
        if (this.panel.hasAttribute('static-body')) {
          this.panel.removeAttribute('static-body');
        }
      }
    },

    toggle() {
      const d = this.data;
      const el= this.el;

      const angle = this.isOpen ? 0 : (d.hinge === 'right' ? -d.openAngle : d.openAngle);

      el.setAttribute('animation__open', {
        property: 'rotation',
        to: `0 ${angle} 0`,
        dur: d.speed,
        easing: d.easing,
      });

      // After animation completes, update collision
      setTimeout(() => {
        this.isOpen = !this.isOpen;
        if (d.collideWhenClosed) {
          this._applyCollisionClosed(!this.isOpen);
        }
      }, d.speed + 20);
    }
  });
})();
