(function(){
  AFRAME.registerComponent('classroom-chair', {
    schema: {
      seatWidth:  {type: 'number', default: 0.48767998439424054},
      seatDepth:  {type: 'number', default: 0.48767998439424054},
      seatHeight: {type: 'number', default: 0.48767998439424054},
      backHeight: {type: 'number', default: 0.914399970739201},
      color:      {type: 'color',  default: '#3f3f46'},
      frameColor: {type: 'color',  default: '#222'}
    },

    init(){
      const d  = this.data;
      const W  = d.seatWidth;
      const D  = d.seatDepth;
      const SH = d.seatHeight;
      const BH = d.backHeight;

      const root = this.el;
      this._lastColliderKey = '';
      this._worldQuat = new THREE.Quaternion();
      this._worldEuler = new THREE.Euler(0, 0, 0, 'YXZ');
      this._worldScale = new THREE.Vector3(1, 1, 1);

      // collider on ROOT, not on seat
      root.setAttribute('collision', 'target: #rig; origin: 0 0.5 0; width: 1; height: 1; depth: 1; log: false; Yrot: 0');

      const seat = document.createElement('a-box');
      seat.setAttribute('width',  W);
      seat.setAttribute('depth',  D);
      seat.setAttribute('height', 0.024383999219712026);
      seat.setAttribute('position', `0 ${SH} 0`);
      seat.setAttribute('material', `color:${d.color}; metalness:0.1; roughness:0.8`);
      root.appendChild(seat);

      const backDepth = 0.030479999024640034;
      const backZ = -D/2 + 0.015239999512320017;
      const backHeightSize = BH - SH;

      const back = document.createElement('a-box');
      back.setAttribute('width',  W);
      back.setAttribute('height', backHeightSize > 0 ? backHeightSize : 0.01);
      back.setAttribute('depth',  backDepth);
      const backY = SH + (backHeightSize / 2);
      back.setAttribute('position', `0 ${backY} ${backZ}`);
      back.setAttribute('material', `color:${d.color}; metalness:0.1; roughness:0.8`);
      root.appendChild(back);

      function mkLeg(x, z){
        const leg = document.createElement('a-cylinder');
        leg.setAttribute('radius', 0.015239999512320017);
        leg.setAttribute('height', SH);
        leg.setAttribute('position', `${x} ${SH/2} ${z}`);
        leg.setAttribute('material', `color:${d.frameColor}; metalness:0.6; roughness:0.3`);
        return leg;
      }

      const legInset = 0.030479999024640034;
      const lx = W/2 - legInset;
      const lz = D/2 - legInset;

      root.appendChild(mkLeg( lx,  lz));
      root.appendChild(mkLeg(-lx,  lz));
      root.appendChild(mkLeg( lx, -lz));
      root.appendChild(mkLeg(-lx, -lz));

      this.syncCollider();
    },

    tick(){
      this.syncCollider();
    },

    syncCollider(){
      const d = this.data;
      const root = this.el;
      const W = d.seatWidth;
      const D = d.seatDepth;
      const BH = d.backHeight;

      root.object3D.getWorldScale(this._worldScale);
      root.object3D.getWorldQuaternion(this._worldQuat);
      this._worldEuler.setFromQuaternion(this._worldQuat, 'YXZ');

      const sx = Math.abs(this._worldScale.x) || 1;
      const sy = Math.abs(this._worldScale.y) || 1;
      const sz = Math.abs(this._worldScale.z) || 1;

      const width = W * sx;
      const height = BH * sy;
      const depth = D * sz;
      const originY = height / 2;
      const yRot = THREE.MathUtils.radToDeg(this._worldEuler.y);

      const key = [
        width.toFixed(5),
        height.toFixed(5),
        depth.toFixed(5),
        originY.toFixed(5),
        yRot.toFixed(3)
      ].join('|');

      if (key === this._lastColliderKey) return;
      this._lastColliderKey = key;

      root.setAttribute(
        'collision',
        `target: #rig; origin: 0 ${originY} 0; width: ${width}; height: ${height}; depth: ${depth}; log: false; Yrot: ${yRot}`
      );
    }
  });
})();