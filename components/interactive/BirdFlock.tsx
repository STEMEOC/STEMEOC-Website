"use client";

import { BRAND_COLORS, STAGE_CLASS, useThreeStage } from "./useThreeStage";

const COUNT = 220;
const BOX = { x: 1600, y: 760, z: 500 };
const NEIGHBOR = 90;
const MIN_SPEED = 2;
const MAX_SPEED = 4.5;
const REPEL = 220;

/** Flocking birds that scatter from the cursor, after threejs.org/examples/#webgl_gpgpu_birds (CPU boids instead of GPGPU). */
export function BirdFlock({ className = "" }: { className?: string }) {
  const hostRef = useThreeStage(({ THREE, scene, camera, pointer }) => {
    camera.position.set(0, 0, 900);

    const geometry = new THREE.ConeGeometry(4, 18, 3).rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial();
    const birds = new THREE.InstancedMesh(geometry, material, COUNT);
    birds.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(birds);

    const pos: InstanceType<typeof THREE.Vector3>[] = [];
    const vel: InstanceType<typeof THREE.Vector3>[] = [];
    const tint = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * BOX.x,
          (Math.random() - 0.5) * BOX.y,
          (Math.random() - 0.5) * BOX.z,
        ),
      );
      vel.push(new THREE.Vector3().randomDirection().multiplyScalar(MAX_SPEED));
      birds.setColorAt(i, tint.setHex(BRAND_COLORS[i % BRAND_COLORS.length]));
    }

    const dummy = new THREE.Object3D();
    const steer = new THREE.Vector3();
    const align = new THREE.Vector3();
    const center = new THREE.Vector3();
    const away = new THREE.Vector3();
    const cursor = new THREE.Vector3();
    const halfHeight = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    return {
      frame() {
        cursor.set(pointer.x * halfHeight * camera.aspect, pointer.y * halfHeight, 0);

        for (let i = 0; i < COUNT; i++) {
          const p = pos[i];
          align.set(0, 0, 0);
          center.set(0, 0, 0);
          away.set(0, 0, 0);
          let neighbors = 0;

          for (let j = 0; j < COUNT; j++) {
            if (i === j) continue;
            const d = p.distanceTo(pos[j]);
            if (d > NEIGHBOR) continue;
            align.add(vel[j]);
            center.add(pos[j]);
            if (d < NEIGHBOR / 3) away.addScaledVector(steer.subVectors(p, pos[j]), 1 / (d + 0.01));
            neighbors++;
          }

          const v = vel[i];
          if (neighbors) {
            v.addScaledVector(align.divideScalar(neighbors).sub(v), 0.04);
            v.addScaledVector(center.divideScalar(neighbors).sub(p), 0.004);
            v.addScaledVector(away, 0.8);
          }

          // cursor repel
          if (pointer.active) {
            const d = p.distanceTo(cursor);
            if (d < REPEL) v.addScaledVector(steer.subVectors(p, cursor).normalize(), (1 - d / REPEL) * 1.5);
          }

          // soft walls
          if (Math.abs(p.x) > BOX.x / 2) v.x -= Math.sign(p.x) * 0.15;
          if (Math.abs(p.y) > BOX.y / 2) v.y -= Math.sign(p.y) * 0.15;
          if (Math.abs(p.z) > BOX.z / 2) v.z -= Math.sign(p.z) * 0.15;

          const speed = v.length();
          if (speed > MAX_SPEED) v.multiplyScalar(MAX_SPEED / speed);
          else if (speed < MIN_SPEED) v.multiplyScalar(MIN_SPEED / (speed || 1));
        }

        for (let i = 0; i < COUNT; i++) {
          pos[i].add(vel[i]);
          dummy.position.copy(pos[i]);
          dummy.lookAt(steer.addVectors(pos[i], vel[i]));
          dummy.updateMatrix();
          birds.setMatrixAt(i, dummy.matrix);
        }
        birds.instanceMatrix.needsUpdate = true;
      },
      dispose() {
        geometry.dispose();
        material.dispose();
        birds.dispose();
      },
    };
  });

  return <div ref={hostRef} aria-hidden className={`${STAGE_CLASS} ${className}`} />;
}
