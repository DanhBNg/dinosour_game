// Animal Landing & Tab Aggregator: dinosour/ptero
import * as habitatTab from './habitat.js';
import * as dietTab from './diet.js';
import * as movementTab from './movement.js';
import * as sizeTab from './size.js';
import * as growthTab from './growth.js';
import * as rangeTab from './range.js';

export const animalInfo = {
  map: "dinosour",
  id: "ptero",
  name: "Pterosaur",
  path: "/animal/ptero",
  tabs: ["habitat","diet","movement","size","growth","range"]
};

export const tabs = {
  habitat: habitatTab,
  diet: dietTab,
  movement: movementTab,
  size: sizeTab,
  growth: growthTab,
  range: rangeTab,
};

export function getTab(tabName) {
  if (tabName === 'footprints' && tabs.movement) return tabs.movement;
  return tabs[tabName] || tabs.habitat || null;
}

export function render(container, context = {}) {
  return animalInfo;
}

export default { animalInfo, tabs, getTab, render };
