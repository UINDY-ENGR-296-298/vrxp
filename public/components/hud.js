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
    bgColor: { type: "string", default: "#808080" },
    bgOpacity: { type: "number", default: 0.6 },
    bgPadding: { type: "number", default: 0.15 },
    bgHeight: { type: "number", default: 0.40 }, // UPDATED: taller to fit 2 lines
    bgZ: { type: "number", default: -0.01 },
    bgWidthScale: { type: "number", default: 0.5 },
    bgXOffset: { type: "number", default: -0.15 },

    // ADDED: objective text style/placement
    objectiveColor: { type: "string", default: "#201d1d" },
    objectiveYOffset: { type: "number", default: -0.16 } // ADDED: objective below coords
  },

  init: function () {
    // ----------------------------
    // Background plane
    // ----------------------------
    this.bgEl = document.createElement("a-plane");
    this.bgEl.setAttribute("material", {
      color: this.data.bgColor,
      opacity: this.data.bgOpacity,
      transparent: true
    });

    const bgW = (this.data.width * this.data.bgWidthScale) + this.data.bgPadding;
    this.bgEl.setAttribute("width", bgW);
    this.bgEl.setAttribute("height", this.data.bgHeight);

    this.bgEl.setAttribute(
      "position",
      `${(bgW / 2) + this.data.bgXOffset} 0 ${this.data.bgZ}`
    );

    this.el.appendChild(this.bgEl);

    // ----------------------------
    // Coords text
    // ----------------------------
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

    // ----------------------------
    // Objective text (second line)
    // ----------------------------
    this.objectiveEl = document.createElement("a-entity"); // ADDED
    this.objectiveEl.setAttribute("position", `0 ${this.data.objectiveYOffset} 0`); // ADDED
    this.objectiveEl.setAttribute("text", { // ADDED
      value: "", // starts empty
      align: this.data.align,
      color: this.data.objectiveColor,
      width: this.data.width,
      wrapCount: this.data.wrapCount,
      shader: this.data.shader,
      font: this.data.font,
      fontImage: this.data.fontImage
    });
    this.el.appendChild(this.objectiveEl); // ADDED

    // ----------------------------
    // Objectives state
    // ----------------------------
    this.objectives = []; // ADDED
    this.objectiveIndex = 0; // ADDED

    // ----------------------------
    // Render on top of walls
    // ----------------------------
    this._hudFixed = false;

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

    this._fixHudMaterial = () => {
      const bgOk = this.bgEl ? this._applyTopLayer(this.bgEl, 9997) : true;
      const coordsOk = this._applyTopLayer(this.textEl, 9999);
      const objOk = this.objectiveEl ? this._applyTopLayer(this.objectiveEl, 9999) : true;
      return bgOk && coordsOk && objOk;
    };

    this._tryFix = () => {
      if (this._hudFixed) return;
      this._hudFixed = this._fixHudMaterial();
    };

    // Events when meshes build/rebuild
    [this.bgEl, this.textEl, this.objectiveEl].forEach((e) => {
      e.addEventListener("object3dset", this._tryFix);
      e.addEventListener("loaded", this._tryFix);
      e.addEventListener("componentchanged", (ev) => {
        if (ev.detail && ev.detail.name === "text") {
          this._hudFixed = false;
          this._tryFix();
        }
      });
    });

    // ----------------------------
    // Public API methods
    // ----------------------------
    this._renderObjective = () => { // ADDED
      const current = this.objectives[this.objectiveIndex];
      const text = current ? `Objective: ${current}` : "";
      this.objectiveEl.setAttribute("text", "value", text);
    };

    this.setObjective = (text) => { // ADDED
      this.objectives = [text];
      this.objectiveIndex = 0;
      this._renderObjective();
    };

    this.setObjectives = (list) => { // ADDED
      this.objectives = Array.isArray(list) ? list.slice() : [];
      this.objectiveIndex = 0;
      this._renderObjective();
    };

    this.completeObjective = () => { // ADDED
      if (this.objectiveIndex < this.objectives.length) {
        this.objectiveIndex += 1;
      }
      this._renderObjective();
    };

    // ----------------------------
    // Event hooks (trigger from anywhere)
    // ----------------------------
    this.el.addEventListener("hud-set-objective", (e) => { // ADDED
      const t = e.detail && e.detail.text ? String(e.detail.text) : "";
      if (t) this.setObjective(t);
    });

    this.el.addEventListener("hud-set-objectives", (e) => { // ADDED
      const list = e.detail && e.detail.list ? e.detail.list : [];
      this.setObjectives(list);
    });

    this.el.addEventListener("hud-complete-objective", () => { // ADDED
      this.completeObjective();
    });

    // Initial render
    this._renderObjective(); // ADDED
  },

  tick: function () {
    const targetEl = this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    this._tryFix();

    const p = targetEl.object3D.position;
    const msg = `X: ${p.x.toFixed(2)}  Y: ${p.y.toFixed(2)}  Z: ${p.z.toFixed(2)}`;
    this.textEl.setAttribute("text", "value", msg);
  }
});
