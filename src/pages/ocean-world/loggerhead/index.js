// Animal Landing & Tab Aggregator: ocean/loggerhead
import * as habitatTab from './habitat.js';
import * as dietTab from './diet.js';
import * as movementTab from './movement.js';
import * as sizeTab from './size.js';
import * as growthTab from './growth.js';
import * as rangeTab from './range.js';
import * as gameplayTab from './gameplay.js';

export const animalInfo = {
  map: "ocean",
  id: "loggerhead",
  name: "Rùa quản đồng",
  path: "/animal/loggerhead",
  tabs: ["habitat","diet","movement","size","growth","range","gameplay"]
};

export const tabs = {
  habitat: habitatTab,
  diet: dietTab,
  movement: movementTab,
  size: sizeTab,
  growth: growthTab,
  range: rangeTab,
  gameplay: gameplayTab,
  explore: gameplayTab,
};

export function getTab(tabName) {
  if (tabName === 'footprints' && tabs.movement) return tabs.movement;
  if (tabName === 'explore' || tabName === 'gameplay') return tabs.gameplay;
  return tabs[tabName] || tabs.habitat || null;
}

export function render(container, context = {}) {
  return animalInfo;
}

export default { animalInfo, tabs, getTab, render };
