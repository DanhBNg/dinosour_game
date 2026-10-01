// Map Page: ocean
import * as loggerheadAnimal from './loggerhead/index.js';
import * as tunaAnimal from './tuna/index.js';
import * as sharkAnimal from './shark/index.js';
import * as fishAnimal from './fish/index.js';
import * as sealAnimal from './seal/index.js';
import * as squidAnimal from './squid/index.js';
import * as slugAnimal from './slug/index.js';
import * as amplectobeluaAnimal from './amplectobelua/index.js';

export const mapInfo = {
  id: "ocean",
  title: "OCEAN WORLD",
  path: "/world/ocean",
  animals: ["loggerhead","tuna","shark","fish","seal","squid","slug","amplectobelua"]
};

export const animalsMap = {
  loggerhead: loggerheadAnimal,
  tuna: tunaAnimal,
  shark: sharkAnimal,
  fish: fishAnimal,
  seal: sealAnimal,
  squid: squidAnimal,
  slug: slugAnimal,
  amplectobelua: amplectobeluaAnimal,
};

export function getAnimal(animalId) {
  return animalsMap[animalId] || null;
}

export function render(container, context = {}) {
  return mapInfo;
}

export default { mapInfo, animals: animalsMap, getAnimal, render };
