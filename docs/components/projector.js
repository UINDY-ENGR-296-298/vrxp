(function(){
  AFRAME.registerComponent('ceiling-projector', {
    schema: {
      bodyColor: {type: 'color', default: '#ddd'},
      lensColor: {type: 'color', default: '#88c'}
    },
    init(){

      const body = document.createElement('a-box');
      body.setAttribute('width',  0.24383999219712027);  // 0.8 ft
      body.setAttribute('height', 0.09143999707392009);  // 0.3 ft
      body.setAttribute('depth',  0.18287999414784017);  // 0.6 ft
      body.setAttribute(
        'material',
        `color:${this.data.bodyColor}; metalness:0.2; roughness:0.6`
      );
      this.el.appendChild(body);

      const pole = document.createElement('a-cylinder');
      pole.setAttribute('radius', 0.012191999609856013); // 0.04 ft
      pole.setAttribute('height', 0.12191999609856013); // 0.4 ft
      pole.setAttribute('position', `0 0.1066799965862401 0`); // 0.35 ft up from body center
      pole.setAttribute(
        'material',
        'color:#999; metalness:0.6; roughness:0.3'
      );
      this.el.appendChild(pole);

      const lens = document.createElement('a-cylinder');
      lens.setAttribute('radius', 0.02743199912217603); // 0.09 ft
      lens.setAttribute('height', 0.03657599882956804); // 0.12 ft
      lens.setAttribute('rotation', '0 90 0');
      lens.setAttribute('position', `0.13715999561088013 0 0`); // 0.45 ft forward
      lens.setAttribute(
        'material',
        `color:${this.data.lensColor}; emissive:${this.data.lensColor}; emissiveIntensity:0.8`
      );
      body.appendChild(lens);
    }
  });
})();
