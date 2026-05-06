$ErrorActionPreference = "Stop"

git add js/config/constants.js
git commit -m "Update camera configuration to support interpolation and target state"

git add js/app.js
git commit -m "Implement camera easing and trigger phase-based auto focus"

git add js/visual/renderer.js
git commit -m "Render dynamic fog of war and illuminating radial gradients"

git add js/visual/particles.js
git commit -m "Add collision physics logic for dirt and smoke particles"

git add js/engine/entities.js
git commit -m "Implement easing movement and oriented ellipse drawing for entities"

git add js/audio/audioEngine.js
git commit -m "Integrate spatial audio panning and lowpass filters for realistic sound"

git push origin main
