// components/door.js
(function () {
  const FT = 0.3048;

  AFRAME.registerComponent('door', {
    schema: {
      width:       {type: 'number', default: 3},     // door leaf width
      height:      {type: 'number', default: 7},     // door leaf height
      thickness:   {type: 'number', default: 0.15},  // door leaf thickness (ft or m)
      units:       {type: 'string', default: 'ft'},  // 'ft' | 'm'
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
      const s  = d.units.toLowerCase() === 'ft' ? FT : 1.0;

      this.isOpen = false;

      // Create a pivot entity so we can rotate around the hinge edge.
      // This component is attached to <a-entity> (the PIVOT).
      // We'll add a child <a-box> "panel" positioned so that the hinge sits at the pivot origin.
      this.panel = document.createElement('a-box');
      const w = d.width * s;
      const h = d.height * s;
      const t = d.thickness * s;

      // Place pivot at ground and move panel up by h/2.
      // For left hinge: panel's center is +w/2 on X. For right hinge: -w/2.
      const hingeSign = (d.hinge === 'right') ? -1 : 1;
      this.panel.setAttribute('position', `${hingeSign * (w / 2)} ${h / 2} 0`);
      this.panel.setAttribute('geometry', {width: w, height: h, depth: t});
      this.panel.setAttribute('material', {color: d.color, shader: 'standard'});

      el.appendChild(this.panel);

      // Ensure the pivot is at ground level (y=0) so the leaf sits on the ground naturally.
      // If user already set a y, we won't override it.
      const pos = Object.assign({x:0,y:0,z:0}, el.getAttribute('position') || {});
      if (Math.abs(pos.y) < 1e-4) {
        el.setAttribute('position', `${pos.x} 0 ${pos.z}`);
      }

      // Start closed: set rotation = 0 on pivot.
      el.setAttribute('rotation', '0 0 0');

      // Collisions: apply only when closed (optional).
      if (d.collideWhenClosed) this._applyCollisionClosed(true);

      // Toggle on click
      el.addEventListener('click', () => this.toggle());

      // Safety: clear any previous animations if dev hot-reloads
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
      const el = this.el;
      const d  = this.data;

      const toY = this.isOpen ? 0 : (d.hinge === 'right' ? -d.openAngle : d.openAngle);

      // If opening, drop collision first; if closing, re-add at end.
      if (d.collideWhenClosed) {
        if (!this.isOpen) this._applyCollisionClosed(false);
      }

      el.removeAttribute('animation__open'); // reset
      el.setAttribute('animation__open', {
        property: 'rotation',
        to: `0 ${toY} 0`,
        dur: d.speed,
        easing: d.easing,
      });

      // After animation completes, set collision if closed.
      setTimeout(() => {
        this.isOpen = !this.isOpen;
        if (d.collideWhenClosed) {
          this._applyCollisionClosed(!this.isOpen);
        }
      }, d.speed + 20);
    }
  });
})();
