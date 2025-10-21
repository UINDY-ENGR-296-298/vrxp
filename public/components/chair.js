(function(){
  const FT = 0.3048;

  AFRAME.registerComponent('classroom-chair', {
    schema: {
      units: {type: 'string', default: 'ft'}, // 'ft' | 'm'
      seatWidth:  {type: 'number', default: 1.6},
      seatDepth:  {type: 'number', default: 1.6},
      seatHeight: {type: 'number', default: 1.6},
      backHeight: {type: 'number', default: 1.6},
      color:      {type: 'color',  default: '#3f3f46'},
      frameColor: {type: 'color',  default: '#222'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const d = this.data;
      const W = d.seatWidth  * u;
      const D = d.seatDepth  * u;
      const H = d.seatHeight * u;
      const BH= d.backHeight * u;

      const root = this.el;

      // seat
      const seat = document.createElement('a-box');
      seat.setAttribute('width',  W);
      seat.setAttribute('depth',  D);
      seat.setAttribute('height', 0.08 * u);
      seat.setAttribute('position', `0 ${H} 0`);
      seat.setAttribute('material', `color:${d.color}; metalness:0.1; roughness:0.8`);
      root.appendChild(seat);

      // backrest
      const back = document.createElement('a-box');
      back.setAttribute('width',  W);
      back.setAttribute('height', BH);
      back.setAttribute('depth', 0.06 * u);
      back.setAttribute('position', `0 ${H + BH/2} ${-D/2 + 0.03 * u}`);
      back.setAttribute('material', `color:${d.color}; metalness:0.1; roughness:0.8`);
      root.appendChild(back);

      // tubular legs
      const mkLeg = (x,z)=>{
        const leg = document.createElement('a-cylinder');
        leg.setAttribute('radius', 0.04 * u);
        leg.setAttribute('height', H);
        leg.setAttribute('material', `color:${d.frameColor}; metalness:0.6; roughness:0.4`);
        leg.setAttribute('position', `${x} ${H/2} ${z}`);
        return leg;
      };
      const x = W/2 - 0.08*u, z = D/2 - 0.08*u;
      root.appendChild(mkLeg( x,  z));
      root.appendChild(mkLeg(-x,  z));
      root.appendChild(mkLeg( x, -z));
      root.appendChild(mkLeg(-x, -z));
    }
  });
})();
