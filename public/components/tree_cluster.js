// Tree cluster for quick greenery (now meters)
AFRAME.registerComponent('tree-cluster', {
  schema: {
    count:     {type:'number', default: 12},
    radius:    {type:'number', default: 30.48} // 100 ft -> 30.48 m
  },
  init(){
    const d  = this.data;
    const el = this.el;
    const R  = d.radius;
    for (let i = 0; i < d.count; i++){
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * R;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const trunkH = 2 + Math.random()*2;
      const crownR = 1 + Math.random()*1.8;

      const trunk = document.createElement('a-cylinder');
      trunk.setAttribute('radius', 0.12);
      trunk.setAttribute('height', trunkH);
      trunk.setAttribute('color', '#6b4f37');
      trunk.setAttribute('position', `${x} ${trunkH/2} ${z}`);
      el.appendChild(trunk);

      const crown = document.createElement('a-sphere');
      crown.setAttribute('radius', crownR);
      crown.setAttribute('color', '#2e6b3b');
      crown.setAttribute('position', `${x} ${trunkH + crownR*0.6} ${z}`);
      crown.setAttribute('material', 'roughness:1; metalness:0');
      el.appendChild(crown);
    }
  }
});
