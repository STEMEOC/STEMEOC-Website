"use client";

import { useEffect, useRef } from "react";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

export type ThreeStage = {
  THREE: typeof import("three");
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  /** Pointer in normalized device coords (-1..1) relative to the host box. */
  pointer: { x: number; y: number; active: boolean };
};

type Build = (stage: ThreeStage) => { frame: (seconds: number) => void; dispose?: () => void };

/**
 * Lazy-loads three.js into the returned host div. Pauses off screen, renders a single
 * still frame for reduced motion, and frees GPU memory on unmount.
 */
export function useThreeStage(build: Build) {
  const hostRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef(build);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
      host.appendChild(renderer.domElement);

      const pointer = { x: 0, y: 0, active: false };
      const { frame, dispose } = buildRef.current({ THREE, scene, camera, renderer, pointer });

      // sizing
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        if (reduceMotion) renderer.render(scene, camera);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      // pointer
      const onPointerMove = (e: PointerEvent) => {
        if (!e.isPrimary) return;
        const rect = host.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        pointer.active = true;
      };

      const loop = (ms: number) => {
        frame(ms / 1000);
        renderer.render(scene, camera);
      };

      const visibility = new IntersectionObserver(([entry]) => {
        renderer.setAnimationLoop(entry.isIntersecting ? loop : null);
      });
      if (reduceMotion) {
        frame(0);
        renderer.render(scene, camera);
      } else {
        window.addEventListener("pointermove", onPointerMove);
        visibility.observe(host);
      }

      cleanup = () => {
        visibility.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        renderer.setAnimationLoop(null);
        dispose?.();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return hostRef;
}

export const BRAND_COLORS = [0x2c80c2, 0xe5262a, 0x14a650, 0xf49423];

/** Full-bleed, non-interactive layer that sits behind hero content. */
export const STAGE_CLASS = "pointer-events-none absolute inset-0 overflow-hidden";
