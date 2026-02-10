// components/videoscreen.js
// All lengths are in meters

(function () {
  const FT = 0.3048; // same scale you use elsewhere

  AFRAME.registerComponent('tv-screen', {
    schema: {
      /* screen size, meters */
      width:   {type: 'number', default: 1.8},
      aspect:  {type: 'number', default: 1.7778},   // 16:9 by default, 0.5624 for vertical
      height:  {type: 'number', default: 0},        // if >0, use this height instead of width/aspect

      /* position, meters, relative to parent */
      x:       {type: 'number', default: 0},
      y:       {type: 'number', default: 0},
      zLift:   {type: 'number', default: 0.05},     // 5 cm in front of parent

      /* video material */
      shader:  {type: 'string', default: 'flat'},
      src:     {type: 'string', default: ''},       // CSS selector like #vid
      autoplay:{type: 'boolean', default: false},   // we start paused

      /* bezel, meters */
      bezel:      {type: 'boolean', default: true},
      bezelColor: {type: 'color',   default: '#000'},
      bezelPad:   {type: 'number',  default: 0.02},
      bezelDepth: {type: 'number',  default: 0.08}
    },

    init: function () {
      const el = this.el;
      const d  = this.data;
      const s  = d.units.toLowerCase() === 'ft' ? FT : 1.0;

      // compute screen height
      const w = d.width;
      const h = d.height > 0 ? d.height : (w / d.aspect);

      // 1) screen
      const screen = document.createElement('a-plane');
      screen.setAttribute('width',  w);
      screen.setAttribute('height', h);
      screen.setAttribute('material', {
        shader: d.shader,
        src: d.src || '',
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
      screen.setAttribute('position', `${d.x} ${d.y} ${d.zLift}`);
      screen.classList.add('clickable');
      el.appendChild(screen);
      this.screen = screen;

      // 2) bezel
      if (d.bezel) {
        const pad = d.bezelPad;
        const bezel = document.createElement('a-box');
        bezel.setAttribute('width',  w + 2 * pad);
        bezel.setAttribute('height', h + 2 * pad);
        bezel.setAttribute('depth',  d.bezelDepth);

        // place bezel clearly behind the screen to avoid z fighting
        const bezelZ = d.zLift - (d.bezelDepth / 2) - 0.02; // about 2 cm behind
        bezel.setAttribute('position', `${d.x} ${d.y} ${bezelZ}`);
        bezel.setAttribute('material', { color: d.bezelColor, shader: 'standard' });
        el.appendChild(bezel);
        this.bezel = bezel;
      }

      // 3) find the video element
      let videoEl = null;
      if (d.src) {
        const sel = d.src.replace(/^url\(/, '').replace(/\)$/, ''); // accept '#id' or 'url(#id)'
        const mediaEl = document.querySelector(sel);
        if (mediaEl && mediaEl.tagName === 'VIDEO') {
          videoEl = mediaEl;
        }
      }
      this.videoEl = videoEl;

      // 4) initial state: paused at time 0, muted to satisfy autoplay rules
      if (videoEl) {
        videoEl.muted = true;
        videoEl.pause();
        try {
          videoEl.currentTime = 0;
        } catch (e) {}
      }

      // helper functions
      const playWithAudio = () => {
        if (!videoEl) return;
        videoEl.muted = false;
        videoEl.volume = 1.0;
        videoEl.play().catch(() => {});
      };

      const pauseVideo = () => {
        if (!videoEl) return;
        videoEl.pause();
      };

      // clicking on the screen toggles play and pause
      if (videoEl) {
        screen.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (videoEl.paused || videoEl.ended) {
            playWithAudio();
          } else {
            pauseVideo();
          }
        });
      }
    },

    remove: function () {
      if (this.screen && this.screen.parentNode) {
        this.screen.parentNode.removeChild(this.screen);
      }
      if (this.bezel && this.bezel.parentNode) {
        this.bezel.parentNode.removeChild(this.bezel);
      }
    }
  });

})();
