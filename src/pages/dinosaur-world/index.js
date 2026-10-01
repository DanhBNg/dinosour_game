// Map Page: dinosour
import * as trexAnimal from './trex/index.js';
import * as stegoAnimal from './stego/index.js';
import * as triceAnimal from './trice/index.js';
import * as pteroAnimal from './ptero/index.js';
import * as mosaAnimal from './mosa/index.js';
import * as deinoAnimal from './deino/index.js';
import * as brachioAnimal from './brachio/index.js';

export const mapInfo = {
  id: "dinosour",
  title: "DINOSAUR WORLD",
  path: "/world/dinosaurs",
  animals: ["trex","stego","trice","ptero","mosa","deino","brachio"]
};

export const animalsMap = {
  trex: trexAnimal,
  stego: stegoAnimal,
  trice: triceAnimal,
  ptero: pteroAnimal,
  mosa: mosaAnimal,
  deino: deinoAnimal,
  brachio: brachioAnimal,
};

export function getAnimal(animalId) {
  return animalsMap[animalId] || null;
}

export function render(container, context = {}) {
  return mapInfo;
}

export default { mapInfo, animals: animalsMap, getAnimal, render };
