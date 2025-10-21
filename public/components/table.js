(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('classroom-table', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 4.0},
      depth:  {type: 'number', default: 1.8},
      height: {type: 'number', default: 2.5},
      topColor:   {type: 'color', default: '#d4d4d8'},
      frameColor: {type: 'color', default: '#2b2b2b'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const d = this.data;
      const W = d.width * u, D = d.depth * u, H = d.height * u;

      const top = document.createElement('a-box');
      top.setAttribute('width', W);
      top.setAttribute('depth', D);
      top.setAttribute('height', 0.08 * u);
      top.setAttribute('position', `0 ${H} 0`);
      top.setAttribute('material', `color:${d.topColor}; metalness:0.05; roughness:0.9`);
      this.el.appendChild(top);

      const mkLeg = (x,z)=>{
        const leg = document.createElement('a-cylinder');
        leg.setAttribute('radius', 0.05 * u);
        leg.setAttribute('height', H);
        leg.setAttribute('material', `color:${d.frameColor}; metalness:0.7; roughness:0.3`);
        leg.setAttribute('position', `${x} ${H/2} ${z}`);
        return leg;
      };
      const x = W/2 - 0.1*u, z = D/2 - 0.1*u;
      this.el.appendChild(mkLeg( x,  z));
      this.el.appendChild(mkLeg(-x,  z));
      this.el.appendChild(mkLeg( x, -z));
      this.el.appendChild(mkLeg(-x, -z));
    }
  });
})();
