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
      d.width * 0.05, d.length * -0.67,
      d.width * 0.15,  d.length * -1.5,
      d.width * 0.25, d.length * -2
    );

    shape.bezierCurveTo(
      d.width * 0.34, d.length * -2.3,
      d.width * 0.59, d.length * -2.8,
      d.width * 0.75, d.length * -3
    );

    shape.bezierCurveTo(
      d.width * 1.1, d.length * -3.26,
      d.width * 1.6, d.length * -3.46,
      d.width * 2,   d.length * -3.55
    );

    shape.bezierCurveTo(
      d.width * 2.5, d.length * -3.64,
      d.width * 3,   d.length * -3.69,
      d.width * 3.5, d.length * -3.73
    );

    shape.bezierCurveTo(
      d.width * 4,   d.length * -3.76,
      d.width * 4.6, d.length * -3.79,
      d.width * 5,   d.length * -3.8
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
      d.width * 0.05, d.length * -0.67,
      d.width * 0.15,  d.length * -1.5,
      d.width * 0.25, d.length * -2
    );

    shape.bezierCurveTo(
      d.width * 0.34, d.length * -2.3,
      d.width * 0.59, d.length * -2.8,
      d.width * 0.75, d.length * -3
    );

    shape.bezierCurveTo(
      d.width * 1.1, d.length * -3.26,
      d.width * 1.6, d.length * -3.46,
      d.width * 2,   d.length * -3.55
    );

    shape.bezierCurveTo(
      d.width * 2.5, d.length * -3.64,
      d.width * 3,   d.length * -3.69,
      d.width * 3.5, d.length * -3.73
    );

    shape.bezierCurveTo(
      d.width * 4,   d.length * -3.76,
      d.width * 4.6, d.length * -3.79,
      d.width * 5,   d.length * -3.8
    );

    shape.lineTo(d.width*5, 0);
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

