// Mark volumes that should block player movement (AABB boxes).
AFRAME.registerComponent('blocker', {
  schema: {
    enabled: { type: 'boolean', default: true }
  }
});

    