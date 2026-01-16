(function(){

AFRAME.registerComponent('ceiling-trim', {
  schema: {
    width: { type: 'number', default: 1 },
    length: { type: 'number', default: 1.5 },
    thickness: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    color: { type: 'color', default: '#942323ff' }
  },

  init() {
    const d = this.data;
    const shape = new THREE.Shape();

    // Start at origin
    shape.moveTo(0, 0);
    shape.bezierCurveTo(
      d.width * 0.01, d.length * -0.1763157895,
      d.width * 0.03, d.length * -0.3947368421,
      d.width * 0.05, d.length * -0.5263157895
    );

    shape.bezierCurveTo(
      d.width * 0.068, d.length * -0.6052631579,
      d.width * 0.118, d.length * -0.7368421053,
      d.width * 0.15,  d.length * -0.7894736842
    );

    shape.bezierCurveTo(
      d.width * 0.22, d.length * -0.8578947368,
      d.width * 0.32, d.length * -0.9105263158,
      d.width * 0.4,  d.length * -0.9342105263
    );

    shape.bezierCurveTo(
      d.width * 0.5, d.length * -0.9578947368,
      d.width * 0.6, d.length * -0.9710526316,
      d.width * 0.7, d.length * -0.9815789474
    );

    shape.bezierCurveTo(
      d.width * 0.8,  d.length * -0.9894736842,
      d.width * 0.92, d.length * -0.9973684211,
      d.width * 1,    d.length * -1
    );



    // Create ribbon thickness
    const curvePoints = shape.getPoints(60);

    const ribbon = new THREE.Shape();
    ribbon.moveTo(curvePoints[0].x, curvePoints[0].y);

    curvePoints.forEach(p => ribbon.lineTo(p.x + d.thickness, p.y + d.thickness));
    curvePoints.slice().reverse().forEach(p => ribbon.lineTo(p.x, p.y));


    const geometry = new THREE.ExtrudeGeometry(ribbon, {
      depth: d.depth,
      bevelEnabled: false
    });

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: d.color,
      side: THREE.DoubleSide,
      roughness: 0.4
    });

    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  },

  remove() {
    this.el.removeObject3D('mesh');
  }
});

AFRAME.registerComponent('ceiling', {
  schema: {
    width: { type: 'number', default: 1 },
    length: { type: 'number', default: 1.5 },
    depth: { type: 'number', default: 1 },
    color: { type: 'color', default: '#343434ff' }
  },

  init() {
    const d = this.data;
    const shape = new THREE.Shape();

    // Start at origin
    shape.moveTo(0, 0);
    shape.bezierCurveTo(
      d.width * 0.01, d.length * -0.1763157895,
      d.width * 0.03, d.length * -0.3947368421,
      d.width * 0.05, d.length * -0.5263157895
    );

    shape.bezierCurveTo(
      d.width * 0.068, d.length * -0.6052631579,
      d.width * 0.118, d.length * -0.7368421053,
      d.width * 0.15,  d.length * -0.7894736842
    );

    shape.bezierCurveTo(
      d.width * 0.22, d.length * -0.8578947368,
      d.width * 0.32, d.length * -0.9105263158,
      d.width * 0.4,  d.length * -0.9342105263
    );

    shape.bezierCurveTo(
      d.width * 0.5, d.length * -0.9578947368,
      d.width * 0.6, d.length * -0.9710526316,
      d.width * 0.7, d.length * -0.9815789474
    );

    shape.bezierCurveTo(
      d.width * 0.8,  d.length * -0.9894736842,
      d.width * 0.92, d.length * -0.9973684211,
      d.width * 1,    d.length * -1
    );

    shape.lineTo(d.width*1, 0);
    shape.lineTo(0, 0);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: d.depth,
      bevelEnabled: false
    });

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: d.color,
      roughness: 0.3,
      metalness: 0.1
    });

    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  },

  remove() {
    this.el.removeObject3D('mesh');
  }
});

})();

