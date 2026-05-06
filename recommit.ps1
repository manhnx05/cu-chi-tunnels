$ErrorActionPreference = "Stop"

git reset --soft HEAD~1
git reset HEAD

git add index.html
git commit -m "Include entities script in main HTML"

git add js/app.js
git commit -m "Integrate entity spawn logic into main application loop"

git add js/audio/audioEngine.js
git commit -m "Add trap trigger sound synthesis to audio engine"

git add js/visual/renderer.js
git commit -m "Update renderer to handle entities and blood particles"

git add js/engine/entities.js
git commit -m "Create entity manager for movement logic"

git add git_setup.ps1
git commit -m "Add powershell script for git automation"

git push -u origin main -f
