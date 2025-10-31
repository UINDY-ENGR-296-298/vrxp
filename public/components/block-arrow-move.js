AFRAME.registerComponent('block-arrow-move', {
  init() {
    this.onKeyDown = e => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
          e.code === 'ArrowUp'   || e.code === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
    };
    // capture true, so we intercept before other handlers
    window.addEventListener('keydown', this.onKeyDown, {capture: true});
  },
  remove() {
    window.removeEventListener('keydown', this.onKeyDown, {capture: true});
  }
});