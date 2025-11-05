(function(){
  AFRAME.registerComponent('ceiling-light-square', {
    schema: {
      size:      {type: 'number', default: 0.6096}, // 2 ft
      intensity: {type: 'number', default: 1.2},
      color:     {type: 'color',  default: '#ffffff'}
    },
    init(){
      const S = this.data.size;

      const panel = document.createElement('a-box');
      panel.setAttribute('width',  S);
      panel.setAttribute('height', 0.012192); // 0.04 ft
      panel.setAttribute('depth',  S);
      panel.setAttribute(
        'material',
        `color:${this.data.color}; emissive:${this.data.color}; emissiveIntensity:0.8; roughness:0.4`
      );
      this.el.appendChild(panel);

      const light = document.createElement('a-light');
      light.setAttribute('type', 'point');
      light.setAttribute('intensity', this.data.intensity);
      light.setAttribute('distance', 5.4864); // 18 ft
      light.setAttribute('decay', 2);
      light.setAttribute('color', this.data.color);
      light.setAttribute('position', `0 -0.09144 0`); // 0.3 ft down
      this.el.appendChild(light);
    }
  });
})();
