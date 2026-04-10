(function () {
  AFRAME.registerComponent('double-door', {
    schema: {
      width:      { type: 'number', default: 1.828799941478402 },   // 6 ft
      height:     { type: 'number', default: 2.133599931724802 },   // 7 ft
      thickness:  { type: 'number', default: 0.06095999804928007 }, // 0.2 ft
      frameColor: { type: 'color',  default: '#444' },
      leafColor:  { type: 'color',  default: '#888' },
      autoOpen:   { type: 'boolean', default: true }
    },

    init() {
      const d = this.data;
      const W = d.width;
      const H = d.height;
      const T = d.thickness;

      const framePad = 0.06095999804928007;
      const centerGap = 0.012191999609856013; // small center gap
      const leafW = (W - centerGap) / 2;

      this.isOpen = false;
      this.leftPivot = null;
      this.rightPivot = null;
      this.rig = document.querySelector('#rig');

      // frame
      const frame = document.createElement('a-box');
      frame.setAttribute('width', W + framePad);
      frame.setAttribute('height', H + framePad);
      frame.setAttribute('depth', T);
      frame.setAttribute('material', `color:${d.frameColor}; metalness:0.6; roughness:0.4`);
      this.el.appendChild(frame);

      // left pivot at left edge
      const leftPivot = document.createElement('a-entity');
      leftPivot.classList.add('door-left-pivot');
      leftPivot.setAttribute('position', `${-W / 2} 0 0`);
      this.el.appendChild(leftPivot);
      this.leftPivot = leftPivot;

      const leftLeaf = document.createElement('a-box');
      leftLeaf.classList.add('door-left');
      leftLeaf.setAttribute('width', leafW);
      leftLeaf.setAttribute('height', H);
      leftLeaf.setAttribute('depth', T * 0.8);
      leftLeaf.setAttribute('position', `${leafW / 2} 0 0`);
      leftLeaf.setAttribute('material', `color:${d.leafColor}; metalness:0.2; roughness:0.8`);
      leftPivot.appendChild(leftLeaf);

      // right pivot at right edge
      const rightPivot = document.createElement('a-entity');
      rightPivot.classList.add('door-right-pivot');
      rightPivot.setAttribute('position', `${W / 2} 0 0`);
      this.el.appendChild(rightPivot);
      this.rightPivot = rightPivot;

      const rightLeaf = document.createElement('a-box');
      rightLeaf.classList.add('door-right');
      rightLeaf.setAttribute('width', leafW);
      rightLeaf.setAttribute('height', H);
      rightLeaf.setAttribute('depth', T * 0.8);
      rightLeaf.setAttribute('position', `${-leafW / 2} 0 0`);
      rightLeaf.setAttribute('material', `color:${d.leafColor}; metalness:0.2; roughness:0.8`);
      rightPivot.appendChild(rightLeaf);

      // animations go on the pivot entities directly
      leftPivot.setAttribute(
        'animation__open',
        'property: rotation; to: 0 70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad'
      );
      leftPivot.setAttribute(
        'animation__close',
        'property: rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad'
      );

      rightPivot.setAttribute(
        'animation__open',
        'property: rotation; to: 0 -70 0; dur: 600; startEvents: dooropen; easing: easeOutQuad'
      );
      rightPivot.setAttribute(
        'animation__close',
        'property: rotation; to: 0 0 0; dur: 600; startEvents: doorclose; easing: easeOutQuad'
      );

      // optional invisible helper zone
      if (d.autoOpen) {
        const zone = document.createElement('a-box');
        zone.setAttribute('width', Math.max(W * 1.4, 1.2));
        zone.setAttribute('height', Math.max(H * 0.9, 1.8));
        zone.setAttribute('depth', 1.4);
        zone.setAttribute('position', `0 0 0.8`);
        zone.setAttribute('material', 'opacity: 0; transparent: true');
        this.el.appendChild(zone);
        this.zone = zone;
      }
    },

    tick() {
      if (!this.data.autoOpen) return;
      if (!this.rig) this.rig = document.querySelector('#rig');
      if (!this.rig) return;

      const doorPos = new THREE.Vector3();
      const rigPos = new THREE.Vector3();

      this.el.object3D.getWorldPosition(doorPos);
      this.rig.object3D.getWorldPosition(rigPos);

      const dist = doorPos.distanceTo(rigPos);

      if (dist < 2.2 && !this.isOpen) {
        this.openDoor();
      } else if (dist >= 2.6 && this.isOpen) {
        this.closeDoor();
      }
    },

    openDoor() {
      if (this.isOpen) return;
      this.isOpen = true;
      if (this.leftPivot) this.leftPivot.emit('dooropen');
      if (this.rightPivot) this.rightPivot.emit('dooropen');
    },

    closeDoor() {
      if (!this.isOpen) return;
      this.isOpen = false;
      if (this.leftPivot) this.leftPivot.emit('doorclose');
      if (this.rightPivot) this.rightPivot.emit('doorclose');
    }
  });
})();