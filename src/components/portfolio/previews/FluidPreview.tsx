import { useEffect, useRef } from "react";

import { isReducedMotion } from "@/lib/motion";

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uForce;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<6;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec2 m = (uMouse - 0.5*uRes) / uRes.y;

  // Swirl around the cursor.
  vec2 d = uv - m;
  float r = length(d);
  float swirl = uForce * exp(-r*r*7.0) * 3.0;
  float s = sin(swirl), c = cos(swirl);
  uv = m + mat2(c,-s,s,c) * d;

  float t = uTime * 0.12;
  vec2 q = vec2(fbm(uv*1.6 + t), fbm(uv*1.6 + vec2(5.2,1.3) - t));
  vec2 w = vec2(fbm(uv*1.6 + 4.0*q + vec2(1.7,9.2) + t*1.3), fbm(uv*1.6 + 4.0*q + vec2(8.3,2.8) - t));
  float f = fbm(uv*1.6 + 4.0*w);

  vec3 raven = vec3(0.047, 0.051, 0.063);
  vec3 powder = vec3(0.643, 0.784, 0.882);
  vec3 poppy = vec3(1.0, 0.2, 0.267);

  vec3 col = mix(raven, powder*0.55, smoothstep(0.2, 0.9, f));
  col = mix(col, powder, smoothstep(0.55, 1.0, length(q)) * 0.6);
  col = mix(col, poppy, smoothstep(0.62, 0.95, w.x) * 0.75);
  col += poppy * exp(-r*r*30.0) * uForce * 0.35;
  col *= 0.75 + 0.5*f;
  // Vignette
  col *= 1.0 - 0.45*dot(uv*0.8, uv*0.8);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function FluidPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // A fresh canvas per mount: a lost context can never be reused on remount.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uForce = gl.getUniformLocation(prog, "uForce");

    // Render at reduced resolution: the field is soft, so this saves a lot of GPU.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    let force = 0.3;
    let targetForce = 0.3;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = 1 - (e.clientY - r.top) / r.height;
      const speed = Math.hypot(nx - target.x, ny - target.y);
      target.x = nx;
      target.y = ny;
      const calm = isReducedMotion();
      targetForce = Math.min(calm ? 0.8 : 2.5, targetForce + speed * (calm ? 3 : 12));
    };
    canvas.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const loop = (now: number) => {
      // Reduced motion slows the flow to a gentle drift.
      time += (Math.min(0.05, (now - last) / 1000)) * (isReducedMotion() ? 0.25 : 1);
      last = now;
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      targetForce += (0.3 - targetForce) * 0.03;
      force += (targetForce - force) * 0.1;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x * canvas.width, mouse.y * canvas.height);
      gl.uniform1f(uForce, force);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={ref} className="h-full w-full" />;
}
