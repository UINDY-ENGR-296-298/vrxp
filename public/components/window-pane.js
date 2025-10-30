(function(){
  AFRAME.registerComponent('window-pane', {
    schema: {
      width:      {type: 'number', default: 1.2191999609856012}, // 4 ft
      height:     {type: 'number', default: 1.2191999609856012}, // 4 ft
      frameColor: {type: 'color',  default: '#2f2f2f'},
      glassTint:  {type: 'color',  default: '#a3d0ff'},
      opacity:    {type: 'number', default: 0.5}
    },
    init(){
      const W = this.data.width;
      const H = this.data.height;

      const glass = document.createElement('a-box');
      glass.setAttribute('width',  W);
      glass.setAttribute('height', H);
      glass.setAttribute('depth',  0.00914399970739201); // 0.03 ft
      glass.setAttribute(
        'material',
        `color:${this.data.glassTint}; opacity:${this.data.opacity}; transparent:true; metalness:0; roughness:0.1`
      );
      this.el.appendChild(glass);

      const frame = document.createElement('a-box');
      frame.setAttribute('width',  W + 0.015239999512320017); // +0.05 ft
      frame.setAttribute('height', H + 0.015239999512320017); // +0.05 ft
      frame.setAttribute('depth',  0.006095999804928007);     // 0.02 ft
      frame.setAttribute(
        'material',
        `color:${this.data.frameColor}; metalness:0.6; roughness:0.4`
      );
      frame.setAttribute('position', '0 0 -0.00914399970739201'); // -0.03 ft
      this.el.appendChild(frame);
    }
  });
})();
