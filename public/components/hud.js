AFRAME.registerComponent("hud-coords", {
  schema: {
    target: { type: "selector", default: "#rig" },
    font: { type: "string", default: "/fonts/Roboto-msdf.json" },
    fontImage: { type: "string", default: "/fonts/Roboto-msdf.png" },
    shader: { type: "string", default: "msdf" },
    color: { type: "string", default: "#201d1d" },
    width: { type: "number", default: 2.5 },
    wrapCount: { type: "number", default: 48 },
    align: { type: "string", default: "left" }
  },

  init: function () {
    this.textEl = document.createElement("a-entity");

    this.textEl.setAttribute("text", {
      value: "X: 0.00  Y: 0.00  Z: 0.00",
      align: this.data.align,
      color: this.data.color,
      width: this.data.width,
      wrapCount: this.data.wrapCount,
      shader: this.data.shader,
      font: this.data.font,
      fontImage: this.data.fontImage
    });

    this.el.appendChild(this.textEl);

    this._hudFixed = false;

    this._fixHudMaterial = () => {
      // Try both common names
      const mesh =
        this.textEl.getObject3D("mesh") ||
        this.textEl.getObject3D("text");

      if (!mesh) return false;

      mesh.traverse((node) => {
        node.renderOrder = 9999;
        node.frustumCulled = false;

        const mats = node.material
          ? (Array.isArray(node.material) ? node.material : [node.material])
          : [];

        mats.forEach((m) => {
          m.depthTest = false;
          m.depthWrite = false;
          m.transparent = true;
          m.needsUpdate = true;
        });
      });

      return true;
    };

    // Keep trying until it sticks
    this._tryFix = () => {
      if (this._hudFixed) return;
      this._hudFixed = this._fixHudMaterial();
    };

    // These events often fire when text builds/rebuilds
    this.textEl.addEventListener("object3dset", this._tryFix);
    this.textEl.addEventListener("loaded", this._tryFix);
    this.textEl.addEventListener("componentchanged", (e) => {
      if (e.detail && e.detail.name === "text") {
        this._hudFixed = false; // text update can rebuild mesh
        this._tryFix();
      }
    });
  },

  tick: function () {
    const targetEl = this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    // keep trying in case mesh appears later
    this._tryFix();

    const p = targetEl.object3D.position;
    const msg = `X: ${p.x.toFixed(2)}  Y: ${p.y.toFixed(2)}  Z: ${p.z.toFixed(2)}`;
    this.textEl.setAttribute("text", "value", msg);
  }
});
