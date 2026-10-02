import * as T from 'three';

/**
 * Creates an underwater bubble particle system for the sea turtle.
 * Emits translucent aquatic bubbles from flippers and tail when moving,
 * rising with buoyancy, gentle wobble, and smooth fade-out.
 */
export function createBubbleSystem(scene, maxBubbles = 60) {
  const group = new T.Group();
  group.name = 'turtle-bubble-particles';
  scene.add(group);

  const geometries = [
    new T.SphereGeometry(0.07, 7, 5),
    new T.SphereGeometry(0.11, 8, 6),
    new T.SphereGeometry(0.15, 8, 6)
  ];

  const baseMaterial = new T.MeshStandardMaterial({
    color: 0xdbf8ff,
    emissive: 0x38b8d4,
    emissiveIntensity: 0.35,
    roughness: 0.12,
    metalness: 0.15,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });

  const materials = [];
  const pool = [];

  for (let i = 0; i < maxBubbles; i++) {
    const geo = geometries[i % geometries.length];
    const mat = baseMaterial.clone();
    materials.push(mat);
    const mesh = new T.Mesh(geo, mat);
    mesh.visible = false;
    group.add(mesh);
    pool.push({
      mesh,
      mat,
      active: false,
      life: 0,
      maxLife: 1,
      baseScale: 1,
      vx: 0,
      vy: 0,
      vz: 0,
      wobbleFreq: 5,
      wobblePhase: 0,
      initialOpacity: 0.82
    });
  }

  let actorRef = null;
  let animalRef = null;
  let emitTimer = 0;
  let emitIndex = 0;
  let animTime = 0;

  let bones = {
    leftFlipper: null,
    rightFlipper: null,
    tail: null,
    hindLeft: null,
    hindRight: null
  };

  function setAnimal(animal, actor) {
    animalRef = animal;
    actorRef = actor;
    if (animal) {
      bones = {
        leftFlipper: animal.getObjectByName('flipper-left002') || animal.getObjectByName('flipper-left001') || null,
        rightFlipper: animal.getObjectByName('flipper-right002') || animal.getObjectByName('flipper-right001') || null,
        tail: animal.getObjectByName('tail001') || null,
        hindLeft: animal.getObjectByName('hind-left001') || null,
        hindRight: animal.getObjectByName('hind-right001') || null
      };
    } else {
      bones = {
        leftFlipper: null,
        rightFlipper: null,
        tail: null,
        hindLeft: null,
        hindRight: null
      };
    }
  }

  const tempPos = new T.Vector3();
  const forward = new T.Vector3();
  const right = new T.Vector3();

  function spawnBubble(pos, options = {}) {
    let bubble = pool.find(b => !b.active);
    if (!bubble) {
      bubble = pool.reduce((min, b) => (b.life < min.life ? b : min), pool[0]);
    }

    const scale = options.scale ?? 1;
    const isBoost = options.isBoost ?? false;
    const life = isBoost ? (0.7 + Math.random() * 0.5) : (0.9 + Math.random() * 0.6);

    bubble.active = true;
    bubble.life = life;
    bubble.maxLife = life;
    bubble.baseScale = (0.75 + Math.random() * 0.55) * (isBoost ? 1.35 : 1.0) * scale;
    bubble.wobbleFreq = 4 + Math.random() * 4;
    bubble.wobblePhase = Math.random() * Math.PI * 2;
    bubble.initialOpacity = isBoost ? 0.9 : 0.82;

    // Upward buoyancy (0.8 to 1.6 units/sec)
    bubble.vy = 0.85 + Math.random() * 0.85;
    bubble.vx = (Math.random() - 0.5) * (isBoost ? 0.5 : 0.25);
    bubble.vz = (Math.random() - 0.5) * (isBoost ? 0.5 : 0.25);

    if (options.drift) {
      bubble.vx += options.drift.x;
      bubble.vz += options.drift.z;
    }

    bubble.mesh.position.copy(pos);
    bubble.mesh.position.x += (Math.random() - 0.5) * 0.2 * scale;
    bubble.mesh.position.y += (Math.random() - 0.5) * 0.15 * scale;
    bubble.mesh.position.z += (Math.random() - 0.5) * 0.2 * scale;

    bubble.mesh.scale.setScalar(bubble.baseScale * 0.4);
    bubble.mat.opacity = 0;
    bubble.mesh.visible = true;
  }

  function emit(dt, options = {}) {
    if (!actorRef) return;
    const isBoost = options.isBoost ?? false;
    const scale = options.scale ?? 1;
    const interval = isBoost ? 0.026 : 0.058;

    emitTimer += dt;
    const rotY = actorRef.rotation.y;
    forward.set(-Math.sin(rotY), 0, -Math.cos(rotY));
    right.set(Math.cos(rotY), 0, -Math.sin(rotY));

    const drift = {
      x: -forward.x * (isBoost ? 0.9 : 0.35),
      z: -forward.z * (isBoost ? 0.9 : 0.35)
    };

    while (emitTimer >= interval) {
      emitTimer -= interval;
      emitIndex = (emitIndex + 1) % 5;

      let boneTarget = null;
      let fallbackOffset = null;

      if (emitIndex === 0) {
        boneTarget = bones.leftFlipper;
        fallbackOffset = new T.Vector3().copy(right).multiplyScalar(-0.9 * scale).addScaledVector(forward, -0.2 * scale);
      } else if (emitIndex === 1) {
        boneTarget = bones.rightFlipper;
        fallbackOffset = new T.Vector3().copy(right).multiplyScalar(0.9 * scale).addScaledVector(forward, -0.2 * scale);
      } else if (emitIndex === 2) {
        boneTarget = bones.tail;
        fallbackOffset = new T.Vector3().copy(forward).multiplyScalar(-1.1 * scale);
      } else if (emitIndex === 3) {
        boneTarget = bones.hindLeft;
        fallbackOffset = new T.Vector3().copy(right).multiplyScalar(-0.5 * scale).addScaledVector(forward, -0.8 * scale);
      } else {
        boneTarget = bones.hindRight;
        fallbackOffset = new T.Vector3().copy(right).multiplyScalar(0.5 * scale).addScaledVector(forward, -0.8 * scale);
      }

      if (boneTarget && boneTarget.parent) {
        boneTarget.getWorldPosition(tempPos);
        tempPos.addScaledVector(forward, -0.15 * scale);
      } else if (fallbackOffset) {
        tempPos.copy(actorRef.position).add(fallbackOffset);
        tempPos.y -= 0.1 * scale;
      } else {
        tempPos.copy(actorRef.position).addScaledVector(forward, -0.8 * scale);
      }

      spawnBubble(tempPos, { isBoost, scale, drift });

      if (isBoost) {
        const extraPos = new T.Vector3()
          .copy(actorRef.position)
          .addScaledVector(forward, -0.85 * scale)
          .addScaledVector(right, (Math.random() - 0.5) * 1.1 * scale);
        spawnBubble(extraPos, { isBoost, scale, drift });
      }
    }
  }

  function update(dt) {
    animTime += dt;
    for (let i = 0; i < pool.length; i++) {
      const b = pool[i];
      if (!b.active) continue;

      b.life -= dt;
      if (b.life <= 0) {
        b.active = false;
        b.mesh.visible = false;
        continue;
      }

      const p = 1 - b.life / b.maxLife;

      b.mesh.position.y += b.vy * dt;
      b.mesh.position.x += (b.vx + Math.sin(animTime * b.wobbleFreq + b.wobblePhase) * 0.2) * dt;
      b.mesh.position.z += (b.vz + Math.cos(animTime * b.wobbleFreq + b.wobblePhase) * 0.2) * dt;

      // Scale expands as bubble rises
      const scaleProg = 0.45 + 0.7 * Math.sin(Math.min(1, p * 1.3) * Math.PI * 0.5);
      b.mesh.scale.setScalar(b.baseScale * scaleProg);

      // Opacity: rapid fade in, smooth fade out at end of life
      let alpha = 1;
      if (p < 0.12) {
        alpha = p / 0.12;
      } else if (p > 0.55) {
        alpha = Math.max(0, (1 - p) / 0.45);
      }
      b.mat.opacity = b.initialOpacity * alpha;
    }
  }

  function reset() {
    emitTimer = 0;
    for (const b of pool) {
      b.active = false;
      b.life = 0;
      b.mesh.visible = false;
    }
  }

  function dispose() {
    reset();
    group.removeFromParent();
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    baseMaterial.dispose();
  }

  return {
    group,
    setAnimal,
    emit,
    update,
    reset,
    dispose,
    get activeCount() {
      return pool.filter(b => b.active).length;
    }
  };
}
