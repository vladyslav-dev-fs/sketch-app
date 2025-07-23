import {
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
  Color,
  Vector3,
} from "three";

import { vertexShader, fragmentShader } from "./SphereShader";

export class SphereMesh extends Mesh {
  constructor(
    colors: Color[],
    intensity: number,
    interval: number,
    blendValue: number,
    shaderSpeed: number,
    noise1: number,
    noise2: number,
    distance: number
  ) {
    super(
      new IcosahedronGeometry(2, 20),
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0.0 },
          intensity: { value: intensity },
          colors: { value: [] },
          blendValue: { value: blendValue },
          shaderSpeed: { value: shaderSpeed },
          interval: { value: interval },
          firstNoise: { value: noise1 },
          secondNoise: { value: noise2 },
          distance: { value: distance },
        },
        wireframe: false,
      })
    );

    this.setColors(colors);
  }

  setColors(colors: Color[]) {
    this.updateColors(colors);
  }

  updateColors(colors: Color[]) {
    const colorArray: Vector3[] = colors.map(
      (color) => new Vector3(color.r, color.g, color.b)
    );
    (this.material as ShaderMaterial).uniforms.colors.value = colorArray;
  }

  setIntensity(intensity: number) {
    (this.material as ShaderMaterial).uniforms.intensity.value = intensity;
  }

  setInterval(interval: number) {
    (this.material as ShaderMaterial).uniforms.interval.value = interval;
  }

  setBlendValue(blendValue: number) {
    (this.material as ShaderMaterial).uniforms.blendValue.value = blendValue;
  }

  setShaderSpeed(shaderSpeed: number) {
    (this.material as ShaderMaterial).uniforms.shaderSpeed.value = shaderSpeed;
  }

  setFirstNoise(newNoise: number) {
    (this.material as ShaderMaterial).uniforms.firstNoise.value = newNoise;
  }

  setSecondNoise(newNoise: number) {
    (this.material as ShaderMaterial).uniforms.secondNoise.value = newNoise;
  }

  setDistance(newDistance: number) {
    (this.material as ShaderMaterial).uniforms.distance.value = newDistance;
  }
}
