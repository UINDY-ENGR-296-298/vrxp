AFRAME.registerComponent("hud-coords", {
  schema: {
    target: { type: "selector", default: "#rig" },
    font: { type: "string", default: "fonts/Roboto-msdf.json" },
    fontImage: { type: "string", default: "fonts/Roboto-msdf.png" },
    shader: { type: "string", default: "msdf" },
    color: { type: "string", default: "#201d1d" },
    width: { type: "number", default: 2.5 },
    wrapCount: { type: "number", default: 48 },
    align: { type: "string", default: "left" },

    // objective
    objectiveColor: { type: "string", default: "#201d1d" },
    objectiveYOffset: { type: "number", default: -0.16 }
  },

  init: function () {
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
    this.objectiveEl = document.createElement("a-entity");
    this.objectiveEl.setAttribute("position", `0 ${this.data.objectiveYOffset} 0`);
    this.objectiveEl.setAttribute("text", {
      value: "",
      align: this.data.align,
      color: this.data.objectiveColor,
      width: this.data.width,
      wrapCount: this.data.wrapCount,
      shader: this.data.shader,
      font: this.data.font,
      fontImage: this.data.fontImage
    });
    this.el.appendChild(this.objectiveEl);

    // ----------------------------
    // Objectives state
    // ----------------------------
    this.objectives = [];
    this.objectiveIndex = 0;

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
          if (window.THREE) m.side = THREE.DoubleSide;
          m.needsUpdate = true;
        });
      });

      return true;
    };

    this._fixHudMaterial = () => {
      const coordsOk = this._applyTopLayer(this.textEl, 9999);
      const objOk = this._applyTopLayer(this.objectiveEl, 9999);
      return coordsOk && objOk;
    };

    this._tryFix = () => {
      if (this._hudFixed) return;
      this._hudFixed = this._fixHudMaterial();
    };

    // Re-apply top-layer when meshes rebuild
    [this.textEl, this.objectiveEl].forEach((ent) => {
      ent.addEventListener("object3dset", () => {
        this._hudFixed = false;
        this._tryFix();
      });

      ent.addEventListener("loaded", () => {
        this._hudFixed = false;
        this._tryFix();
      });

      ent.addEventListener("componentchanged", (ev) => {
        if (ev.detail && ev.detail.name === "text") {
          this._hudFixed = false;
          this._tryFix();
        }
      });
    });

    // ----------------------------
    // Objective rendering and API
    // ----------------------------
    this._renderObjective = () => {
      const current = this.objectives[this.objectiveIndex];
      const text = current ? `Objective: ${current}` : "";
      this.objectiveEl.setAttribute("text", "value", text);
    };

    this.setObjective = (text) => {
      this.objectives = [text];
      this.objectiveIndex = 0;
      this._renderObjective();
    };

    // NEW: supports restoring objectiveIndex from cookie
    this.setObjectives = (list, startIndex = 0) => {
      this.objectives = Array.isArray(list) ? list.slice() : [];
      const maxIndex = Math.max(0, this.objectives.length - 1);
      this.objectiveIndex = Math.min(Math.max(0, startIndex), maxIndex);
      this._renderObjective();
    };

    this.completeObjective = () => {
      const maxIndex = Math.max(0, this.objectives.length - 1);
      this.objectiveIndex = Math.min(this.objectiveIndex + 1, maxIndex);
      this._renderObjective();
    };

    // ----------------------------
    // Event hooks
    // ----------------------------
    this.el.addEventListener("hud-set-objective", (e) => {
      const t = e.detail && e.detail.text ? String(e.detail.text) : "";
      if (t) this.setObjective(t);
    });

    // KEEP ONLY ONE handler for hud-set-objectives, supports { list, current }
    this.el.addEventListener("hud-set-objectives", (e) => {
      const list = e.detail && e.detail.list ? e.detail.list : [];
      const current = e.detail && typeof e.detail.current === "number" ? e.detail.current : 0;
      this.setObjectives(list, current);
    });

    this.el.addEventListener("hud-complete-objective", () => {
      this.completeObjective();
    });

    // Initial render
    this._renderObjective();
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