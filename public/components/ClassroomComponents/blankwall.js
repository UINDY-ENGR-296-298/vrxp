// components/blankwall.js
(function () {
  const FT = 0.3048;

  AFRAME.registerComponent('blank-wall', {
    schema: {
      // sizes in chosen units
      width:     {type: 'number', default: (6/3.2)},   
      height:    {type: 'number', default: (6/3.2)},     
      thickness: {type: 'number', default: (0.5/3.2)},   
      units:     {type: 'string', default: 'm'},  // 'ft' | 'm'
      color:     {type: 'color',  default: '#ffffffff'},
      // auto place the wall so it sits on the ground (y = height/2)
      anchor:    {type: 'string', default: 'ground'} // 'ground' | 'center'
    },

    init() {
      this._prevH = null;
      this.apply(true);
    },

    update() {
      this.apply(false);
    },

    apply(initial) {
      const el = this.el;
      const d  = this.data;

      const unitScale = d.units.toLowerCase() === 'ft' ? FT : 1.0;
      const w = d.width     * unitScale;
      const h = d.height    * unitScale;
      const t = d.thickness * unitScale;

      // Geometry + material
      el.setAttribute('geometry', { primitive: 'box', width: w, height: h, depth: t });
      el.setAttribute('material', { color: d.color, shader: 'standard' });

      // Ground anchor: keep the wall resting on y = height/2
      if (d.anchor === 'ground') {
        const pos = Object.assign({x:0, y:0, z:0}, el.getAttribute('position') || {});
        const wasOnGround = (this._prevH !== null) && approx(pos.y, this._prevH / 2);
        if (initial || pos.y === 0 || wasOnGround) {
          el.setAttribute('position', `${pos.x} ${h/2} ${pos.z}`);
        }
      }

      this._prevH = h;

      function approx(a, b, eps = 1e-3) { return Math.abs(a - b) < eps; }
    }
  });
})();
