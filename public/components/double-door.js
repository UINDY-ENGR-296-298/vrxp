(function(){
  AFRAME.registerComponent('double-door', {
    schema: {
      width:      {type: 'number', default: 1.828799941478402},   // 6 ft
      height:     {type: 'number', default: 2.133599931724802},   // 7 ft
      thickness:  {type: 'number', default: 0.06095999804928007}, // 0.2 ft
      frameColor: {type: 'color',  default: '#444'},
      leafColor:  {type: 'color',  default: '#888'},
      autoOpen:   {type: 'boolean', default: true}
    },
    init(){
      const d = this.data;
      const W = d.width;
      const H = d.height;
      const T = d.thickness;
      const half = W / 2 - 0.006095999804928007; // 0.02 ft inset

      // frame around both leaves
      const frame = document.createElement('a-box');
      frame.setAttribute('width',  W + 0.06095999804928007); // +0.2 ft
      frame.setAttribute('height', H + 0.06095999804928007); // +0.2 ft
      frame.setAttribute('depth',  T);
      frame.setAttribute('material', `color:${d.frameColor}; metalness:0.6; roughness:0.4`);
      this.el.appendChild(frame);

      // left leaf
      const left = document.createElement('a-box');
      left.classList.add('door-left');
      left.setAttribute('width',  half);
      left.setAttribute('height', H);
      left.setAttribute('depth',  T * 0.8);
      left.setAttribute('material', `color:${d.leafColor}; metalness:0.2; roughness:0.8`);
      left.setAttribute('position', `${-half/2} 0 0`);
      this.el.appendChild(left);

      // right leaf
      const right = document.createElement('a-box');
      right.classList.add('door-right');
      right.setAttribute('width',  half);
      right.setAttribute('height', H);
      right.setAttribute('depth',  T * 0.8);
      right.setAttribute('material', `color:${d.leafColor}`);
      right.setAttribute('position', `${half/2} 0 0`);
      this.el.appendChild(right);

      if (d.autoOpen){
        // swing animations (unchanged angles/time, just geometry above is meters now)
        this.el.setAttribute(
          'animation__openL',
          `property: children.1.rotation; to: 0 70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad`
        );
        this.el.setAttribute(
          'animation__openR',
          `property: children.2.rotation; to: 0 -70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad`
        );
        this.el.setAttribute(
          'animation__closeL',
          `property: children.1.rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad`
        );
        this.el.setAttribute(
          'animation__closeR',
          `property: children.2.rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad`
        );

        // invisible trigger zone in front of doors
        const zone = document.createElement('a-entity');
        zone.setAttribute('position', '0 0 0.6095999804928006'); // 2 ft forward
        zone.setAttribute(
          'geometry',
          'primitive: box; width: 0.914399970739201; height: 0.6095999804928006; depth: 0.914399970739201'
          // 3x2x3 ft box
        );
        zone.setAttribute('material', 'opacity:0; transparent:true');
        zone.addEventListener('mouseenter', ()=> this.el.emit('dooropen'));
        zone.addEventListener('mouseleave', ()=> this.el.emit('doorclose'));
        this.el.appendChild(zone);
      }
    }
  });
})();
