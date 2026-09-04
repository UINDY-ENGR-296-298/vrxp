(function(){

  // Register the counter base to be used in html file

  AFRAME.registerComponent('counter', {
    schema: {
      width: { type: 'number', default: 1 },
      length: { type: 'number', default: 1.5 },
      depth: { type: 'number', default: 1 },
      color: { type: 'color', default: '#ffffff' },
    },

    init() {
      const d = this.data;
      const shape = new THREE.Shape();

      // This shape is the same general shape as the ceiling, but it has a few
      // cutouts to fit in the counter displays, making it a more complex shape
      // It also means that we have to draw the whole outline, going down the counter and back up

      // Start at origin
      shape.moveTo(d.width * 0.006396, d.length * -0.4);
      shape.bezierCurveTo(
        d.width * 0.00774, d.length * -0.449978,
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

      // Cutout for counter display
      shape.lineTo(d.width * 0.412, d.length * -0.905);
      shape.lineTo(d.width * 0.708, d.length * -0.911);
      shape.lineTo(d.width * 0.7, d.length * -0.9958164830567564);

      shape.bezierCurveTo(
        d.width * 0.749990164907,  d.length * -0.996808154648,
        d.width * 0.950002402278, d.length * -0.999509875525,
        d.width * 1,    d.length * -1
      );

      // Far end of the counter      
      shape.lineTo(d.width* 1, d.length* -0.82569514);

      // Go back to the starting point
      shape.bezierCurveTo(
        d.width * 0.95000129, d.length * -0.82533659,
        d.width * 0.75187248, d.length * -0.8232373,
        d.width * 0.70188, d.length * -0.8223701
      );

      shape.bezierCurveTo(
        d.width * 0.65188752, d.length * -0.8215029,
        d.width * 0.46544929, d.length * -0.8156997,
        d.width * 0.415607, d.length *-0.81173161
      );

      shape.bezierCurveTo(
        d.width * 0.36576471, d.length * -0.80776352,
        d.width * 0.33223368, d.length * -0.80641709,
        d.width * 0.285, d.length * -0.7900165
      );

      shape.bezierCurveTo(
        d.width * 0.23776632, d.length * -0.77361592,
        d.width * 0.20783442, d.length * -0.72675736,
        d.width * 0.1975, d.length * -0.67783701
      );

      shape.bezierCurveTo(
        d.width * 0.18716558, d.length* -0.62891667,
        d.width * 0.177924, d.length* -0.449998,
        d.width * 0.171012, d.length* -0.4
      );

      // Connect back to the starting point
      shape.lineTo(d.width * 0.006396, d.length * -0.4);
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
        side: THREE.DoubleSide,
        roughness: 0.4
      });

      this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
    },

    remove() {
      this.el.removeObject3D('mesh');
    }
  });

})();