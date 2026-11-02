"use client";

import { BRAND_COLORS, STAGE_CLASS, useThreeStage } from "./useThreeStage";

const SEPARATION = 100;
const AMOUNT_X = 60;
const AMOUNT_Y = 40;

// shader
const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute vec2 grid;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    float wx = sin((grid.x + uTime) * 0.3);
    float wy = sin((grid.y + uTime) * 0.5);
    vec3 p = position;
    p.y = (wx + wy) * 50.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = ((wx + 1.0) * 6.0 + (wy + 1.0) * 6.0) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    if (length(gl_PointCoord - vec2(0.5)) > 0.475) discard;
    gl_FragColor = vec4(vColor, 0.55);
  }
`;

/** three.js "points waves" (threejs.org/examples/#webgl_points_waves) in STEM colors. */
export function PointsWave({ className = "" }: { className?: string }) {
  const hostRef = useThreeStage(({ THREE, scene, camera, pointer }) => {
    camera.position.set(0, 350, 1000);

    // points
    const count = AMOUNT_X * AMOUNT_Y;
    const positions = new Float32Array(count * 3);
    const grid = new Float32Array(count * 2);
    const colors = new Float32Array(count * 3);
    const tint = new THREE.Color();
    let i = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        positions[i * 3] = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2;
        positions[i * 3 + 2] = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2;
        grid[i * 2] = ix;
        grid[i * 2 + 1] = iy;
        tint.setHex(BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]).toArray(colors, i * 3);
        i++;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("grid", new THREE.BufferAttribute(grid, 2));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Points(geometry, material));

    return {
      frame(t) {
        material.uniforms.uTime.value = t;
        camera.position.x += (pointer.x * 200 - camera.position.x) * 0.05;
        camera.position.y += (350 + pointer.y * 100 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      },
      dispose() {
        geometry.dispose();
        material.dispose();
      },
    };
  });

  return <div ref={hostRef} aria-hidden className={`${STAGE_CLASS} ${className}`} />;
}
