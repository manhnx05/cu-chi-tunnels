$ErrorActionPreference = "Stop"

git add index.html
git commit -m "Add UI button for Phase 5 Tunnel Digging"

git add js/data/narrations.js
git commit -m "Add historical narration text for Phase 5"

git add js/config/constants.js
git commit -m "Define visual color constant for digger entities"

git add js/engine/entities.js
git commit -m "Update entity manager to render digger units"

git add js/audio/audioEngine.js
git commit -m "Implement digging sound effect for Phase 5"

git add js/app.js
git commit -m "Integrate digging mechanics and entity spawn logic for Phase 5"

git push origin main
