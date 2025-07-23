"use client";

import { Color } from "three";
import { AnimatedSphere } from "./components/animated-sphere";
import { ORB_PROPS_TYPE } from "./constants";

function OrbApp() {
  //   one orb
  const initialColors = [
    new Color(1.0, 1.0, 1.0), // #FFFFFF
    new Color(0.3613067797729723, 0.4396571738310091, 0.5583403896257968), // #A2B1C5
    new Color(0.5906188409113381, 0.6444796819634361, 0.76052450467022), // #CAD2E2
    new Color(0.76052450467022, 0.7991027380100881, 0.85499260812105), // #E2E7EE
    new Color(1.0, 1.0, 1.0), // #FFFFFF
  ];

  const orbProps: ORB_PROPS_TYPE = {
    colors: initialColors,
    rotationSpeed: 0.0001,
    intensity: 0,
    interval: 0.25,
    blendValue: 0.3,
    shadersSpeed: 2,
    noise1: 4,
    noise2: 1,
    distance: 1,
  };

  return (
    <>
      <AnimatedSphere orbProps={orbProps} />
    </>
  );
}

export default OrbApp;
