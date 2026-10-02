// Standalone gameplay page for Loggerhead sea turtle (/animal/loggerhead/gameplay)
import {TURTLE_ACTIVITIES} from './turtle-activities.js';
import {createSurvivalJourney} from '../../../core/survival/journey.js';
import {clampDepth} from '../ocean-play-state.js';
import {createJoystick} from '../../../components/joystick.js';
import {createHoldActions} from '../../../components/hold-actions.js';
import {createDepthMotion} from '../../../core/depth-motion.js';
import {createCameraMovement} from '../../../core/camera-movement.js';
import {TURTLE_TURN_DURATION} from './turtle-turn.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRoamWorld,moveWithinMap} from '../../../core/roam-world.js';
import {loadMarine} from '../marine.js';
import {getLoading3DHtml,dismissLoading3D} from '../../../components/loading-3d.js';
import {createBubbleSystem} from './bubble-particles.js';

export const pageInfo = {
  map: 'ocean',
  animal: 'loggerhead',
  animalName: 'Rùa quản đồng',
  tab: 'gameplay',
  title: 'Khám phá đại dương',
  path: '/animal/loggerhead/gameplay'
};

export function createLoggerheadGameplay(host) {
  const toggle = document.getElementById('orientation-toggle');
  if (toggle) toggle.style.display = 'none';
  host.innerHTML = '<div class="roam-canvas"></div><div class="roam-joystick"></div><div class="roam-actions"><button class="roam-action" aria-label="Thực hiện hành động"><span class="roam-action-icon" aria-hidden="true"></span><small></small><kbd>1</kbd></button></div><div class="roam-status" role="status" style="display:none"></div>' + getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi');
  const joystick = createJoystick(host.querySelector('.roam-joystick'));
  const actionButton = host.querySelector('.roam-action');
  let turnTime = -1, activity = '', quest = null, depthStart = 2, depthTarget = 2, baseScale = 1;
  const actionKeys = ['context', 'dive', 'rise', 'boost'];

  function fireAction(key = 'context') {
    if (!active) return;
    if (turnTime >= 0) return;
    if (key === 'context') {
      quest?.act();
      return;
    }
    if (key === 'boost' && !quest?.boost()) return;
    depthStart = actor.position.y;
    depthTarget = Math.max(quest?.stage.maxDepth ?? 0, clampDepth(depthStart + (key === 'rise' ? 2 : key === 'dive' ? -2 : 0)));
    if ((key === 'dive' || key === 'rise') && Math.abs(depthTarget - depthStart) < 0.001) return;
    if (key === 'dive' || key === 'rise') depthMotion.begin(key, depthStart, depthTarget);
    activity = key;
    turnTime = 0;
    actions.play(key);
  }

  actionButton.onclick = () => fireAction();
  const depthHold = createHoldActions(key => fireAction(key));
  const depthMotion = createDepthMotion();
  const cameraMovement = createCameraMovement(), worldInput = new T.Vector2();

  function updateActionButtons() {
    const isBoosting = activity === 'boost' && turnTime >= 0;
    const boostDuration = TURTLE_ACTIVITIES.boost?.duration ?? 3;
    const boostRemaining = isBoosting ? Math.max(0, boostDuration - turnTime) : 0;

    host.querySelectorAll('.roam-action').forEach(b => {
      const isAction = b.dataset.roamAction;
      b.disabled = turnTime >= 0 && !['dive', 'rise'].includes(isAction);
      if (isAction === 'boost') {
        b.disabled = isBoosting ? true : !quest?.canBoost();
        b.classList.toggle('boosting', isBoosting);
        const timer = b.querySelector('.boost-active-timer');
        if (timer) {
          timer.hidden = !isBoosting;
          if (isBoosting) timer.textContent = `${boostRemaining.toFixed(1)}s`;
        }
      }
      if (isAction === 'context') {
        const action = quest?.context;
        b.hidden = !action?.enabled;
        b.disabled ||= !action?.enabled;
        if (action) {
          b.querySelector('.roam-action-icon').textContent = action.icon;
          b.querySelector('small').textContent = action.label;
          b.setAttribute('aria-label', action.label);
          b.classList.toggle('ready', action.enabled);
        }
      }
      b.classList.toggle('playing', isAction === activity);
    });
  }

  function buttons() {
    depthHold.dispose();
    host.querySelectorAll('.extra-action').forEach(b => b.remove());
    actionButton.hidden = true;
    actionButton.dataset.roamAction = 'context';
    const icons = {boost: '»', dive: '↓', rise: '↑'};
    for (const [index, key] of actionKeys.entries()) {
      if (!index) continue;
      const button = document.createElement('button');
      button.className = 'roam-action extra-action';
      button.dataset.roamAction = key;
      button.setAttribute('aria-label', TURTLE_ACTIVITIES[key].label);
      if (key === 'boost') {
        button.innerHTML = `<span class="roam-action-icon" aria-hidden="true">${icons[key]}</span><small>${TURTLE_ACTIVITIES[key].label}</small><span class="boost-active-timer" aria-hidden="true" hidden></span><kbd>${index + 1}</kbd>`;
        button.disabled = true;
      } else {
        button.innerHTML = `<span class="roam-action-icon" aria-hidden="true">${icons[key]}</span><small>${TURTLE_ACTIVITIES[key].label}</small><kbd>${index + 1}</kbd>`;
      }
      if (key === 'dive' || key === 'rise') {
        button.style.touchAction = 'none';
        depthHold.bind(button, key);
      } else {
        button.onclick = () => fireAction(key);
      }
      host.querySelector('.roam-actions').append(button);
    }
    updateActionButtons();
  }

  const mount = host.querySelector('.roam-canvas'), status = host.querySelector('.roam-status');
  const renderer = new T.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  mount.append(renderer.domElement);

  const scene = new T.Scene(), camera = new T.PerspectiveCamera(52, 1, 0.1, 180);
  let world, animal, actions, active = false, serial = 0, moving = false, frameId;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 5;
  controls.maxDistance = 65;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.enabled = false;

  const actor = new T.Group();
  scene.add(actor);
  const bubbles = createBubbleSystem(scene);
  const followPosition = new T.Vector3(), followDelta = new T.Vector3();
  const mouthPosition = new T.Vector3();

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const context = shadowCanvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(10,25,22,.4)');
  gradient.addColorStop(1, 'rgba(10,25,22,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const shadowTexture = new T.CanvasTexture(shadowCanvas);
  const shadow = new T.Mesh(new T.PlaneGeometry(8, 8), new T.MeshBasicMaterial({map: shadowTexture, transparent: true, depthWrite: false}));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const target = new T.Vector3(), offset = new T.Vector3(0, 5, 11), keys = new Set(), pointers = new Map();
  let velocity = new T.Vector2();

  scene.add(new T.HemisphereLight(0xe4fffa, 0x435b38, 2.6));
  const sun = new T.DirectionalLight(0xffedce, 3);
  sun.position.set(15, 30, 12);
  scene.add(sun);

  function clear() {
    depthHold.reset();
    joystick.reset();
    keys.clear();
    pointers.clear();
    velocity.set(0, 0);
    host.querySelectorAll('[data-direction]').forEach(b => b.removeAttribute('data-held'));
  }

  const codes = {KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right'};

  function keydown(e) {
    if (!active || e.target.closest?.('input,textarea,select')) return;
    if (/^(Digit|Numpad)[5-6]$/.test(e.code)) {
      e.preventDefault();
      if (!e.repeat && turnTime < 0) quest?.useSkill(['ram', 'shield'][Number(e.code.slice(-1)) - 5]);
      return;
    }
    if (/^(Digit|Numpad)[1-4]$/.test(e.code)) {
      e.preventDefault();
      const slot = Number(e.code.slice(-1)) - 1;
      if (slot === 1 || slot === 2) depthHold.press(e.code, actionKeys[slot]);
      else if (!e.repeat) fireAction(actionKeys[slot]);
      return;
    }
    if (!codes[e.code]) return;
    e.preventDefault();
    keys.add(e.code);
  }

  function keyup(e) {
    keys.delete(e.code);
    depthHold.release(e.code);
  }

  addEventListener('keydown', keydown);
  addEventListener('keyup', keyup);
  addEventListener('blur', clear);
  const visibility = () => {
    if (document.hidden) clear();
  };
  document.addEventListener('visibilitychange', visibility);

  for (const button of host.querySelectorAll('[data-direction]')) {
    button.onpointerdown = e => {
      e.preventDefault();
      button.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, button.dataset.direction);
      button.dataset.held = 'true';
    };
    const release = e => {
      pointers.delete(e.pointerId);
      button.removeAttribute('data-held');
    };
    button.onpointerup = release;
    button.onpointercancel = release;
    button.onlostpointercapture = release;
  }

  function disposeModel(model) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    model.traverse(n => {
      if (n.geometry) geometries.add(n.geometry);
      for (const m of (Array.isArray(n.material) ? n.material : [n.material]).filter(Boolean)) {
        materials.add(m);
        Object.values(m).forEach(v => {
          if (v?.isTexture) textures.add(v);
        });
      }
    });
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    textures.forEach(t => t.dispose());
  }

  function disposeAnimal() {
    actions?.dispose();
    actions = null;
    bubbles.setAnimal(null, null);
    if (animal) {
      actor.remove(animal);
      disposeModel(animal);
      animal = null;
    }
  }

  async function load() {
    const token = ++serial;
    clear();
    active = false;
    let loader = host.querySelector('.loading-3d-screen');
    if (!loader) {
      host.insertAdjacentHTML('beforeend', getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi'));
      loader = host.querySelector('.loading-3d-screen');
    }
    if (loader) {
      loader.classList.remove('fade-out');
      loader.style.display = '';
    }
    status.hidden = true;
    disposeAnimal();
    bubbles.reset();
    quest?.dispose();
    quest = null;
    actor.position.set(0, 0, 0);
    actor.rotation.set(0, 0, 0);
    actor.scale.setScalar(1);
    actor.updateMatrixWorld(true);
    controls.enabled = false;
    world?.dispose();
    if (world) scene.remove(world.group);

    world = createRoamWorld(true);
    scene.add(world.group);
    scene.background = new T.Color(0x176a86);
    scene.fog = new T.Fog(0x176a86, 22, 88);
    turnTime = -1;
    activity = '';
    buttons();
    quest = createSurvivalJourney(scene, host);

    actionButton.querySelector('.roam-action-icon').innerHTML = '<svg class="turtle-action-icon" viewBox="0 0 64 64" aria-hidden="true"><g fill="#ffd66b" stroke="#9c6826" stroke-width="1.5" stroke-linejoin="round"><path d="M22 23C10 13 3 18 9 27L21 33M42 23C54 13 61 18 55 27L43 33M23 43C12 43 10 52 16 52L26 47M41 43C52 43 54 52 48 52L38 47M29 48L32 57L35 48"/><ellipse cx="32" cy="14" rx="8" ry="10"/><ellipse cx="32" cy="34" rx="17" ry="20" fill="#ebba45"/><path d="M32 21L41 27V39L32 46L23 39V27Z" fill="#ffe18a"/><path d="M23 27L18 24M41 27L46 24M23 39L18 43M41 39L46 43M32 21V15M32 46V53" fill="none"/><circle cx="29" cy="10" r="1" fill="#44361c"/><circle cx="35" cy="10" r="1" fill="#44361c"/></g></svg>';
    actionButton.querySelector('small').textContent = 'Lộn một vòng';
    actionButton.setAttribute('aria-label', 'Lộn một vòng');

    try {
      const result = await loadMarine('loggerhead');
      if (token !== serial) {
        result.createActions?.().dispose();
        disposeModel(result.model);
        return;
      }
      animal = result.model;
      actor.add(animal);
      bubbles.setAnimal(animal, actor);
      actions = result.createActions();
      actions.play('clip0');
      actions.setSpeed(0.35);
      actions.update(0.001);
      animal.updateMatrixWorld(true);

      const box = new T.Box3().setFromObject(animal, true);
      const size = box.getSize(new T.Vector3());
      const scale = 4.5 / Math.max(size.x, size.y, size.z);
      baseScale = scale;
      actor.scale.setScalar(scale * (quest?.stage.scale ?? 1));
      actor.position.set(0, 2, 0);
      actor.rotation.set(0, 0, 0);
      depthStart = depthTarget = 2;
      moving = false;
      offset.set(0, 5, 11);
      target.copy(actor.position).add(new T.Vector3(0, 1, 0));
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      controls.target.copy(target);
      controls.enabled = true;
      controls.update();
      followPosition.copy(actor.position);
      if (loader) dismissLoading3D(loader, 400);
      status.hidden = true;
      active = true;
      resize();
    } catch (e) {
      if (token !== serial) return;
      const ldr = host.querySelector('.loading-3d-screen');
      if (ldr) {
        ldr.innerHTML = '<div class="loading-3d-box video-loading-3d-box"><p class="loading-3d-title" style="margin-bottom:14px">Không thể tải vùng khám phá</p><button class="round" aria-label="Thử tải lại" style="font-size:24px;width:52px;height:52px">↻</button></div>';
        ldr.querySelector('button').onclick = () => load();
      }
      console.error(e);
    }
  }

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(mount);

  let last = performance.now();
  function frame(now) {
    frameId = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    if (!active || document.hidden || document.body.classList.contains('orientation-blocked')) {
      clear();
      return;
    }
    controls.update();
    const held = new Set([...keys].map(k => codes[k]).concat([...pointers.values()]));
    const dx = Number(held.has('right')) - Number(held.has('left'));
    const dz = Number(held.has('down')) - Number(held.has('up'));
    const input = new T.Vector2(dx + joystick.value.x, dz + joystick.value.y);
    if (input.lengthSq() > 1) input.normalize();
    cameraMovement(input, camera, worldInput);
    velocity.lerp(worldInput, 1 - Math.exp(-dt * 10));
    const walking = velocity.length() > 0.04;
    moving = walking;

    const turn360 = activity === 'turn360';
    if (turnTime >= 0) {
      turnTime += dt;
      let finished = turnTime >= (TURTLE_ACTIVITIES[activity]?.duration ?? Infinity);
      if (turn360) {
        actor.rotation.z = Math.sin(Math.min(1, turnTime / TURTLE_TURN_DURATION) * Math.PI * 2) * Math.PI;
        finished = turnTime >= TURTLE_TURN_DURATION;
      }
      const isDepthAction = activity === 'dive' || activity === 'rise';
      if (isDepthAction) {
        const motion = depthMotion.update(dt, actor.position.y, depthHold.action, quest.stage.maxDepth, 6);
        actor.position.y = motion.height;
        finished = motion.finished;
        if (activity !== motion.action) {
          activity = motion.action;
          actions.play(activity);
        }
      }
      if (finished) {
        actions.setDepthHeld(false);
        actions.play('clip0');
        turnTime = -1;
        activity = '';
      }
    }
    if (turnTime < 0) depthHold.repeat();
    actions.setDepthHeld(!!depthHold.action && (activity === 'dive' || activity === 'rise'));
    actions.update(dt);

    updateActionButtons();

    if ((walking || activity === 'boost') && activity !== 'eat') {
      const vx = walking ? velocity.x : -Math.sin(actor.rotation.y);
      const vz = walking ? velocity.y : -Math.cos(actor.rotation.y);
      const desired = Math.atan2(vx, vz) + Math.PI;
      const delta = Math.atan2(Math.sin(desired - actor.rotation.y), Math.cos(desired - actor.rotation.y));
      actor.rotation.y += delta * (1 - Math.exp(-dt * 8));
      const boost = activity === 'boost' ? 1 + 0.6 * Math.sin(Math.PI * Math.min(1, turnTime / 3)) : 1;
      moveWithinMap(actor.position, vx * dt * quest.speed * boost, vz * dt * quest.speed * boost, world.obstacles, 1.4);
    }

    if (activity === 'eat' && turnTime < 0.65 && quest.feedingTarget) {
      const food = quest.feedingTarget;
      const desired = Math.atan2(food.x - actor.position.x, food.z - actor.position.z) + Math.PI;
      const delta = Math.atan2(Math.sin(desired - actor.rotation.y), Math.cos(desired - actor.rotation.y));
      actor.rotation.y += delta * (1 - Math.exp(-dt * 12));
      actions.getMouthPosition(mouthPosition);
      const reach = Math.min(1, dt * 5);
      moveWithinMap(actor.position, (food.x - mouthPosition.x) * reach, (food.z - mouthPosition.z) * reach, world.obstacles, 1.4);
      actor.position.y = Math.max(quest.stage.maxDepth, clampDepth(actor.position.y + (food.y - mouthPosition.y) * reach));
    }

    actions.getMouthPosition(mouthPosition, true);
    const automaticAction = quest?.update(dt, actor.position, activity === 'boost', turnTime < 0, mouthPosition);
    if (automaticAction === 'recover' || (automaticAction === 'hurt' && activity === 'eat')) {
      actions.setDepthHeld(false);
      actions.play('clip0');
      activity = '';
      turnTime = -1;
    }
    const skillAction = quest?.takeSkillAction();
    if (skillAction && turnTime < 0) {
      const boss = quest.state.boss.position;
      if (skillAction !== 'shield') actor.rotation.y = Math.atan2(boss.x - actor.position.x, boss.z - actor.position.z) + Math.PI;
      activity = skillAction;
      turnTime = 0;
      actions.play(skillAction);
    }
    if (automaticAction === 'eat') fireAction('eat');
    actor.scale.setScalar(baseScale * quest.stage.scale);

    const isMoving = walking || activity === 'boost' || activity === 'dive' || activity === 'rise' || (activity === 'eat' && turnTime < 0.65);
    if (isMoving) {
      bubbles.emit(dt, {
        isBoost: activity === 'boost',
        scale: baseScale * (quest?.stage.scale ?? 1)
      });
    }
    bubbles.update(dt);

    shadow.material.opacity = 1;
    shadow.position.set(actor.position.x, -2.97, actor.position.z);
    shadow.scale.set(0.65, 0.65, 1);
    followDelta.set(actor.position.x - followPosition.x, actor.position.y - followPosition.y, actor.position.z - followPosition.z);
    camera.position.add(followDelta);
    controls.target.add(followDelta);
    followPosition.copy(actor.position);
    renderer.render(scene, camera);
  }
  frameId = requestAnimationFrame(frame);

  return {
    load,
    setActive(value) {
      active = value && !!animal;
      controls.enabled = active;
      clear();
      const toggle = document.getElementById('orientation-toggle');
      if (toggle) toggle.style.display = value ? 'none' : '';
      if (!value) {
        serial++;
        status.hidden = true;
        const ldr = host.querySelector('.loading-3d-screen');
        if (ldr) ldr.style.display = 'none';
      }
    },
    get state() {
      return {
        id: 'loggerhead',
        active,
        moving,
        bubblesActive: bubbles.activeCount,
        turnTime,
        activity,
        quest: quest?.state,
        action: actions?.state.id,
        jumpHeight: 0,
        groundY: 0,
        position: actor.position.toArray(),
        camera: camera.position.toArray(),
        obstacles: world?.obstacles
      };
    },
    dispose() {
      serial++;
      cancelAnimationFrame(frameId);
      controls.dispose();
      observer.disconnect();
      clear();
      const toggle = document.getElementById('orientation-toggle');
      if (toggle) toggle.style.display = '';
      depthHold.dispose();
      disposeAnimal();
      bubbles.dispose();
      quest?.dispose();
      world?.dispose();
      shadow.geometry.dispose();
      shadow.material.dispose();
      shadowTexture.dispose();
      renderer.dispose();
      removeEventListener('keydown', keydown);
      removeEventListener('keyup', keyup);
      removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', visibility);
    }
  };
}

export function render(container, context = {}) {
  const host = container.querySelector('#roam-screen') || container;
  const game = createLoggerheadGameplay(host);
  game.load();
  return { ...pageInfo, game };
}

export default { pageInfo, createLoggerheadGameplay, render };
