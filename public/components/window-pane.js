(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('window-pane', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 4},
      height: {type: 'number', default: 4},
      frameColor: {type: 'color', default: '#2f2f2f'},
      glassTint:  {type: 'color', default: '#a3d0ff'},
      opacity:    {type: 'number', default: 0.5}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const W = this.data.width * u;
      const H = this.data.height * u;

      const glass = document.createElement('a-box');
      glass.setAttribute('width', W);
      glass.setAttribute('height', H);
      glass.setAttribute('depth', 0.03 * u);
      glass.setAttribute('material', `color:${this.data.glassTint}; opacity:${this.data.opacity}; transparent:true; metalness:0; roughness:0.1`);
      this.el.appendChild(glass);

      const frame = document.createElement('a-box');
      frame.setAttribute('width', W + 0.05*u);
      frame.setAttribute('height', H + 0.05*u);
      frame.setAttribute('depth', 0.02 * u);
      frame.setAttribute('material', `color:${this.data.frameColor}; metalness:0.6; roughness:0.4`);
      frame.setAttribute('position', '0 0 -0.03');
      this.el.appendChild(frame);
    }
  });
})();
