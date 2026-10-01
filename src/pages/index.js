// Central Page Registry and Router
import * as homePage from './home.js';
import * as oceanPage from './ocean-world/index.js';
import * as dinosourPage from './dinosaur-world/index.js';

export { homePage, oceanPage, dinosourPage };

export const maps = {
  ocean: oceanPage,
  'ocean-world': oceanPage,
  dinosour: dinosourPage,
  dinosaurs: dinosourPage,
  dinosaur: dinosourPage,
  'dinosaur-world': dinosourPage
};
export const pages = maps;

export function getPage({ map, animal, tab }) {
  if (!map && !animal) return homePage;
  const normMap = (map === 'dinosaurs' || map === 'dinosaur' || map === 'dinosaur-world') ? 'dinosour' : (map === 'ocean-world' ? 'ocean' : map);
  const mapModule = maps[normMap];
  if (!mapModule) return null;
  if (!animal) return mapModule;
  const animalModule = mapModule.getAnimal(animal);
  if (!animalModule) return null;
  if (!tab) return animalModule;
  const normTab = (tab === 'footprints') ? 'movement' : tab;
  return animalModule.getTab(normTab) || animalModule.getTab(tab);
}

export function resolvePage(pathname) {
  const parts = decodeURIComponent(pathname).split('/').filter(Boolean);
  if (!parts.length) return homePage;
  if (parts[0] === 'world') {
    return getPage({ map: parts[1] }) || homePage;
  }
  if (parts[0] === 'animal') {
    const animalId = parts[1];
    const isOcean = oceanPage.mapInfo.animals.includes(animalId);
    const map = isOcean ? 'ocean' : 'dinosour';
    if (parts[2] === 'topics' && parts[3]) {
      return getPage({ map, animal: animalId, tab: parts[3] });
    }
    return getPage({ map, animal: animalId });
  }
  return homePage;
}

export default { homePage, oceanPage, dinosourPage, maps, getPage, resolvePage };
