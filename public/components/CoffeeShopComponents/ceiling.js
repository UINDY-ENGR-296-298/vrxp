
(function(){

function yVal(xVal){
  return (1/(100*xVal+1))-(102/101)
}
  /*  Equation of the Curve (Copy-Paste into Desmos Graphing calculator):
      \left(100x+1\right)^{-1}-\frac{102}{101}
  */

AFRAME.registerComponent('ceiling-trim', {
  schema: {
    width: { type: 'number', default: 1 },
    length: { type: 'number', default: 1.5 },
    thickness: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    color: { type: 'color', default: '#d41234' }
  },

  init() {
    const d = this.data;
    const shape = new THREE.Shape();

    // Start at origin
    shape.moveTo(0, 0);
    shape.bezierCurveTo(
      d.width * 0.000499975001875, d.length * -0.0598984902865,
      d.width * 0.0330640265864, d.length * -0.796189952839,
      d.width * 0.05, d.length * yVal(0.05)
    );

    shape.bezierCurveTo(
      d.width * 0.0669359734136, d.length * -0.890278694026,
      d.width * 0.103427132526, d.length * -0.929208463742,
      d.width * 0.15,  d.length * yVal(0.15)
    );

    shape.bezierCurveTo(
      d.width * 0.196572867474, d.length * -0.965593516456,
      d.width * 0.350088237616, d.length * -0.982541575323,
      d.width * 0.4,  d.length * yVal(0.4)
    );

    shape.bezierCurveTo(
      d.width * 0.449911762384, d.length * -0.98847991707,
      d.width * 0.650009835093, d.length * -0.994824811466,
      d.width * 0.7, d.length * yVal(0.7)
    );

    shape.bezierCurveTo(
      d.width * 0.749990164907,  d.length * -0.996808154648,
      d.width * 0.950002402278, d.length * -0.999509875525,
      d.width * 1,    d.length * yVal(1)
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
      d.width * 0.000499975001875, d.length * -0.0598984902865,
      d.width * 0.0330640265864, d.length * -0.796189952839,
      d.width * 0.05, d.length * yVal(0.05)
    );

    shape.bezierCurveTo(
      d.width * 0.0669359734136, d.length * -0.890278694026,
      d.width * 0.103427132526, d.length * -0.929208463742,
      d.width * 0.15,  d.length * yVal(0.15)
    );

    shape.bezierCurveTo(
      d.width * 0.196572867474, d.length * -0.965593516456,
      d.width * 0.350088237616, d.length * -0.982541575323,
      d.width * 0.4,  d.length * yVal(0.4)
    );

    shape.bezierCurveTo(
      d.width * 0.449911762384, d.length * -0.98847991707,
      d.width * 0.650009835093, d.length * -0.994824811466,
      d.width * 0.7, d.length * yVal(0.7)
    );

    shape.bezierCurveTo(
      d.width * 0.749990164907,  d.length * -0.996808154648,
      d.width * 0.950002402278, d.length * -0.999509875525,
      d.width * 1,    d.length * yVal(1)
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

