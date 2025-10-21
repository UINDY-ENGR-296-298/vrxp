// components/videoscreen.js
(function () {
  const FT = 0.3048; // same scale you use elsewhere

  AFRAME.registerComponent('tv-screen', {
    schema: {
      // size in chosen units
      width:   {type: 'number', default: 3},    // visible screen width
      aspect:  {type: 'number', default: 16/9}, // width:height
      units:   {type: 'string', default: 'ft'}, // 'ft' or 'm'

      // mounting on parent
      // tv-screen must be on a parent wall entity whose local +Z faces the room
      zLift:   {type: 'number', default: 0.05}, // push slightly forward to avoid z-fighting
      x:       {type: 'number', default: 0},    // local offset on the parent
      y:       {type: 'number', default: 0},    // local offset on the parent

      // media
      src:       {type: 'selector'},            // e.g. <video id="tourVid"> or <img id="poster">
      shader:    {type: 'string', default: 'flat'},
      autoplay:  {type: 'boolean', default: true}, // for <video>
      loop:      {type: 'boolean', default: true},
      muted:     {type: 'boolean', default: true},
      playsinline:{type: 'boolean', default: true},

      // simple bezel
      bezel:     {type: 'boolean', default: true},
      bezelDepth:{type: 'number', default: 0.03},   // extra forward depth
      bezelPad:  {type: 'number', default: 0.12},   // frame thickness around screen (in same units)
      bezelColor:{type: 'color',  default: '#111111'}
    },

    init () {
      const el = this.el;
      const d  = this.data;
      const s  = d.units.toLowerCase() === 'ft' ? FT : 1.0;

      // compute sizes
      const w = d.width * s;
      const h = (d.width / d.aspect) * s;

      // screen plane
      this.screen = document.createElement('a-plane');
      this.screen.setAttribute('width',  w);
      this.screen.setAttribute('height', h);
      this.screen.setAttribute('material', {shader: d.shader, src: d.src || ''});

      // position it a little in front of parent so it does not flicker
      const z = (d.zLift) * (d.units.toLowerCase()==='ft' ? FT : 1.0);
      this.screen.setAttribute('position', `${d.x * s} ${d.y * s} ${z}`);

      el.appendChild(this.screen);

      // optional bezel as a thin box behind the plane
      if (d.bezel) {
        this.bezel = document.createElement('a-box');
        const pad = d.bezelPad * s;
        this.bezel.setAttribute('width',  w + 2 * pad);
        this.bezel.setAttribute('height', h + 2 * pad);
        this.bezel.setAttribute('depth',  d.bezelDepth * s);
        // put bezel slightly behind the screen so the plane is visible
        this.bezel.setAttribute('position', `${d.x * s} ${d.y * s} ${z - (d.bezelDepth * s) / 2}`);
        this.bezel.setAttribute('material', {color: d.bezelColor, shader: 'standard'});
        el.appendChild(this.bezel);
      }

      // if the src is a <video>, honor autoplay settings
      const mediaEl = d.src;
      if (mediaEl && mediaEl.tagName && mediaEl.tagName.toLowerCase() === 'video') {
        if (d.muted)       mediaEl.muted = true;
        if (d.playsinline) mediaEl.setAttribute('playsinline', '');
        if (d.loop)        mediaEl.loop = true;
        if (d.autoplay) {
          // mobile often needs a user gesture. try, then also play on first click anywhere on parent.
          mediaEl.play().catch(()=>{});
          const playOnce = () => { mediaEl.play().catch(()=>{}); el.removeEventListener('click', playOnce); };
          el.addEventListener('click', playOnce);
        }
      }
    },

    remove () {
      if (this.screen && this.screen.parentNode) this.screen.parentNode.removeChild(this.screen);
      if (this.bezel  && this.bezel.parentNode)  this.bezel.parentNode.removeChild(this.bezel);
    }
  });
})();