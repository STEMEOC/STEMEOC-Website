"use client";

import { BRAND_COLORS, STAGE_CLASS, useThreeStage } from "./useThreeStage";

const COUNT = 140;
const BOX = { x: 1800, y: 900, z: 500 };
const MIN_DISTANCE = 220;

/** three.js "drawrange" network (threejs.org/examples/#webgl_buffergeometry_drawrange): drifting dots that link when close. */
export function NetworkLines({ className = "" }: { className?: string }) {
  const hostRef = useThreeStage(({ THREE, scene, camera, pointer }) => {
    camera.position.set(0, 0, 900);
    const group = new THREE.Group();
    scene.add(group);

    // dots
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const tint = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOX.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOX.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOX.z;
      velocities[i * 3] = (Math.random() - 0.5) * 1.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      tint.setHex(BRAND_COLORS[i % BRAND_COLORS.length]).toArray(colors, i * 3);
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const dotMaterial = new THREE.PointsMaterial({ size: 7, vertexColors: true, transparent: true, opacity: 0.9 });
    group.add(new THREE.Points(dotGeometry, dotMaterial));

    // links
    const maxSegments = (COUNT * (COUNT - 1)) / 2;
    const linePositions = new Float32Array(maxSegments * 6);
    const lineColors = new Float32Array(maxSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    const half = { x: BOX.x / 2, y: BOX.y / 2, z: BOX.z / 2 };
    const limits = [half.x, half.y, half.z];

    return {
      frame() {
        for (let i = 0; i < COUNT * 3; i++) {
          positions[i] += velocities[i];
          const limit = limits[i % 3];
          if (positions[i] < -limit || positions[i] > limit) velocities[i] = -velocities[i];
        }

        let v = 0;
        for (let a = 0; a < COUNT; a++) {
          for (let b = a + 1; b < COUNT; b++) {
            const dx = positions[a * 3] - positions[b * 3];
            const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
            const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist >= MIN_DISTANCE) continue;
            // additive blending: darker color reads as more transparent
            const alpha = (1 - dist / MIN_DISTANCE) * 0.6;
            for (const [k, p] of [[0, a], [3, b]]) {
              linePositions[v * 3 + k] = positions[p * 3];
              linePositions[v * 3 + k + 1] = positions[p * 3 + 1];
              linePositions[v * 3 + k + 2] = positions[p * 3 + 2];
              lineColors[v * 3 + k] = colors[p * 3] * alpha;
              lineColors[v * 3 + k + 1] = colors[p * 3 + 1] * alpha;
              lineColors[v * 3 + k + 2] = colors[p * 3 + 2] * alpha;
            }
            v += 2;
          }
        }
        lineGeometry.setDrawRange(0, v);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;
        dotGeometry.attributes.position.needsUpdate = true;

        group.rotation.y += (pointer.x * 0.25 - group.rotation.y) * 0.03;
        group.rotation.x += (-pointer.y * 0.15 - group.rotation.x) * 0.03;
      },
      dispose() {
        dotGeometry.dispose();
        dotMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
      },
    };
  });

  return <div ref={hostRef} aria-hidden className={`${STAGE_CLASS} ${className}`} />;
}
