# Animal World expansion

Approved scope: clean History API routes; new home and ocean branch; all six prehistoric models use common intro and animation screens; remove speech card; retain completed T-Rex topics, mark other topics unavailable; import unique marine files and retain original clips. No Git push unless requested.

1. Inventory and deduplicate supplied archives; import GLB/FBX with texture mapping and per-model normalization.
2. Add marine manifest and loader with original clip playback and explicit display motion fallback for unanimated models.
3. Replace hash navigation with home/world/species/action paths, refresh fallback locally and Vercel.
4. Generalize shared hub and action tray, remove speaking UI, provide loading/error states and cancellation.
5. Generate home/ocean/environment backgrounds; render model-based cards/action previews.
6. Check every species loads, every runtime clip selectable, history and refresh work, mobile fits; document any unsupported asset.


## Navigation and pointer regression checks
Run `node tests/world-interaction.mjs` with the local server running. Covers mouse drag and wheel zoom on both marine screens, parent navigation through species/map/home for all 12 marine models, horizontal map tray scrolling, and restored dinosaur portraits. Bind selection handlers only to the relevant buttons: body also carries data-world/data-species state and must never receive those click handlers. Evaluate imported animation pose before measuring animated geometry for camera framing.


Viewer and alpha previews share `src/creatures/view-directions.js`. Directions are checked against four rendered quadrants of each model; loggerhead and Deinonychus face negative Z. Re-render affected action atlases after editing a view. The Deinonychus map card uses its corrected animated atlas. Ocean map uses one continuous image; tray bounds constrain pin positions, not image height.
