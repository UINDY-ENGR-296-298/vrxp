// components/wall-text.js

AFRAME.registerComponent("text-wall", {
  schema: {
    value:     { type: "string", default: "Hello" },
    width:     { type: "number", default: 6 },
    height:    { type: "number", default: 3 },
    thickness: { type: "number", default: 0.15 },
    color:     { type: "string", default: "#e6e6e6" },
    textColor: { type: "string", default: "#111" },
    textWidth: { type: "number", default: 10 },
    align:     { type: "string", default: "center" },
    wrapCount: { type: "number", default: 24 },
    padding:   { type: "number", default: 0.25 },
    emissive:  { type: "number", default: 0.0 },

    font:      { type: "string", default: "/fonts/Roboto-msdf.json" },
    fontImage: { type: "string", default: "/fonts/Roboto-msdf.png" },
    shader:    { type: "string", default: "msdf" },

    // new
    dismissOnClick: { type: "boolean", default: true }
  },

  init: function () {
    const el = this.el;

    while (el.firstChild) el.removeChild(el.firstChild);

    // Make the whole component clickable (your cursor raycaster targets .clickable)
    el.classList.add("clickable");

    // Hide the entire entity when clicked
    this._onClick = () => {
      if (!this.data.dismissOnClick) return;
      el.setAttribute("visible", "false");
    };
    el.addEventListener("click", this._onClick);

    const wall = document.createElement("a-box");
    wall.setAttribute(
      "geometry",
      `primitive: box; width: ${this.data.width}; height: ${this.data.height}; depth: ${this.data.thickness}`
    );
    wall.setAttribute(
      "material",
      `color: ${this.data.color}; roughness: 1; metalness: 0; emissive: ${this.data.color}; emissiveIntensity: ${this.data.emissive}`
    );
    wall.setAttribute("position", `0 ${this.data.height / 2} 0`);
    wall.setAttribute("shadow", "cast: true; receive: true");
    el.appendChild(wall);

    this.textEl = document.createElement("a-entity");
    this.textEl.setAttribute(
      "position",
      `0 ${this.data.height / 2} ${(this.data.thickness / 2) + this.data.padding}`
    );

    this.textEl.setAttribute("text", {
      value: this.data.value,
      align: this.data.align,
      color: this.data.textColor,
      width: this.data.textWidth,
      wrapCount: this.data.wrapCount,
      shader: this.data.shader,
      font: this.data.font,
      fontImage: this.data.fontImage
    });

    el.appendChild(this.textEl);
  },

  update: function () {
    if (!this.textEl) return;

    this.textEl.setAttribute("text", "value", this.data.value);
    this.textEl.setAttribute("text", "color", this.data.textColor);
    this.textEl.setAttribute("text", "align", this.data.align);
    this.textEl.setAttribute("text", "width", this.data.textWidth);
    this.textEl.setAttribute("text", "wrapCount", this.data.wrapCount);

    this.textEl.setAttribute("text", "font", this.data.font);
    this.textEl.setAttribute("text", "fontImage", this.data.fontImage);
    this.textEl.setAttribute("text", "shader", this.data.shader);
  },

  remove: function () {
    if (this._onClick) {
      this.el.removeEventListener("click", this._onClick);
      this._onClick = null;
    }
  }
});
