(function(){
  const FT = 0.3048;
  AFRAME.registerComponent('double-door', {
    schema: {
      units: {type: 'string', default: 'ft'},
      width:  {type: 'number', default: 6},  // total opening
      height: {type: 'number', default: 7},
      thickness: {type: 'number', default: 0.2},
      frameColor: {type: 'color', default: '#444'},
      leafColor:  {type: 'color', default: '#888'},
      autoOpen:   {type: 'boolean', default: true}
    },
    init(){
      const u = this.data.units === 'ft' ? FT : 1.0;
      const d = this.data;
      const W = d.width * u, H = d.height * u, T = d.thickness * u;
      const half = W / 2 - 0.02*u;

      // frame
      const frame = document.createElement('a-box');
      frame.setAttribute('width', W + 0.2*u);
      frame.setAttribute('height', H + 0.2*u);
      frame.setAttribute('depth', T);
      frame.setAttribute('material', `color:${d.frameColor}; metalness:0.6; roughness:0.4`);
      this.el.appendChild(frame);

      // left leaf
      const left = document.createElement('a-box');
      left.classList.add('door-left');
      left.setAttribute('width', half);
      left.setAttribute('height', H);
      left.setAttribute('depth', T * 0.8);
      left.setAttribute('material', `color:${d.leafColor}; metalness:0.2; roughness:0.8`);
      left.setAttribute('position', `${-half/2} 0 0`);
      this.el.appendChild(left);

      // right leaf
      const right = document.createElement('a-box');
      right.classList.add('door-right');
      right.setAttribute('width', half);
      right.setAttribute('height', H);
      right.setAttribute('depth', T * 0.8);
      right.setAttribute('material', `color:${d.leafColor}`);
      right.setAttribute('position', `${ half/2} 0 0`);
      this.el.appendChild(right);

      if (d.autoOpen){
        this.el.setAttribute('animation__openL', `property: children[1].rotation; to: 0 70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad`);
        this.el.setAttribute('animation__openR', `property: children[2].rotation; to: 0 -70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad`);
        this.el.setAttribute('animation__closeL', `property: children[1].rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad`);
        this.el.setAttribute('animation__closeR', `property: children[2].rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad`);

        const zone = document.createElement('a-entity');
        zone.setAttribute('position', '0 0 2');
        zone.setAttribute('geometry', 'primitive: box; width: 3; height: 2; depth: 3');
        zone.setAttribute('material', 'opacity:0; transparent:true');
        zone.addEventListener('mouseenter', ()=> this.el.emit('dooropen'));
        zone.addEventListener('mouseleave', ()=> this.el.emit('doorclose'));
        this.el.appendChild(zone);
      }
    }
  });
})();
