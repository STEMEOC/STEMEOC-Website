"use client";

import type { Line, LineBasicMaterial } from "three";
import { BRAND_COLORS, STAGE_CLASS, useThreeStage } from "./useThreeStage";

const LINES = 70;
const POINTS = 10;
const STEP = 70;

/** Slowly turning cloud of random lines that light up in STEM colors on hover, after threejs.org/examples/#webgl_interactive_lines. */
export function HoverLines({ className = "" }: { className?: string }) {
  const hostRef = useThreeStage(({ THREE, scene, camera, pointer }) => {
    camera.position.set(0, 0, 900);
    const group = new THREE.Group();
    scene.add(group);

    // lines
    const lines: Line[] = [];
    const point = new THREE.Vector3();
    for (let l = 0; l < LINES; l++) {
      const vertices = new Float32Array(POINTS * 3);
      point.randomDirection().multiplyScalar(Math.random() * 600);
      for (let p = 0; p < POINTS; p++) {
        point.x += (Math.random() - 0.5) * STEP;
        point.y += (Math.random() - 0.5) * STEP;
        point.z += (Math.random() - 0.5) * STEP;
        point.toArray(vertices, p * 3);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });
      const line = new THREE.Line(geometry, material);
      line.userData.hover = BRAND_COLORS[l % BRAND_COLORS.length];
      lines.push(line);
      group.add(line);
    }

    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 8;
    const ndc = new THREE.Vector2();
    let hovered: Line | null = null;

    const setHover = (line: Line | null) => {
      if (line === hovered) return;
      if (hovered) {
        const m = hovered.material as LineBasicMaterial;
        m.color.setHex(0xffffff);
        m.opacity = 0.22;
      }
      if (line) {
        const m = line.material as LineBasicMaterial;
        m.color.setHex(line.userData.hover);
        m.opacity = 1;
      }
      hovered = line;
    };

    return {
      frame(t) {
        group.rotation.y = t * 0.05;
        group.rotation.x = Math.sin(t * 0.1) * 0.2;
        if (!pointer.active) return;
        ndc.set(pointer.x, pointer.y);
        raycaster.setFromCamera(ndc, camera);
        setHover((raycaster.intersectObjects(lines, false)[0]?.object as Line | undefined) ?? null);
      },
      dispose() {
        for (const line of lines) {
          line.geometry.dispose();
          (line.material as LineBasicMaterial).dispose();
        }
      },
    };
  });

  return <div ref={hostRef} aria-hidden className={`${STAGE_CLASS} ${className}`} />;
}
