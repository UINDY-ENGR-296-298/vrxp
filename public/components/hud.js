AFRAME.registerComponent("hud-coords", {
  schema: {
    target: { type: "selector", default: "#rig" },
    font: { type: "string", default: "/fonts/Roboto-msdf.json" },
    fontImage: { type: "string", default: "/fonts/Roboto-msdf.png" },
    shader: { type: "string", default: "msdf" },
    color: { type: "string", default: "#201d1d" },
    width: { type: "number", default: 2.5 },
    wrapCount: { type: "number", default: 48 },
    align: { type: "string", default: "left" },

    // background box settings for readability
    bgColor: { type: "string", default: "#76b3d7" },
    bgOpacity: { type: "number", default: 0.6 },
    bgPadding: { type: "number", default: 0.15 },
    bgHeight: { type: "number", default: 0.25 },
    bgZ: { type: "number", default: -0.01 },
    bgWidthScale: { type: "number", default: 0.5 },

    // ADDED: shift background left/right (negative = left)
    bgXOffset: { type: "number", default: -1.4 } // ADDED
  },

  init: function () {
    // create a translucent background plane behind the text
    this.bgEl = document.createElement("a-plane");
    this.bgEl.setAttribute("material", {
      color: this.data.bgColor,
      opacity: this.data.bgOpacity,
      transparent: true
    });

    // size the background based on text width plus padding
    const bgW = (this.data.width * this.data.bgWidthScale) + this.data.bgPadding;
    this.bgEl.setAttribute("width", bgW);
    this.bgEl.setAttribute("height", this.data.bgHeight);

    // UPDATED: align background with left aligned text, then shift it left using bgXOffset
    this.bgEl.setAttribute(
      "position",
      `${(bgW / 2) + this.data.bgXOffset} 0 ${this.data.bgZ}`
    );

    // append background first so text is placed in front of it
    this.el.appendChild(this.bgEl);

    // create the text entity
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

    // helper to force an entity to render on top (not occluded by walls)
    this._applyTopLayer = (entity, order) => {
      const mesh = entity.getObject3D("mesh") || entity.getObject3D("text");
      if (!mesh) return false;

      mesh.traverse((node) => {
        node.renderOrder = order;
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

    // apply top-layer rendering to BOTH the background and the text
    this._fixHudMaterial = () => {
      const bgOk = this.bgEl ? this._applyTopLayer(this.bgEl, 9998) : true;
      const textOk = this._applyTopLayer(this.textEl, 9999);
      return bgOk && textOk;
    };

    // keep trying until it sticks
    this._tryFix = () => {
      if (this._hudFixed) return;
      this._hudFixed = this._fixHudMaterial();
    };

    // these events often fire when text builds/rebuilds
    this.textEl.addEventListener("object3dset", this._tryFix);
    this.textEl.addEventListener("loaded", this._tryFix);
    this.textEl.addEventListener("componentchanged", (e) => {
      if (e.detail && e.detail.name === "text") {
        this._hudFixed = false; // text update can rebuild mesh
        this._tryFix();
      }
    });

    // background mesh is created too, fix it when it loads
    this.bgEl.addEventListener("object3dset", this._tryFix);
    this.bgEl.addEventListener("loaded", this._tryFix);
  },

  tick: function () {
    const targetEl = this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    // keep trying in case meshes appear later
    this._tryFix();

    const p = targetEl.object3D.position;
    const msg = `X: ${p.x.toFixed(2)}  Y: ${p.y.toFixed(2)}  Z: ${p.z.toFixed(2)}`;
    this.textEl.setAttribute("text", "value", msg);
  }
});
