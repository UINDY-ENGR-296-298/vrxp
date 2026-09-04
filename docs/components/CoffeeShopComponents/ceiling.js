
(function(){

  // Register the Trim (red part) Component with Aframe to later implement in html file

  AFRAME.registerComponent('ceiling-trim', {
    schema: {
      width: { type: 'number', default: 1 },
      length: { type: 'number', default: 1.5 },
      thickness: { type: 'number', default: 1 },
      depth: { type: 'number', default: 1 },
      color: { type: 'color', default: '#d41234' }
    },

    // constructor
    init() {
      const d = this.data;
      const shape = new THREE.Shape();

      // Draw the Shape (Docs found at https://threejs.org/docs/#Shape)
      
      // Start at origin
      shape.moveTo(0, 0);

      // Use a series of bezier curves to create the main curve (see documentation)
      // The numbers are based on this graph: https://www.desmos.com/calculator/odnsmxx735
      // Specifically, the GREEN curve, which is the one labeled g(x)
      // The other lines in the graph are to help with getting the correct control points (see documentation)

      shape.bezierCurveTo(
        d.width * 0.000499975001875, d.length * -0.0598984902865,
        d.width * 0.0330640265864, d.length * -0.796189952839,
        d.width * 0.05, d.length * -0.8432343234323433
      );

      shape.bezierCurveTo(
        d.width * 0.0669359734136, d.length * -0.890278694026,
        d.width * 0.103427132526, d.length * -0.929208463742,
        d.width * 0.15,  d.length * -0.9474009900990099 
      );

      shape.bezierCurveTo(
        d.width * 0.196572867474, d.length * -0.965593516456,
        d.width * 0.350088237616, d.length * -0.982541575323,
        d.width * 0.4,  d.length * -0.9855107461965709
      );

      shape.bezierCurveTo(
        d.width * 0.449911762384, d.length * -0.98847991707,
        d.width * 0.650009835093, d.length * -0.994824811466,
        d.width * 0.7, d.length * -0.9958164830567564
      );

      shape.bezierCurveTo(
        d.width * 0.749990164907,  d.length * -0.996808154648,
        d.width * 0.950002402278, d.length * -0.999509875525,
        d.width * 1,    d.length * -1
      );

      // Thickening the curve so it creates a 2D shape 
      // Create ribbon thickness (thickness of the curve)
      const curvePoints = shape.getPoints(60);

      const ribbon = new THREE.Shape();
      ribbon.moveTo(curvePoints[0].x, curvePoints[0].y);

      curvePoints.forEach(p => ribbon.lineTo(p.x + d.thickness, p.y + d.thickness));
      curvePoints.slice().reverse().forEach(p => ribbon.lineTo(p.x, p.y));

      // Extrude the shape to make it a 3D object
      const geometry = new THREE.ExtrudeGeometry(ribbon, {
        depth: d.depth,
        bevelEnabled: false
      });

      geometry.center();

      // Give it a color and other material properties
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

  // Register the rest of the ceiling (black filled in portion) to be used in html file

  AFRAME.registerComponent('ceiling', {
    schema: {
      width: { type: 'number', default: 1 },
      length: { type: 'number', default: 1.5 },
      depth: { type: 'number', default: 1 },
      color: { type: 'color', default: '#343434ff' }
    },

    // constructor
    init() {
      const d = this.data;
      const shape = new THREE.Shape();

      // Draw the Shape (Docs found at https://threejs.org/docs/#Shape)
      // Start at origin
      shape.moveTo(0, 0);
      shape.bezierCurveTo(
        d.width * 0.000499975001875, d.length * -0.0598984902865,
        d.width * 0.0330640265864, d.length * -0.796189952839,
        d.width * 0.05, d.length * -0.8432343234323433
      );

      shape.bezierCurveTo(
        d.width * 0.0669359734136, d.length * -0.890278694026,
        d.width * 0.103427132526, d.length * -0.929208463742,
        d.width * 0.15,  d.length * -0.9474009900990099 
      );

      shape.bezierCurveTo(
        d.width * 0.196572867474, d.length * -0.965593516456,
        d.width * 0.350088237616, d.length * -0.982541575323,
        d.width * 0.4,  d.length * -0.9855107461965709
      );

      shape.bezierCurveTo(
        d.width * 0.449911762384, d.length * -0.98847991707,
        d.width * 0.650009835093, d.length * -0.994824811466,
        d.width * 0.7, d.length * -0.9958164830567564
      );

      shape.bezierCurveTo(
        d.width * 0.749990164907,  d.length * -0.996808154648,
        d.width * 0.950002402278, d.length * -0.999509875525,
        d.width * 1,    d.length * -1
      );

      // Since we want this part to be filled in, 
      // we can just take the path of the curve and 
      // connect it back to the start with a few straight lines
      shape.lineTo(d.width*1, 0);
      shape.lineTo(0, 0);
      shape.closePath();

      // Extrude the shape to make it a 3D object
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: d.depth,
        bevelEnabled: false
      });

      geometry.center();

      // Give it a color and other material properties
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

