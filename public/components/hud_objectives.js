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
    bgZ: { type: "number", default: -0.01 },

    // ADDED: automatic background padding (in world units of the HUD)
    bgPadX: { type: "number", default: 0.08 }, // ADDED
    bgPadY: { type: "number", default: 0.05 }, // ADDED

    // objective placement and color
    objectiveColor: { type: "string", default: "#201d1d" },
    objectiveYOffset: { type: "number", default: -0.16 }
  },

  init: function () {
    // ----------------------------
    // Background plane (auto sized later)
    // ----------------------------
    this.bgEl = document.createElement("a-plane");
    this.bgEl.setAttribute("material", {
      color: this.data.bgColor,
      opacity: this.data.bgOpacity,
      transparent: true
    });
    // Temporary size, will be replaced by auto-fit
    this.bgEl.setAttribute("width", 0.5);
    this.bgEl.setAttribute("height", 0.25);
    this.bgEl.setAttribute("position", `0 0 ${this.data.bgZ}`);
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

    // ----------------------------
    // ADDED: auto-fit background to text bounds
    // ----------------------------
    this._fitBackgroundToText = () => {
      if (!this.bgEl || !this.textEl || !this.objectiveEl) return;
      if (!window.THREE) return;

      const mesh1 = this.textEl.getObject3D("mesh") || this.textEl.getObject3D("text");
      const mesh2 = this.objectiveEl.getObject3D("mesh") || this.objectiveEl.getObject3D("text");
      if (!mesh1 || !mesh2) return;

      const b1 = new THREE.Box3().setFromObject(mesh1);
      const b2 = new THREE.Box3().setFromObject(mesh2);
      const b = b1.union(b2);

      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      b.getSize(size);
      b.getCenter(center);

      const w = size.x + this.data.bgPadX * 2;
      const h = size.y + this.data.bgPadY * 2;

      // Guard against weird zero sizes during early load
      if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return;

      this.bgEl.setAttribute("width", w);
      this.bgEl.setAttribute("height", h);
      this.bgEl.setAttribute("position", `${center.x} ${center.y} ${this.data.bgZ}`);
    };

    this._requestFit = () => {
      requestAnimationFrame(() => {
        this._fitBackgroundToText();
      });
    };

    // ----------------------------
    // Events when meshes build or rebuild
    // ----------------------------
    [this.bgEl, this.textEl, this.objectiveEl].forEach((ent) => {
      ent.addEventListener("object3dset", () => {
        this._hudFixed = false;
        this._tryFix();
        this._requestFit();
      });

      ent.addEventListener("loaded", () => {
        this._hudFixed = false;
        this._tryFix();
        this._requestFit();
      });

      ent.addEventListener("componentchanged", (ev) => {
        if (ev.detail && ev.detail.name === "text") {
          this._hudFixed = false;
          this._tryFix();
          this._requestFit();
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
      this._requestFit(); // ADDED: refit background when objective changes
    };

    this.setObjective = (text) => {
      this.objectives = [text];
      this.objectiveIndex = 0;
      this._renderObjective();
    };

    this.setObjectives = (list) => {
      this.objectives = Array.isArray(list) ? list.slice() : [];
      this.objectiveIndex = 0;
      this._renderObjective();
    };

    this.completeObjective = () => {
      if (this.objectiveIndex < this.objectives.length) {
        this.objectiveIndex += 1;
      }
      this._renderObjective();
    };

    // Event hooks
    this.el.addEventListener("hud-set-objective", (e) => {
      const t = e.detail && e.detail.text ? String(e.detail.text) : "";
      if (t) this.setObjective(t);
    });

    this.el.addEventListener("hud-set-objectives", (e) => {
      const list = e.detail && e.detail.list ? e.detail.list : [];
      this.setObjectives(list);
    });

    this.el.addEventListener("hud-complete-objective", () => {
      this.completeObjective();
    });

    // Initial objective render and background fit
    this._renderObjective();
    this._requestFit();

    // Track last coords so we only refit if the coords string changes length
    this._lastCoords = "";
  },

  tick: function () {
    const targetEl = this.data.target;
    if (!targetEl || !targetEl.object3D) return;

    this._tryFix();

    const p = targetEl.object3D.position;
    const msg = `X: ${p.x.toFixed(2)}  Y: ${p.y.toFixed(2)}  Z: ${p.z.toFixed(2)}`;
    this.textEl.setAttribute("text", "value", msg);

    // ADDED: if coords text changes (rare, but possible), refit background
    if (msg !== this._lastCoords) {
      this._lastCoords = msg;
      this._requestFit();
    }
  }
});
