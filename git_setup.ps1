$ErrorActionPreference = "Stop"

Set-Content -Path README.md -Value "# cu-chi-tunnels"
git init
git add README.md
git commit -m "Initialize project with README"
git branch -M main
git remote add origin https://github.com/manhnx05/cu-chi-tunnels.git

git add index.html
git commit -m "Create main HTML structure and UI layout"

git add css/styles.css
git commit -m "Add core styling and UI overlay design"

git add js/config/constants.js
git commit -m "Configure simulation constants and depth parameters"

git add js/data/locations.js
git commit -m "Define historical locations and coordinates"

git add js/data/narrations.js
git commit -m "Add phase narration content and keywords"

git add js/data/routes.js
git commit -m "Define tunnel routes and entity paths"

git add js/engine/canvas.js
git commit -m "Implement canvas rendering engine"

git add js/engine/projection.js
git commit -m "Create pseudo-3D isometric projection engine"

git add js/engine/terrain.js
git commit -m "Implement terrain rendering logic"

git add js/audio/audioEngine.js
git commit -m "Add audio engine for sound effects"

git add js/audio/narrator.js
git commit -m "Implement voice narrator using Web Speech API"

git add js/visual/particles.js
git commit -m "Create particle system for visual effects"

git add js/visual/renderer.js
git commit -m "Implement main visual renderer"

git add js/controls/input.js
git commit -m "Add input handler for mouse interactions"

git add js/controls/ui.js
git commit -m "Implement UI manager for phase controls"

git add js/app.js
git commit -m "Connect all modules into main application loop"

git push -u origin main
