# Animal Survival Journey

Open `/animal/loggerhead/explore` or `/animal/loggerhead/gameplay`.

## Gameplay

- Daily missions: one food objective, defeat a shark, and heal in the cave. Each completion grants EXP once; completing all three grants a daily bonus.
- Approach small fish, crabs or snails to eat automatically. The 3.8-second bite/chew/swallow animation awards the counter and EXP only at swallowing. Food grants 8/10/6 EXP respectively.
- HP starts at 80/100. Level 2 requires 30 cumulative EXP; subsequent levels use `10 * (level² - 1)`. Attack starts at 10 and increases by 2 per level.
- From level 2 a 300-HP shark appears after a warning. Its red attack warning gives time to swim away or shield. Hits deal 8 HP; defeating it grants 50 EXP plus any mission rewards. It respawns after 65 seconds.
- Tấn công deals twice ATK (4s cooldown); Phòng thủ blocks damage for 3s (9s cooldown). Attacking requires proximity and matching depth.
- Enter the cave at `(-6, 2, -14)` to lose pursuit and restore up to 15 HP every 2 seconds. Healing at full HP earns nothing. Zero HP returns the turtle to the cave with 35 HP without losing progress.

## Controls

- WASD/arrows or joystick: camera-relative horizontal movement.
- Hold Lặn/Nổi or keys 3/4 for continuous depth changes. Key 2 boosts; key 1 performs an available landmark action.
- Two combat buttons share the movement-control row: Tấn công (key 5) and Phòng thủ (key 6). Radial cooldown overlays and countdowns remain visible; unavailable skills are disabled.
- HP/EXP/level/attack and per-species counters sit at top left, the boss health bar is top center, and the minimap is top right. Missions open from the purple left-side icon or the shortcut in the stats footer. Joystick is bottom left; movement and combat buttons share the bottom-right row. Notices stay above the controls, clear of the center.
- The circular, label-free minimap shows nearby prey, landmarks, turtle and shark. Distant markers are hidden rather than clamped to misleading positions.
- Feeding does not zoom or orbit the camera. The former glass reef barrier remains removed; world bounds and rock collisions remain.

## Modules

- `src/core/survival/loggerhead.js`: balancing, missions, skills, landmarks and growth.
- `progress.js`: progression and version-2 saves, migrating previous EXP/counters/discoveries under the existing localStorage key. Daily rollover retains lifetime progress.
- `combat.js`: renderer-independent boss, cooldowns, damage, shelter and recovery state machine.
- `journey.js`: prey capture, world events, combat effects and scene integration.
- `hud.js`, `minimap.js`, `boss-model.js`: interface and procedural shark model.
- `src/pages/ocean-world/loggerhead/gameplay.js`: active turtle scene, animation lifecycle, camera and input.

`npm run test:survival` checks progression, persistence, combat, healing, feeding, minimap and disposal. `tests/ocean-play.mjs` is a browser smoke test requiring the dev server on port 4175 and Chrome. `npm run build` builds the site.
