(function(){
  AFRAME.registerComponent('classroom-floor', {
    schema: {
      width:  {type: 'number', default: 8.534399726899208}, // 28 ft
      depth:  {type: 'number', default: 7.315199765913608}, // 24 ft
      color:  {type: 'color',  default: '#e5e7eb'}
    },
    init(){
      const W = this.data.width;
      const D = this.data.depth;
      const floor = document.createElement('a-box');
      floor.setAttribute('width',  W);
      floor.setAttribute('depth',  D);
      floor.setAttribute('height', 0.015239999512320017); // 0.05 ft
      floor.setAttribute('position', `0 0.0076199997561600084 0`); // 0.025 ft up
      floor.setAttribute('material', `color:${this.data.color}; roughness:1; metalness:0`);
      this.el.appendChild(floor);
    }
  });
})();
