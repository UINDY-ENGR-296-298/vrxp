// Prevent the entity from entering any .blocker AABB.
    // Assumes the entity is moved by setting object3D.position (WASD/teleport/etc).
    AFRAME.registerComponent('prevent-aabb-penetration', {
      schema: {
        blockers: { type: 'string', default: '.blocker' },
        radius:   { type: 'number', default: 0.35 },  // player "capsule" approximation
        height:   { type: 'number', default: 1.6 },   // not used heavily; mostly horizontal block
        step:     { type: 'number', default: 0.0 }    // optional vertical forgiveness
      },

      init() {
        this.prevPos = new THREE.Vector3();
        this.currPos = new THREE.Vector3();
        this.delta   = new THREE.Vector3();

        this.playerBox = new THREE.Box3();
        this.blockBox  = new THREE.Box3();

        // cache blocker elements list (refresh if you dynamically add/remove blockers)
        this.refreshBlockers();
      },

      refreshBlockers() {
        this.blockers = Array.from(this.el.sceneEl.querySelectorAll(this.data.blockers));
      },

      tick() {
        const obj = this.el.object3D;

        // Initialize previous position on first tick.
        if (!this._inited) {
          this.prevPos.copy(obj.position);
          this._inited = true;
          return;
        }

        this.currPos.copy(obj.position);
        this.delta.subVectors(this.currPos, this.prevPos);

        // If no movement, nothing to do.
        if (this.delta.lengthSq() < 1e-10) return;

        // Build player's AABB (simple cylinder-ish approximation using radius on XZ).
        // We'll treat player as a box on XZ with padding = radius.
        const r = this.data.radius;

        // Player AABB at current position
        this.playerBox.min.set(this.currPos.x - r, this.currPos.y,     this.currPos.z - r);
        this.playerBox.max.set(this.currPos.x + r, this.currPos.y + 2, this.currPos.z + r);

        // Check against each blocker; if intersect, resolve by backing out along axes.
        for (const b of this.blockers) {
          if (!b.components.blocker || !b.components.blocker.data.enabled) continue;

          // Ensure world matrices are up to date
          b.object3D.updateWorldMatrix(true, false);

          // AABB of blocker in world space
          this.blockBox.setFromObject(b.object3D);

          if (!this.playerBox.intersectsBox(this.blockBox)) continue;

          // Resolve: try separating along X first, then Z (or vice versa).
          // Use previous position as a safe fallback.
          const testPos = this.currPos.clone();

          // Try revert X only
          testPos.x = this.prevPos.x;
          this.playerBox.min.set(testPos.x - r, this.currPos.y,     testPos.z - r);
          this.playerBox.max.set(testPos.x + r, this.currPos.y + 2, testPos.z + r);

          const xOk = !this.playerBox.intersectsBox(this.blockBox);

          // Try revert Z only
          const testPosZ = this.currPos.clone();
          testPosZ.z = this.prevPos.z;
          this.playerBox.min.set(testPosZ.x - r, this.currPos.y,     testPosZ.z - r);
          this.playerBox.max.set(testPosZ.x + r, this.currPos.y + 2, testPosZ.z + r);

          const zOk = !this.playerBox.intersectsBox(this.blockBox);

          if (xOk && !zOk) {
            obj.position.x = this.prevPos.x;
          } else if (!xOk && zOk) {
            obj.position.z = this.prevPos.z;
          } else if (xOk && zOk) {
            // Both axes work; choose the one with smaller correction (more natural slide)
            const dx = Math.abs(this.currPos.x - this.prevPos.x);
            const dz = Math.abs(this.currPos.z - this.prevPos.z);
            if (dx < dz) obj.position.x = this.prevPos.x;
            else obj.position.z = this.prevPos.z;
          } else {
            // Neither axis alone resolves -> fully revert to previous safe position.
            obj.position.copy(this.prevPos);
          }

          // Update current after resolution so multiple blockers behave
          this.currPos.copy(obj.position);
          this.playerBox.min.set(this.currPos.x - r, this.currPos.y,     this.currPos.z - r);
          this.playerBox.max.set(this.currPos.x + r, this.currPos.y + 2, this.currPos.z + r);
        }

        // Save for next tick
        this.prevPos.copy(obj.position);
      }
    });
