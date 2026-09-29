# Animal World

Web demo with a biome home map, prehistoric branch (6 models), ocean branch (8 visible models; 4 retained but hidden), model introduction and looping animation viewer.

## Local

Run `npm ci`, `npm run build`, then `npm start`. Open http://127.0.0.1:4175.

## Routes

- `/`: Animal World, two available regions and five locked regions.
- `/world/dinosaurs`, `/world/ocean`: species maps.
- `/animal/trex`, `/animal/seal`: introduction.
- `/animal/trex/actions/roar`: looping action.
- `/animal/trex/topics/growth`: completed T-Rex illustrated knowledge.

Browser back/forward and direct refresh use History API and server fallbacks. Old index hash links migrate to clean routes. T-Rex and loggerhead have illustrated knowledge topics. All marine species share the same six category icons; other species show unavailable feedback. The speech practice card is removed for all species.

`/animal/loggerhead/topics/habitat` opens the marine knowledge sample. `isopod`, `hawksbill`, `whale`, and `paShark` are hidden via `hiddenMarineIds`; their previous routes redirect to the ocean map. Original files remain available for repair.

## Assets and animation

`src/marine.js` maps each unique GLB/FBX to its supplied texture and environment. Original clips are retained. Great white shark has no original skeletal animation: its display motion is a small drift. Giant isopod has no rig/clip and currently provides a static observation action. These are not newly rigged locomotion cycles. Duplicate Copy archives are excluded. Generated environments and maps are in `assets/worlds`; model-based portraits and per-action alpha sprites are in `assets/portraits` and `assets/action-previews`.

Run `node scripts/render-action-previews.mjs [species IDs]` after model changes, then rebuild. Some original assets are large (up to about 60 MB per model), so this is a demonstration build; models load on demand. FBX texture mappings are explicit in the manifest.

## Verification

With the local server running, `npm test` verifies home/branch navigation, direct URLs, refresh, every action across 14 visible models and mobile layout. Tests use installed Google Chrome and Playwright. Earlier learning tests remain as historical files but are not part of the current no-speech-card workflow.

Run `node tests/ocean-topics.mjs` for the shared icon, hidden-route, topic and responsive map checks; `node tests/world-interaction.mjs` for marine drag/zoom and navigation. New artwork and full generation prompts: `assets/knowledge/ocean/`, `docs/ocean-topic-art.json`. Loggerhead factual reference: NOAA Fisheries species page, linked within each topic.

## Vercel

Import DanhBNg/dinosour_game, root directory repository root. The supplied vercel.json uses `npm ci`, `npm run build`, output `dist`, and clean-route rewrites. No database or environment variables required. This update has not been pushed automatically.
