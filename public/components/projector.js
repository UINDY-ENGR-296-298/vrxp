
(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('ceiling-projector', {
    schema: {
      units: {type: 'string', default: 'ft'},
      bodyColor: {type: 'color', default: '#ddd'},
      lensColor: {type: 'color', default: '#88c'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;

      const body = document.createElement('a-box');
      body.setAttribute('width',  0.8 * u);
      body.setAttribute('height', 0.3 * u);
      body.setAttribute('depth',  0.6 * u);
      body.setAttribute('material', `color:${this.data.bodyColor}; metalness:0.1; roughness:0.7`);
      this.el.appendChild(body);

      const pole = document.createElement('a-cylinder');
      pole.setAttribute('radius', 0.04 * u);
      pole.setAttribute('height', 0.4 * u);
      pole.setAttribute('position', `0 ${0.35*u} 0`);
      pole.setAttribute('material', 'color:#999; metalness:0.6; roughness:0.3');
      this.el.appendChild(pole);

      const lens = document.createElement('a-cylinder');
      lens.setAttribute('radius', 0.09 * u);
      lens.setAttribute('height', 0.12 * u);
      lens.setAttribute('rotation', '0 90 0');
      lens.setAttribute('position', `${0.45*u} 0 0`);
      lens.setAttribute('material', `color:${this.data.lensColor}; emissive:${this.data.lensColor}; emissiveIntensity:0.3; metalness:0.2`);
      this.el.appendChild(lens);

      const cone = document.createElement('a-cone');
      cone.setAttribute('radius-bottom', 0.9 * u);
      cone.setAttribute('radius-top', 0.02 * u);
      cone.setAttribute('height', 5.0 * u);
      cone.setAttribute('rotation', '0 90 90');
      cone.setAttribute('position', `${0.55*u} -0.1 0`);
      cone.setAttribute('opacity', 0.05);
      cone.setAttribute('material', 'color:#cde; transparent:true');
      this.el.appendChild(cone);
    }
  });
})();
