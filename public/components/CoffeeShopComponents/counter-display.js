(function(){

  // Register a the counter-display component to later implement in html file

  AFRAME.registerComponent('counter-display', {
    schema: {
      width: { type: 'number', default: 1 },
      height: { type: 'number', default: 1 },
      length: { type: 'number', default: 1 },
      color: { type: 'color', default: '#232323ff' },
    },

    init() {

      // Instead of using complex curves like the ceiling component, we use simple lines here
      const d = this.data;
      const shape = new THREE.Shape();

      // Move to Starting point
      shape.moveTo(-1 * d.width, 1 * d.height); 
      // Draw lines
      shape.lineTo(-1 * d.width, 2 * d.height);
      shape.lineTo(1 * d.width, 2 * d.height);
      shape.lineTo(1 * d.width, 1 * d.height);
      shape.lineTo(0.75 * d.width, 0);
      shape.lineTo(-0.75 * d.width, 0);
      // Connect back to the start
      shape.lineTo(-1 * d.width, 1 * d.height);
      shape.closePath();

      // Extrude the shape to make it a 3D object
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: d.length,
        bevelEnabled: false
      });

      // Give it a color and other material properties
      const material = new THREE.MeshStandardMaterial({
        color: d.color,
        roughness: 0.3,
        metalness: 0.1
      });
      this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
    }
  });

  // Register the counter top/lid (the curved portion) to be used in html file

  AFRAME.registerComponent('counter-display-top', {
    schema: {
      width: { type: 'number', default: 1 },
      height: { type: 'number', default: 1 },
      length: { type: 'number', default: 1 },
      color: { type: 'color', default: '#e6e6e6ff' },
    },

    // The lid is a simple semi-ellipse, so it is much simpler than using bezier curves in the ceiling
    init() {
      const d = this.data;
      const shape = new THREE.Shape();
      // Move to Starting point
      shape.moveTo(0, 2 * d.height); 
      // Draw arc
      shape.arc(0, 0, d.width, 0, Math.PI, false);
      // Close the path
      shape.closePath();

      // Extrude the shape to make it a 3D object
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: d.length,
        bevelEnabled: false
      });

      // Give it a color and other material properties
      const material = new THREE.MeshStandardMaterial({
        color: d.color,
        transparent: true,
        opacity: 0.5
      });
      this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
    }
  });
})();

