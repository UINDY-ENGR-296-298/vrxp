(function(){
  AFRAME.registerComponent('classroom-table', {
    schema: {
      width:      {type: 'number', default: 1.2191999609856012},  // 4.0 ft
      depth:      {type: 'number', default: 0.5486399853664003},  // 1.8 ft
      height:     {type: 'number', default: 0.7620000091440001},  // 2.5 ft
      topColor:   {type: 'color',  default: '#d4d4d8'},
      frameColor: {type: 'color',  default: '#2b2b2b'}
    },
    init(){
      const d = this.data;
      const W = d.width;
      const D = d.depth;
      const H = d.height;

      const top = document.createElement('a-box');
      top.setAttribute('width',  W);
      top.setAttribute('depth',  D);
      top.setAttribute('height', 0.024383999219712026); // 0.08 ft
      top.setAttribute('position', `0 ${H} 0`);
      top.setAttribute(
        'material',
        `color:${d.topColor}; metalness:0.05; roughness:0.9`
      );
      this.el.appendChild(top);

      const mkLeg = (x,z)=>{
        const leg = document.createElement('a-cylinder');
        leg.setAttribute('radius', 0.015239999512320017); // 0.05 ft
        leg.setAttribute('height', H);
        leg.setAttribute(
          'material',
          `color:${d.frameColor}; metalness:0.7; roughness:0.3`
        );
        leg.setAttribute('position', `${x} ${H/2} ${z}`);
        return leg;
      };

      const inset = 0.030479999024640034; // 0.1 ft
      const x = W/2 - inset;
      const z = D/2 - inset;

      this.el.appendChild(mkLeg( x,  z));
      this.el.appendChild(mkLeg(-x,  z));
      this.el.appendChild(mkLeg( x, -z));
      this.el.appendChild(mkLeg(-x, -z));
    }
  });
})();
