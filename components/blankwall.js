// components/blankwall.js
(function () {
    const FT = 0.3048; // feet -> meters

    AFRAME.registerComponent('blank-wall', {
        schema: {
            widthFt:  {type: 'number', default: 6},    // ~6 ft wide
            heightFt: {type: 'number', default: 6},    // ~6 ft tall
            depthFt:  {type: 'number', default: 0.5},  // ~0.5 ft thick
            color:    {type: 'color',  default: '#FFFFFF'}
        },

        init: function () {
            // build once
            this.apply();
        },

        update: function () {
            // apply on any property change from HTML/JS
            this.apply();
        },

        apply: function () {
            const el = this.el;
            const d  = this.data;

            const width  = d.widthFt  * FT;
            const height = d.heightFt * FT;
            const depth  = d.depthFt  * FT;

            // Geometry + material (don’t set position/rotation here)
            el.setAttribute('geometry', {
                primitive: 'box',
                width, height, depth
            });

            el.setAttribute('material', {
                color: d.color,
                shader: 'standard'
            });
        }
    });
})();
