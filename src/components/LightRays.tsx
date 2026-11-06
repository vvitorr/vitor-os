"use client";

import { useEffect, useRef } from "react";

// Animated light-ray wallpaper: one fullscreen fragment shader, raw WebGL, no deps.
const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 d = uv - vec2(0.5, 1.15);
  d.x *= r.x / r.y;
  float a = atan(d.x, -d.y);
  float ray = pow(0.5 + 0.5 * sin(a * 14.0 + t * 0.35), 3.0) * 0.6
            + pow(0.5 + 0.5 * sin(a * 23.0 - t * 0.27 + 1.3), 4.0) * 0.5
            + pow(0.5 + 0.5 * sin(a * 7.0 + t * 0.18 + 2.1), 2.0) * 0.4;
  float fall = exp(-length(d) * 1.35);
  vec3 col = mix(vec3(0.55, 0.36, 0.96), vec3(0.02, 0.71, 0.83), uv.x);
  col = mix(col, vec3(0.93, 0.29, 0.6), smoothstep(0.6, 0.0, uv.y) * 0.5);
  gl_FragColor = vec4(col * ray * fall * 0.9, 1.0);
}`;
const VERT = "attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }";

export default function LightRays() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return; // CSS mesh backdrop stays as fallback
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const draw = (now: number) => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      const w = Math.round(innerWidth * dpr);
      const h = Math.round(innerHeight * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uR, w, h);
      gl.uniform1f(uT, still ? 4 : now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => still && requestAnimationFrame(draw);
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} className="wallpaper" aria-hidden />;
}
