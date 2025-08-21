"use client";

import { useEffect, useRef } from "react";
import { App } from "../three/App";
import { ORB_PROPS_TYPE } from "@/components/orb/constants";
import { useContainerSize } from "@/hooks/useContainerSize";

interface AnimatedSphereProps {
  orbProps: ORB_PROPS_TYPE;
}

export const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ orbProps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const appRef = useRef<App | null>(null);

  // Ініціалізація App
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    // Чекаємо поки контейнер буде готовий
    const container = containerRef.current;
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      // Якщо розмір ще не відомий, чекаємо
      const observer = new ResizeObserver(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          observer.disconnect();
          initializeApp();
        }
      });
      observer.observe(container);
      return () => observer.disconnect();
    } else {
      initializeApp();
    }

    function initializeApp() {
      try {
        const app = new App(
          orbProps.colors,
          orbProps.rotationSpeed,
          orbProps.intensity,
          orbProps.interval,
          orbProps.blendValue,
          orbProps.shadersSpeed,
          orbProps.noise1,
          orbProps.noise2,
          orbProps.distance
        );

        if (containerRef.current) {
          app.mount(containerRef.current);
          app.start();
          appRef.current = app;
        }
      } catch (error) {
        console.error("Failed to initialize Three.js app:", error);
      }
    }

    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [
    orbProps.blendValue,
    orbProps.colors,
    orbProps.distance,
    orbProps.intensity,
    orbProps.interval,
    orbProps.noise1,
    orbProps.noise2,
    orbProps.rotationSpeed,
    orbProps.shadersSpeed,
  ]);

  // Оновлення налаштувань сфери при зміні пропсів
  useEffect(() => {
    const current = appRef.current;
    if (!current) return;

    try {
      current.mesh.setColors(orbProps.colors);
      current.rotationSpeed = orbProps.rotationSpeed;
      current.mesh.setIntensity(orbProps.intensity);
      current.mesh.setInterval(orbProps.interval);
      current.mesh.setBlendValue(orbProps.blendValue);
      current.mesh.setShaderSpeed(orbProps.shadersSpeed);
      current.mesh.setFirstNoise(orbProps.noise1);
      current.mesh.setSecondNoise(orbProps.noise2);
      current.mesh.setDistance(orbProps.distance);
    } catch (error) {
      console.error("Failed to update orb properties:", error);
    }
  }, [orbProps]);

  // Оновлення canvas при зміні розміру контейнера
  useEffect(() => {
    const current = appRef.current;
    if (!current || !size.width || !size.height) return;

    try {
      current.onResize();
    } catch (error) {
      console.error("Failed to resize Three.js app:", error);
    }
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "90%",
        maxWidth: "400px",
        height: "auto",
        aspectRatio: "1 / 1",
        margin: "0 auto",
      }}
    />
  );
};
