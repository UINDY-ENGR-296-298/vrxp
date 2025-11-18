(function () {
AFRAME.registerComponent('counter', {
  init: function () {
    const scene = this.el.object3D;

    // Curved counter base (approximated with multiple angled segments)
    const segmentMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const darkBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const segments = [
      { x: -1.2, z: 0.5, rotY: 15 },
      { x: -0.6, z: 0.3, rotY: 5 },
      { x: 0, z: 0, rotY: 0 },
    ];

    segments.forEach(({ x, z, rotY }) => {
      const segment = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, 0.6),
        segmentMaterial
      );
      segment.position.set(x, 0.4, z);
      segment.rotation.y = THREE.MathUtils.degToRad(rotY);
      scene.add(segment);
    });

    // Countertop
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.05, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    top.position.set(-0.6, 0.825, 0.2);
    scene.add(top);

    // Glass display case
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.5 })
    );
    glass.position.set(-1.5, 0.6, 0.5);
    scene.add(glass);

    // Coffee cups
    for (let i = 0; i < 2; i++) {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      cup.position.set(-1 + i * 0.2, 0.88, 0.3);
      scene.add(cup);
    }

    // Espresso machine
    const espresso = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    espresso.position.set(-0.2, 0.88, 0.3);
    scene.add(espresso);

    // Orange menu box
    const menu = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.2, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xff6600 })
    );
    menu.position.set(0.1, 0.9, 0.3);
    scene.add(menu);
  }
});

})();