(function(){
  AFRAME.registerComponent('projection-screen', {
    schema: {
      width:  {type: 'number', default: 2.4383999219712025},  // 8 ft
      height: {type: 'number', default: 1.3715999561088015},  // 4.5 ft
      color:  {type: 'color',  default: '#ffffff'}
    },
    init(){
      const W = this.data.width;
      const H = this.data.height;

      const screen = document.createElement('a-box');
      screen.setAttribute('width',  W);
      screen.setAttribute('height', H);
      screen.setAttribute('depth',  0.006095999804928007); // 0.02 ft
      screen.setAttribute('material', `color:${this.data.color}; metalness:0; roughness:1`);
      this.el.appendChild(screen);
    }
  });
})();
