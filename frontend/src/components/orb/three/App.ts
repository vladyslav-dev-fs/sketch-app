"use client";

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  ShaderMaterial,
  Clock,
  Color,
} from "three";
import { SphereMesh } from "./Sphere";

export class App {
  scene: Scene;
  renderer?: WebGLRenderer;
  camera: PerspectiveCamera;
  mesh: SphereMesh;
  clock: Clock;
  rotationSpeed: number;
  colors: Color[];
  intensity: number;
  interval: number;
  blendValue: number;
  shaderSpeed: number;
  noise1: number;
  noise2: number;
  distance: number;
  isMobile: boolean;
  private resizeObserver?: ResizeObserver;
  private container?: HTMLElement;

  constructor(
    colors: Color[],
    rotationSpeed: number = 0.0001,
    intensity: number = 0,
    interval: number = 0.25,
    blendValue: number = 0.3,
    shaderSpeed: number,
    noise1: number,
    noise2: number,
    distance: number
  ) {
    this.isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    this.colors = colors;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, 1, 1, 1000);
    this.camera.position.set(0, 0, 50);
    this.clock = new Clock();
    this.intensity = intensity;
    this.interval = interval;
    this.blendValue = blendValue;
    this.shaderSpeed = shaderSpeed;
    this.noise1 = noise1;
    this.noise2 = noise2;
    this.distance = distance;
    this.rotationSpeed = rotationSpeed;

    this.mesh = new SphereMesh(
      this.colors,
      this.intensity,
      this.interval,
      this.blendValue,
      this.shaderSpeed,
      this.noise1,
      this.noise2,
      this.distance
    );
    this.mesh.scale.setScalar(12);
    this.scene.add(this.mesh);
  }

  mount(container?: HTMLElement) {
    if (!container || this.renderer) return;

    this.container = container;

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);

    const canvas = this.renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    container.prepend(canvas);

    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
    this.resizeObserver.observe(canvas);

    this.start(); // Start animation after mounting
  }

  onResize() {
    if (!this.renderer || !this.container) return;

    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start() {
    this.clock.start();
    this.renderer?.setAnimationLoop(this.update.bind(this));
  }

  stop() {
    this.clock.stop();
    this.renderer?.setAnimationLoop(null);
  }

  update() {
    const delta = this.clock.getDelta();
    const material = this.mesh.material as ShaderMaterial;
    const uniforms = material.uniforms;

    uniforms.time.value = this.clock.elapsedTime * 0.1;
    this.mesh.rotation.y += delta * this.rotationSpeed;
    this.render();
  }

  render() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    this.stop();
    this.renderer?.dispose();
    this.resizeObserver?.disconnect();
    this.container = undefined;
  }

  initializeSphere() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }

    this.mesh = new SphereMesh(
      this.colors,
      this.intensity,
      this.blendValue,
      this.shaderSpeed,
      this.interval,
      this.noise1,
      this.noise2,
      this.distance
    );
    this.mesh.scale.setScalar(12);
    this.scene.add(this.mesh);
  }
}
