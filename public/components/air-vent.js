(function(){
  AFRAME.registerComponent('air-vent', {
    schema: {
      width:  {type: 'number', default: 0.6096},   // 2 ft / 3.28084
      height: {type: 'number', default: 0.3048},   // 1 ft / 3.28084
      color:  {type: 'color',  default: '#9ca3af'}
    },
    init(){
      const W = this.data.width;
      const H = this.data.height;

      const panel = document.createElement('a-box');
      panel.setAttribute('width',  W);
      panel.setAttribute('height', H);
      panel.setAttribute('depth',  0.01524); // 0.05 ft
      panel.setAttribute('material', `color:${this.data.color}; metalness:0.5; roughness:0.6`);
      this.el.appendChild(panel);

      for (let i = 0; i < 6; i++){
        const slat = document.createElement('a-box');
        slat.setAttribute('width',  W*0.9);
        slat.setAttribute('height', 0.009144);   // 0.03 ft
        slat.setAttribute('depth',  0.018288);   // 0.06 ft
        const y = -H/2 + (i+1) * (H/7);
        slat.setAttribute('position', `0 ${y} 0.009144`); // 0.03 ft forward
        slat.setAttribute('material', 'color:#6b7280; metalness:0.6; roughness:0.3');
        this.el.appendChild(slat);
      }
    }
  });
})();
