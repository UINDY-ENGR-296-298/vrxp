AFRAME.registerComponent('scene-fade', {
  schema: {
    duration: {type: 'number', default: 800}  // ms, should match teleport fadetime if you want symmetry
  },

  init: function () {
    const duration = this.data.duration;

    let overlay = document.getElementById('screen-fade-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'screen-fade-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'black';
      overlay.style.opacity = '1';          // start fully black
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.style.transition = 'opacity ' + duration + 'ms ease';
      document.body.appendChild(overlay);
    } else {
      overlay.style.opacity = '1';
      overlay.style.transition = 'opacity ' + duration + 'ms ease';
    }

    // next frame, fade to transparent
    requestAnimationFrame(function () {
      overlay.style.opacity = '0';
    });

    // remove the overlay after fade completes
    setTimeout(function () {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, duration + 50);
  }
});
