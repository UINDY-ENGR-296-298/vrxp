/* global AFRAME */
/**
 * Parametric Chair Component for A-Frame
 * Usage: <a-entity chair="width:0.6; depth:0.6; height:0.9; color:#795548;"></a-entity>
 */
AFRAME.registerComponent('chair', {
    schema: {
        // Transform (you can also use native position/rotation/scale on the entity)
        position:   {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        rotation:   {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        scale:      {type: 'vec3', default: {x: 1, y: 1, z: 1}},

        // Core dimensions (meters)
        width:         {type: 'number', default: 0.55}, // seat left ↔ right
        depth:         {type: 'number', default: 0.55}, // seat front ↔ back
        seatHeight:    {type: 'number', default: 0.46}, // floor → seat top
        seatThickness: {type: 'number', default: 0.04},
        backHeight:    {type: 'number', default: 0.9},  // floor → back top
        backThickness: {type: 'number', default: 0.03},
        legThickness:  {type: 'number', default: 0.04}, // square legs
        legInset:      {type: 'number', default: 0.03}, // how far legs are inset from seat edge

        // Arms
        hasArms:       {type: 'boolean', default: false},
        armHeight:     {type: 'number', default: 0.65}, // floor → arm top
        armThickness:  {type: 'number', default: 0.03},
        armOffsetZ:    {type: 'number', default: 0.05}, // how far arms sit back from seat front

        // Materials
        color:         {type: 'color',  default: '#8d6e63'}, // seat/back color
        legColor:      {type: 'color',  default: '#5d4037'},
        metalness:     {type: 'number', default: 0.2},
        roughness:     {type: 'number', default: 0.8}
    },

    init() {
        this.parts = {};
        this._build();
        this._applyTransforms();
    },

    update(oldData) {
        // If any dimension/material changed, rebuild materials+geometry sizes.
        if (!oldData) return;
        const needsRebuild =
            oldData.width !== this.data.width ||
            oldData.depth !== this.data.depth ||
            oldData.seatHeight !== this.data.seatHeight ||
            oldData.seatThickness !== this.data.seatThickness ||
            oldData.backHeight !== this.data.backHeight ||
            oldData.backThickness !== this.data.backThickness ||
            oldData.legThickness !== this.data.legThickness ||
            oldData.legInset !== this.data.legInset ||
            oldData.hasArms !== this.data.hasArms ||
            oldData.armHeight !== this.data.armHeight ||
            oldData.armThickness !== this.data.armThickness ||
            oldData.armOffsetZ !== this.data.armOffsetZ;

        if (needsRebuild) {
            this._clear();
            this._build();
        }

        // Always refresh materials & transforms (color, metalness, roughness, position/rotation/scale)
        this._applyMaterials();
        this._applyTransforms();
    },

    remove() {
        this._clear();
    },

    // ----- helpers -----
    _clear() {
        const el = this.el;
        Object.values(this.parts).forEach(p => {
            if (p && p.parentNode === el) el.removeChild(p);
        });
        this.parts = {};
    },

    _createBox(name, size, pos, rotDeg, material) {
        const el = document.createElement('a-entity');
        el.setAttribute('geometry', {
            primitive: 'box',
            width: size.x,
            height: size.y,
            depth: size.z
        });
        el.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
        el.setAttribute('rotation', `${rotDeg.x} ${rotDeg.y} ${rotDeg.z}`);
        el.setAttribute('material', material);
        this.el.appendChild(el);
        this.parts[name] = el;
        return el;
    },

    _applyMaterials() {
        const {color, legColor, metalness, roughness} = this.data;
        const matWood = {color, metalness, roughness};
        const matLegs = {color: legColor, metalness, roughness};

        // wood parts
        ['seat', 'back', 'armL', 'armR'].forEach(k => {
            if (this.parts[k]) this.parts[k].setAttribute('material', matWood);
        });
        // legs
        ['legFL','legFR','legBL','legBR'].forEach(k => {
            if (this.parts[k]) this.parts[k].setAttribute('material', matLegs);
        });
    },

    _applyTransforms() {
        const {position, rotation, scale} = this.data;
        this.el.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        this.el.setAttribute('rotation', `${rotation.x} ${rotation.y} ${rotation.z}`);
        this.el.setAttribute('scale',    `${scale.x} ${scale.y} ${scale.z}`);
    },

    _build() {
        const d = this.data;

        // Clamp/guard a few values
        const width  = Math.max(0.2, d.width);
        const depth  = Math.max(0.2, d.depth);
        const seatH  = Math.max(0.2, d.seatHeight);
        const seatT  = Math.max(0.02, d.seatThickness);
        const backH  = Math.max(seatH + 0.1, d.backHeight);
        const backT  = Math.max(0.02, d.backThickness);
        const legT   = Math.max(0.02, d.legThickness);
        const inset  = Math.min(Math.max(0, d.legInset), Math.min(width, depth) * 0.25);

        const matWood = {color: d.color, metalness: d.metalness, roughness: d.roughness};
        const matLegs = {color: d.legColor, metalness: d.metalness, roughness: d.roughness};

        // Seat (centered)
        this._createBox(
            'seat',
            {x: width, y: seatT, z: depth},
            {x: 0, y: seatH - seatT/2, z: 0},
            {x: 0, y: 0, z: 0},
            matWood
        );

        // Backrest (sits at back edge, extends up)
        this._createBox(
            'back',
            {x: width, y: (backH - seatH), z: backT},
            {x: 0, y: seatH + (backH - seatH)/2, z: -depth/2 + backT/2},
            {x: 0, y: 0, z: 0},
            matWood
        );

        // Legs: front-left (FL), front-right (FR), back-left (BL), back-right (BR)
        const legY = (seatH - seatT) / 2; // center of legs
        const lx = width/2 - inset - legT/2;
        const lz = depth/2 - inset - legT/2;

        this._createBox('legFL', {x: legT, y: (seatH - seatT), z: legT}, {x: -lx, y: legY, z:  lz}, {x:0,y:0,z:0}, matLegs);
        this._createBox('legFR', {x: legT, y: (seatH - seatT), z: legT}, {x:  lx, y: legY, z:  lz}, {x:0,y:0,z:0}, matLegs);
        this._createBox('legBL', {x: legT, y: (seatH - seatT), z: legT}, {x: -lx, y: legY, z: -lz}, {x:0,y:0,z:0}, matLegs);
        this._createBox('legBR', {x: legT, y: (seatH - seatT), z: legT}, {x:  lx, y: legY, z: -lz}, {x:0,y:0,z:0}, matLegs);

        // Optional armrests
        if (d.hasArms) {
            const armY = d.armHeight - d.armThickness/2;
            const armZ = Math.min(depth/2 - d.armThickness/2, depth/2 - d.armOffsetZ);
            this._createBox(
                'armL',
                {x: width/2 - inset, y: d.armThickness, z: d.armThickness},
                {x: -(width/4), y: armY, z: armZ},
                {x: 0, y: 0, z: 0},
                matWood
            );
            this._createBox(
                'armR',
                {x: width/2 - inset, y: d.armThickness, z: d.armThickness},
                {x:  (width/4), y: armY, z: armZ},
                {x: 0, y: 0, z: 0},
                matWood
            );
        }

        this._applyMaterials();
    }
});
