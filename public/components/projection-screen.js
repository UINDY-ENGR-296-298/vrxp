(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('projection-screen', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 8},
      height: {type: 'number', default: 4.5},
      color:  {type: 'color',  default: '#ffffff'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const W = this.data.width * u;
      const H = this.data.height * u;

      const screen = document.createElement('a-box');
      screen.setAttribute('width', W);
      screen.setAttribute('height', H);
      screen.setAttribute('depth', 0.02 * u);
      screen.setAttribute('material', `color:${this.data.color}; metalness:0; roughness:1`);
      this.el.appendChild(screen);
    }
  });
})();
