import { noiseFunctions } from "./NoiseShaider";
import { simplexNoiseFunctions } from "./SimplexNoiseShader";

const vertexShader = `
varying vec2 vUv;
varying float vDisplacement;
uniform float time;
uniform float intensity;
uniform float shaderSpeed;
uniform float distance;

${noiseFunctions}

void main() {
    vUv = uv;
  
    vDisplacement = cnoise(position + vec3(shaderSpeed * time));

    vec3 newPosition = position + normal * (intensity * vDisplacement);

    vec4 modelPosition = modelMatrix * vec4(newPosition, distance); // can change distance to the orb 
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}
`;

const fragmentShader = `
uniform float time;
uniform float interval;
uniform float blendValue;
uniform float firstNoise;
uniform float secondNoise;
varying vec2 vUv;
varying float vDisplacement;
uniform vec3 colors[5];

${simplexNoiseFunctions}

vec3 gradient5(float f, vec3 colors[5]) 
{
    int index = int(f / interval);
    float t = (f - float(index) * interval) / interval;

    vec3 color1 = colors[index];
    vec3 color2 = colors[index + 1];
    
    return mix(color1, color2, t);
}

void main() {
    float noise1 = (snoise(vUv.xy * firstNoise + time * 0.5) + 1.) * .5;
    float noise2 = (snoise(-vUv.xy * 2. + time) + secondNoise) * .2;

    vec3 color0 = gradient5(vUv.y, colors);
    vec3 color1 = gradient5(min(noise1 + 0.5, 1.), colors);
    vec3 color2 = gradient5(max(noise2 - 0.5, 0.), colors);

    float s = (sin(time * 3.) + 1.) * blendValue;
    vec3 color = mix(color0, mix(color1, color2, s), vDisplacement);

    gl_FragColor = vec4(color * 1.15, 1.0);
}
`;

export { vertexShader, fragmentShader };
