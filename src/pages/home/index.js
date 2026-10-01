// Home Screen Page Module
import * as oceanMap from './ocean/index.js';
import * as dinosourMap from './dinosour/index.js';

export const pageInfo = {
  id: 'home',
  title: 'Thế giới động vật',
  path: '/'
};

export const maps = {
  ocean: oceanMap,
  dinosour: dinosourMap,
  dinosaurs: dinosourMap
};

export const worldsList = [
  { id: 'dinosaurs', map: 'dinosour', name: 'THẾ GIỚI CỔ ĐẠI', x: 23, y: 36, art: '/assets/heroes/trex.png' },
  { id: 'ocean', map: 'ocean', name: 'ĐẠI DƯƠNG', x: 80, y: 46, art: '/assets/map-portraits/loggerhead.png' },
  { model: 'elephant', name: 'ĐỒNG CỎ', x: 13, y: 64 },
  { model: 'gorilla', name: 'RỪNG NHIỆT ĐỚI', x: 46, y: 44 },
  { model: 'wolf', name: 'NÚI & BẦU TRỜI', x: 72, y: 23 },
  { model: 'cow', name: 'NÔNG TRẠI', x: 42, y: 81 },
  { name: 'VÙNG ĐẤT MỚI', x: 88, y: 82 }
];

export function render(container, context = {}) {
  const { navigate, notify, previewMarkup } = context;
  const html = worldsList.map(v => `
    <button class="world-badge ${v.id ? 'available' : 'locked'}" style="left:${v.x}%;top:${v.y}%" ${v.id ? 'data-world="' + v.id + '"' : 'aria-disabled="true"'} aria-label="${v.name}">
      <span>${v.id ? (previewMarkup ? previewMarkup(v.id === 'dinosaurs' ? 'trex' : 'loggerhead', v.id === 'dinosaurs' ? 'roar' : 'clip0') : '') : v.model ? (previewMarkup ? previewMarkup(v.model, 'clip0') : '') + '<i class="badge-lock" aria-hidden="true">🔒</i>' : '🔒'}</span>
      <b>${v.name}</b>
    </button>
  `).join('');

  container.innerHTML = '<div class="home-canvas"><img class="home-art" src="/assets/worlds/home.png" alt="Bản đồ thế giới động vật">' + html + '</div>';

  if (navigate) {
    container.querySelectorAll('button[data-world]').forEach(b => {
      b.onclick = () => navigate('/world/' + b.dataset.world);
    });
  }
  if (notify) {
    container.querySelectorAll('.world-badge.locked').forEach(b => {
      b.onclick = () => notify('Vùng này sẽ được mở sau');
    });
  }
  return pageInfo;
}

export default { pageInfo, maps, worldsList, render };
