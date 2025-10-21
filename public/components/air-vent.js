(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('air-vent', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 2},
      height: {type: 'number', default: 1},
      color:  {type: 'color', default: '#9ca3af'}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const W = this.data.width * u;
      const H = this.data.height * u;

      const panel = document.createElement('a-box');
      panel.setAttribute('width', W);
      panel.setAttribute('height', H);
      panel.setAttribute('depth', 0.05 * u);
      panel.setAttribute('material', `color:${this.data.color}; metalness:0.5; roughness:0.6`);
      this.el.appendChild(panel);

      for (let i=0;i<6;i++){
        const slat = document.createElement('a-box');
        slat.setAttribute('width', W*0.9);
        slat.setAttribute('height', 0.03 * u);
        slat.setAttribute('depth', 0.06 * u);
        const y = -H/2 + (i+1) * (H/7);
        slat.setAttribute('position', `0 ${y} 0.03`);
        slat.setAttribute('material', 'color:#6b7280; metalness:0.6; roughness:0.3');
        this.el.appendChild(slat);
      }
    }
  });
})();
