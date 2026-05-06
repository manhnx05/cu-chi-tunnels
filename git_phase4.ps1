$ErrorActionPreference = "Stop"

git add index.html
git commit -m "Add UI button for Phase 4 Tourism"

git add js/data/narrations.js
git commit -m "Add voice narration script for Phase 4"

git add js/audio/audioEngine.js
git commit -m "Implement ambient nature sounds for Phase 4"

git add js/config/constants.js
git commit -m "Add color constants for tourist entities"

git add js/app.js
git commit -m "Integrate tourism mechanics and entity spawning into Phase 4"

git add js/engine/entities.js
git commit -m "Update entity manager to render tourist dots"

git push origin main
