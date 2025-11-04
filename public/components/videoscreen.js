// components/videoscreen.js
// All lengths are in meters

(function () {

  AFRAME.registerComponent('tv-screen', {
    schema: {
      /* screen size, meters */
      /* 
        1.7778 aspect ratio for horizontal video
        0.5625 aspect ratio for vertical video
      */
      width:   {type: 'number', default: 1.8},
      aspect:  {type: 'number', default: 1.7778},   // 16:9 by default
      height:  {type: 'number', default: 0},        // if >0, use this height instead of width/aspect

      /* position, meters, relative to parent */
      x:       {type: 'number', default: 0},
      y:       {type: 'number', default: 0},
      zLift:   {type: 'number', default: 0.03},     // 3 cm in front of parent

      /* video material */
      shader:  {type: 'string', default: 'flat'},
      src:     {type: 'string', default: ''},       // CSS selector like #vid
      autoplay:{type: 'boolean', default: true},    // try to start muted

      /* bezel, meters */
      bezel:      {type: 'boolean', default: true},
      bezelColor: {type: 'color',   default: '#000'},
      bezelPad:   {type: 'number',  default: 0.02},
      bezelDepth: {type: 'number',  default: 0.08},

      /* controls, meters */
      controls:       {type: 'boolean', default: true},
      controlsOffset: {type: 'number',  default: 0.06},
      btnWidth:       {type: 'number',  default: 0.14},
      btnHeight:      {type: 'number',  default: 0.055}
    },

    init () {
      const el = this.el;
      const d  = this.data;

      // compute screen height
      const w = d.width;
      const h = d.height > 0 ? d.height : (w / d.aspect);

      // 1) screen, front most
      const screen = document.createElement('a-plane');
      screen.setAttribute('width',  w);
      screen.setAttribute('height', h);
      screen.setAttribute('material', { shader: d.shader, src: d.src || '' });
      screen.setAttribute('position', `${d.x} ${d.y} ${d.zLift}`);
      el.appendChild(screen);
      this.screen = screen;

      // 2) bezel, clearly behind
      if (d.bezel) {
        const pad = d.bezelPad;
        const bezel = document.createElement('a-box');
        bezel.setAttribute('width',  w + 2 * pad);
        bezel.setAttribute('height', h + 2 * pad);
        bezel.setAttribute('depth',  d.bezelDepth);
        const bezelZ = d.zLift - (d.bezelDepth / 2) - 0.001;  // extra 1 mm to avoid z-fighting
        bezel.setAttribute('position', `${d.x} ${d.y} ${bezelZ}`);
        bezel.setAttribute('material', { color: d.bezelColor, shader: 'standard' });
        el.appendChild(bezel);
        this.bezel = bezel;
      }

      // 3) find the video element
      let videoEl = null;
      if (d.src) {
        const sel = d.src.replace(/^url\(/,'').replace(/\)$/,''); // accept '#id' or 'url(#id)'
        const mediaEl = document.querySelector(sel);
        if (mediaEl && mediaEl.tagName === 'VIDEO') videoEl = mediaEl;
      }
      this.videoEl = videoEl;

      // 4) best-effort muted autoplay, then rely on user clicks for sound
      if (videoEl && d.autoplay) {
        // try to start silently, harmless if blocked
        videoEl.muted = true;
        videoEl.play().catch(()=>{});
      }

      // 5) controls, in front of screen, bound to THIS video only
      if (videoEl && d.controls) {
        const frontZ = d.zLift + 0.002;  // 2 mm in front of the screen
        const y = d.y - h/2 - d.controlsOffset;
        const bw = d.btnWidth;
        const bh = d.btnHeight;

        // PLAY, left
        const playBtn = document.createElement('a-plane');
        playBtn.setAttribute('width',  bw);
        playBtn.setAttribute('height', bh);
        playBtn.setAttribute('color', '#1dd1a1');
        playBtn.setAttribute('position', `${d.x - bw * 0.65} ${y} ${frontZ}`);
        playBtn.setAttribute('text', {value: 'PLAY', align: 'center', width: 2});
        playBtn.classList.add('clickable');
        el.appendChild(playBtn);

        // PAUSE, right
        const pauseBtn = document.createElement('a-plane');
        pauseBtn.setAttribute('width',  bw);
        pauseBtn.setAttribute('height', bh);
        pauseBtn.setAttribute('color', '#ff6b6b');
        pauseBtn.setAttribute('position', `${d.x + bw * 0.65} ${y} ${frontZ}`);
        pauseBtn.setAttribute('text', {value: 'PAUSE', align: 'center', width: 2});
        pauseBtn.classList.add('clickable');
        el.appendChild(pauseBtn);

        // handlers, guarantee audio on user gesture
        const startWithAudio = () => {
          videoEl.muted = false;
          videoEl.volume = 1.0;
          videoEl.play().catch(()=>{});
        };

        playBtn.addEventListener('click', ev => {
          ev.stopPropagation();
          startWithAudio();
        });

        pauseBtn.addEventListener('click', ev => {
          ev.stopPropagation();
          videoEl.pause();
        });

        this.playBtn = playBtn;
        this.pauseBtn = pauseBtn;
      }
    },

    remove () {
      if (this.screen && this.screen.parentNode) this.screen.parentNode.removeChild(this.screen);
      if (this.bezel  && this.bezel.parentNode)  this.bezel.parentNode.removeChild(this.bezel);
      if (this.playBtn && this.playBtn.parentNode) this.playBtn.parentNode.removeChild(this.playBtn);
      if (this.pauseBtn && this.pauseBtn.parentNode) this.pauseBtn.parentNode.removeChild(this.pauseBtn);
    }
  });

})();
