(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('whiteboard', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 8},
      height: {type: 'number', default: 4},
      frameColor: {type: 'color', default: '#333'},
      surfaceColor: {type: 'color', default: '#f8fafc'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const W = this.data.width * u;
      const H = this.data.height * u;

      const board = document.createElement('a-box');
      board.setAttribute('width', W);
      board.setAttribute('height', H);
      board.setAttribute('depth', 0.03 * u);
      board.setAttribute('material', `color:${this.data.surfaceColor}; roughness:0.2; metalness:0`);
      this.el.appendChild(board);

      const frame = document.createElement('a-box');
      frame.setAttribute('width', W + 0.04*u);
      frame.setAttribute('height', H + 0.04*u);
      frame.setAttribute('depth', 0.02 * u);
      frame.setAttribute('material', `color:${this.data.frameColor}; metalness:0.6; roughness:0.4`);
      frame.setAttribute('position', '0 0 -0.025');
      this.el.appendChild(frame);
    }
  });
})();
