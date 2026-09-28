# Dino Island

Six-species 3D exploration and English-learning web demo.

## Run locally

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:4175.

## Deploy to Vercel from GitHub

1. In Vercel, choose Add New > Project and import DanhBNg/dinosour_game.
2. Keep Root Directory at the repository root (not dist).
3. The root vercel.json configures: Framework Other, Install npm ci, Build npm run build, Output dist.
4. Click Deploy. No environment variables or database are needed.

Future pushes to main trigger deployments when connected to Vercel. Use the HTTPS deployment URL for microphone support.

## Source

- src/: UI, scene controller and vocabulary lessons.
- src/creatures/: model factories and sourced species information.
- assets/: six models, textures, preview MP4s and generated island artwork.
- docs/island-art.md and docs/HERO_ASSETS.md: image generation provenance and prompts.
- dist/: generated static website, excluded from Git.

The map unlocks every species and shows video cards. The introduction shows a static, model-referenced cinematic portrait for each species. Learning opens with an eased close-up orbit/dolly and includes all 50 runtime action lessons, English audio, Vietnamese meanings, examples, word/sentence recognition and listening quizzes. Progress is stored in this browser only.

## Verification

Run npm test with the local server running. Browser tests currently expect Google Chrome installed at C:/Program Files/Google/Chrome/Application/chrome.exe. Tests simulate speech recognition; real microphone behavior requires device testing.

Speech recognition requires a supported browser and microphone permission, and may use an online service. It checks recognized text, not pronunciation quality. Manual action playback remains available. Voice availability depends on the device. Models and animations are illustrative reconstructions. Pterosaurs and mosasaurs are identified separately from dinosaurs in the species information.

## T-Rex visual knowledge pilot

Only T-Rex uses the new profile hub: one 3D entry and six illustrated topics. The 3D page has a static 2D habitat background with no pedestal, a compact translucent listening card, and all 12 actions in a transparent tray with scroll arrows. Other species keep the published legacy interface.

Generated assets live in `assets/knowledge/trex/`. Prompts and built-in imagegen provenance: `docs/knowledge-assets.json`. Scientific sources are linked from each topic’s information button. Images are reconstructions; the size tableau is illustrative, growth details are uncertain, and the distribution image uses modern geography.

Preview `/#intro/trex`, `/#topic/trex/growth`, or `/#learn/trex/roar`. The browser tests require `npm run build` and `npm start` on port 4175.

The T-Rex hub uses six picture icons. Revised illustrations show habitat with the animal, a prey chase, a three-toed footprint, and human/SUV/elephant comparisons. Growth arrows and a North America marker provide context. Size figures distinguish nose-to-tail length from hip or shoulder height; AI illustrations are not precision scale drawings.
