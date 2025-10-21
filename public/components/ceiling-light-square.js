(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('ceiling-light-square', {
    schema: {
      units: {type: 'string', default: 'ft'},
      size:   {type: 'number', default: 2},
      intensity: {type: 'number', default: 1.2},
      color:  {type: 'color', default: '#ffffff'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const S = this.data.size * u;

      const panel = document.createElement('a-box');
      panel.setAttribute('width', S);
      panel.setAttribute('height', 0.04 * u);
      panel.setAttribute('depth', S);
      panel.setAttribute('material', `color:${this.data.color}; emissive:${this.data.color}; emissiveIntensity:0.8; roughness:0.4`);
      this.el.appendChild(panel);

      const light = document.createElement('a-light');
      light.setAttribute('type', 'point');
      light.setAttribute('intensity', this.data.intensity);
      light.setAttribute('distance', 18 * u);
      light.setAttribute('decay', 2);
      light.setAttribute('color', this.data.color);
      light.setAttribute('position', '0 -0.3 0');
      this.el.appendChild(light);
    }
  });
})();
