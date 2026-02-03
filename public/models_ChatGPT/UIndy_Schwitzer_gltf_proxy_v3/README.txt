UIndy Schwitzer Student Center - proxy v3 (glTF 2.0)

Files:
- schwitzer_v3.gltf
- schwitzer_v3.bin

Notes:
- Units are meters.
- Model is centered near origin (0,0,0) with ground at Y=0.
- This is a volumetric proxy: all walls are solid volumes (no one-sided planes).
- If using A-Frame:
    <a-entity gltf-model="#schwitzer" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>

If you don't see it:
- Temporarily set scale="5 5 5" to verify visibility.
- Ensure the .bin is served alongside the .gltf and paths match exactly.
