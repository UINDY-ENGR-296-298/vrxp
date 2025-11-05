(function(){
  AFRAME.registerComponent('whiteboard', {
    schema: {
      width:        {type: 'number', default: 2.4383999219712025}, // 8 ft
      height:       {type: 'number', default: 1.2191999609856012}, // 4 ft
      frameColor:   {type: 'color',  default: '#333'},
      surfaceColor: {type: 'color',  default: '#f8fafc'}
    },
    init(){
      const W = this.data.width;
      const H = this.data.height;

      const board = document.createElement('a-box');
      board.setAttribute('width',  W);
      board.setAttribute('height', H);
      board.setAttribute('depth',  0.00914399970739201); // 0.03 ft
      board.setAttribute(
        'material',
        `color:${this.data.surfaceColor}; roughness:0.2; metalness:0`
      );
      this.el.appendChild(board);

      const frame = document.createElement('a-box');
      frame.setAttribute('width',  W + 0.012191999609856013); // +0.04 ft
      frame.setAttribute('height', H + 0.012191999609856013); // +0.04 ft
      frame.setAttribute('depth',  0.006095999804928007);     // 0.02 ft
      frame.setAttribute(
        'material',
        `color:${this.data.frameColor}; metalness:0.6; roughness:0.4`
      );
      frame.setAttribute('position', `0 0 -0.0076199997561600084`); // -0.025 ft
      this.el.appendChild(frame);
    }
  });
})();
