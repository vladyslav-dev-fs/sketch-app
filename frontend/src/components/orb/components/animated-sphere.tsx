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

  // Ініціалізація App (лише 1 раз)
  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

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

    app.mount(containerRef.current);
    app.start();
    appRef.current = app;

    return () => {
      app.dispose();
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

    current.mesh.setColors(orbProps.colors);
    current.rotationSpeed = orbProps.rotationSpeed;
    current.mesh.setIntensity(orbProps.intensity);
    current.mesh.setInterval(orbProps.interval);
    current.mesh.setBlendValue(orbProps.blendValue);
    current.mesh.setShaderSpeed(orbProps.shadersSpeed);
    current.mesh.setFirstNoise(orbProps.noise1);
    current.mesh.setSecondNoise(orbProps.noise2);
    current.mesh.setDistance(orbProps.distance);
  }, [orbProps]);

  // Оновлення canvas при зміні розміру контейнера
  useEffect(() => {
    const current = appRef.current;
    if (!current || !size.width || !size.height) return;

    current.onResize();
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
