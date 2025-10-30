// components/videoscreen.js
(function () {

  AFRAME.registerComponent('tv-screen', {
    schema: {
      // size in meters now
      width:   {type: 'number', default: 0.914399970739201}, // 3 ft
      aspect:  {type: 'number', default: 16/9},              // width:height

      // mounting offsets (meters)
      zLift:   {type: 'number', default: 0.015239999512320017}, // 0.05 ft forward
      x:       {type: 'number', default: 0},
      y:       {type: 'number', default: 0},

      // visual/media
      shader:     {type: 'string', default: 'flat'},
      src:        {type: 'string', default: ''},
      autoplay:   {type: 'boolean', default: true},
      bezel:      {type: 'boolean', default: true},
      bezelColor: {type: 'color',   default: '#000'},
      bezelPad:   {type: 'number',  default: 0.015239999512320017}, // 0.05 ft
      bezelDepth: {type: 'number',  default: 0.06095999804928007}   // 0.2 ft
    },

    init () {
      const el = this.el;
      const d  = this.data;

      // compute sizes in meters
      const w = d.width;
      const h = (d.width / d.aspect);

      // screen plane
      this.screen = document.createElement('a-plane');
      this.screen.setAttribute('width',  w);
      this.screen.setAttribute('height', h);
      this.screen.setAttribute('material', {shader: d.shader, src: d.src || ''});

      // small forward offset to avoid z-fighting
      const z = d.zLift;
      this.screen.setAttribute('position', `${d.x} ${d.y} ${z}`);

      el.appendChild(this.screen);

      // optional bezel
      if (d.bezel) {
        this.bezel = document.createElement('a-box');
        const pad = d.bezelPad;
        this.bezel.setAttribute('width',  w + 2 * pad);
        this.bezel.setAttribute('height', h + 2 * pad);
        this.bezel.setAttribute('depth',  d.bezelDepth);
        // bezel sits slightly behind
        this.bezel.setAttribute(
          'position',
          `${d.x} ${d.y} ${z - (d.bezelDepth / 2)}`
        );
        this.bezel.setAttribute(
          'material',
          {color: d.bezelColor, shader: 'standard'}
        );
        el.appendChild(this.bezel);
      }

      // autoplay helper if src is <video> / <video#id>
      if (d.src && d.autoplay) {
        const mediaSel = d.src.replace(/^url\(/,'').replace(/\)$/,'');
        const mediaEl = document.querySelector(mediaSel);
        if (mediaEl && mediaEl.tagName === 'VIDEO') {
          if (d.autoplay) {
            mediaEl.play().catch(()=>{});
            const playOnce = () => {
              mediaEl.play().catch(()=>{});
              el.removeEventListener('click', playOnce);
            };
            el.addEventListener('click', playOnce);
          }
        }
      }
    },

    remove () {
      if (this.screen && this.screen.parentNode) this.screen.parentNode.removeChild(this.screen);
      if (this.bezel  && this.bezel.parentNode)  this.bezel.parentNode.removeChild(this.bezel);
    }
  });
})();
