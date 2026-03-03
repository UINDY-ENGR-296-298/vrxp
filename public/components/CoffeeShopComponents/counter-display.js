(function(){

AFRAME.registerComponent('counter-display', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    length: { type: 'number', default: 1 },
    color: { type: 'color', default: '#232323ff' },
  },

  init() {
    const d = this.data;
    const shape = new THREE.Shape();
    shape.moveTo(-1 * d.width, 1 * d.height); 
    shape.lineTo(-1 * d.width, 2 * d.height);
    shape.lineTo(1 * d.width, 2 * d.height);
    shape.lineTo(1 * d.width, 1 * d.height);
    shape.lineTo(0.75 * d.width, 0);
    shape.lineTo(-0.75 * d.width, 0);
    shape.lineTo(-1 * d.width, 1 * d.height);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: d.length,
      bevelEnabled: false
    });
    const material = new THREE.MeshStandardMaterial({
      color: d.color,
      roughness: 0.3,
      metalness: 0.1
    });
    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  }
});

})();

