// ファーストビューの光。マウスに遅れて追従するぼかしにノイズをかけて描く。
const VERTEX = `#version 300 es
in vec2 p;
out vec2 v;
void main() {
  v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 v;
out vec4 o;
uniform vec2 uRes;
uniform vec2 uM[3];
uniform float uTime, uR;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 11.0; a *= 0.5; }
  return s;
}
void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(v.x * aspect, v.y);
  float t = uTime * 0.07;
  vec2 warp = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.0)) - 0.5;
  vec2 q = p + warp * 0.55;
  float field = fbm(q * 1.1 + vec2(t, -t * 0.6)) * 0.55;
  // 縦長の画面でも光が画面を覆わないよう、幅に合わせて小さくする
  float scale = clamp(aspect, 0.55, 1.0);
  float radii[3] = float[3](0.34 * scale, 0.24 * scale, 0.16 * scale);
  float weights[3] = float[3](0.45, 0.3, 0.25);
  float light = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 d = q - vec2(uM[i].x * aspect, uM[i].y);
    float glow = exp(-dot(d, d) / (radii[i] * radii[i]));
    field += glow * 0.62;
    light += glow * weights[i];
  }
  float c = mix(0.05, 0.8, smoothstep(0.2, 1.5, field));
  // 周囲はグレーのまま、光の中央だけ白くする
  float core = smoothstep(0.45, 0.95, light);
  vec3 col = mix(vec3(c * 0.98, c * 0.99, c * 1.01), vec3(1.0), core) * uR;
  float grain = hash(gl_FragCoord.xy + fract(uTime) * 917.0) - 0.5;
  col += grain * 0.185 * (1.0 - core);
  o = vec4(col, 1.0);
}`;

const FADE_MS = 1500;
const INTRO_MS = 1500;
const MAX_DPR = 1.5;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function createProgram(gl: WebGL2RenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('シェーダーを作成できません');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? '');
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? '');
  gl.useProgram(program);
  return program;
}

function start(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  const program = createProgram(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uM = gl.getUniformLocation(program, 'uM');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uR = gl.getUniformLocation(program, 'uR');

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  const target = { x: 0.68, y: 0.38 };
  let lastMove = -Infinity;
  addEventListener(
    'pointermove',
    (event) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = (event.clientY - rect.top) / rect.height;
      lastMove = performance.now();
    },
    { passive: true },
  );

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  }).observe(canvas);

  // rate は1秒あたりの追従の速さ。フレームレートが変わっても同じ速さで動く
  const followers = [
    { x: target.x, y: target.y, rate: 2.1 },
    { x: target.x, y: target.y, rate: 4.4 },
    { x: target.x, y: target.y, rate: 9 },
  ];
  const positions = new Float32Array(followers.length * 2);
  const introSeen = document.documentElement.classList.contains('intro-seen');
  let fadeStart = introSeen ? null : INTRO_MS;
  let previous = performance.now();

  const frame = (now: number) => {
    requestAnimationFrame(frame);
    const elapsed = Math.min(now - previous, 100) / 1000;
    previous = now;
    if (!visible) return;
    fadeStart ??= now;
    // 操作がない間はゆっくり漂わせる
    if (now - lastMove > 2500) {
      target.x = 0.66 + Math.sin(now * 0.00031) * 0.22;
      target.y = 0.4 + Math.cos(now * 0.00043) * 0.24;
    }
    followers.forEach((follower, i) => {
      const k = 1 - Math.exp(-follower.rate * elapsed);
      follower.x += (target.x - follower.x) * k;
      follower.y += (target.y - follower.y) * k;
      positions[i * 2] = follower.x;
      positions[i * 2 + 1] = follower.y;
    });
    gl.uniform2fv(uM, positions);
    gl.uniform1f(uTime, now / 1000);
    gl.uniform1f(uR, smoothstep(fadeStart, fadeStart + FADE_MS, now));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  requestAnimationFrame(frame);
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-light]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gl = canvas && !reduced ? canvas.getContext('webgl2', { antialias: false }) : null;
if (canvas && gl) start(canvas, gl);

export {};
