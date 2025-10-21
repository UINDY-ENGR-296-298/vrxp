(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('classroom-floor', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 28},
      depth:  {type: 'number', default: 24},
      color:  {type: 'color',  default: '#e5e7eb'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const W = this.data.width * u;
      const D = this.data.depth * u;
      const floor = document.createElement('a-box');
      floor.setAttribute('width', W);
      floor.setAttribute('depth', D);
      floor.setAttribute('height', 0.05 * u);
      floor.setAttribute('position', `0 ${0.025*u} 0`);
      floor.setAttribute('material', `color:${this.data.color}; roughness:1; metalness:0`);
      this.el.appendChild(floor);
    }
  });
})();
