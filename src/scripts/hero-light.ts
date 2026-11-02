// ファーストビュー、メッセージ、フッターの背景に共通の光。マウスに遅れて追従するぼかしにノイズをかけて描く。
// すべてのキャンバスで同じ座標を使い、1つの光がセクションをまたいで移動するように見せる。
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
uniform vec2 uOrigin, uScale;
uniform vec2 uM[3];
uniform vec3 uDrops[3];
uniform float uTime, uR, uSplit;
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
  vec2 p = uOrigin + v * uScale;
  float t = uTime * 0.07;
  vec2 warp = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.0)) - 0.5;
  vec2 q = p + warp * 0.55;
  float field = fbm(q * 1.1 + vec2(t, -t * 0.6)) * 0.55;
  // 縦長の画面でも光が画面を覆わないよう、幅に合わせて小さくする
  float scale = clamp(uScale.x, 0.55, 1.0);
  float radii[3] = float[3](0.34 * scale, 0.24 * scale, 0.16 * scale);
  float weights[3] = float[3](0.45, 0.3, 0.25);
  float light = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 d = q - uM[i];
    float glow = exp(-dot(d, d) / (radii[i] * radii[i]));
    field += glow * 0.62;
    light += glow * weights[i];
  }
  float c = mix(0.05, 0.6, smoothstep(0.2, 1.5, field));
  // 周囲はグレーのまま、光の中央だけ白くする
  float core = smoothstep(0.45, 0.95, light);
  vec3 col = mix(vec3(c * 0.8, c * 0.99, c * 1.01), vec3(1.0), core) * uR;
  float grain = hash(gl_FragCoord.xy + fract(uTime) * 917.0) - 0.5;
  col += grain * 0.185 * (1.0 - core);
  // 境界のないキャンバスは暗い面だけを描く
  if (uSplit < 0.5) {
    o = vec4(col, 1.0);
    return;
  }
  // 反転した側は周囲を白に近づけ、最も濃い中央を gray-300 までに抑える
  vec3 inverted = mix(vec3(0.85, 0.95, 0.95), vec3(1.0), 1.0 - clamp(col, 0.0, 1.0));
  // 境界（p.y = 1.0）は常に直線。光が跨いだときだけ、その地点の線を渦でちぎって上下を混ぜ、直線へ戻す
  float below = step(1.0, p.y);
  float shift = 0.0;
  float blur = 0.0;
  for (int i = 0; i < 3; i++) {
    float age = (uTime - uDrops[i].y) / 1.5;
    if (age < 0.0 || age > 1.0 || abs(p.y - 1.0) > 0.4) continue;
    float width = (0.04 + 0.01 * (1.0 - pow(1.0 - age, 3.0))) * scale;
    float dx = p.x - uDrops[i].x;
    float env = exp(-dx * dx / (width * width)) * smoothstep(0.0, 0.12, age) * (1.0 - age * age);
    if (env < 0.003) continue;
    vec2 seed = p * vec2(3.0, 2.0) + uDrops[i].y * 3.7 + vec2(0.0, age * 0.6 * uDrops[i].z);
    vec2 swirl = vec2(fbm(seed + t), fbm(seed - t + 7.0)) - 0.5;
    float strands = fbm(p * vec2(5.0, 2.0) + swirl * 5.0 + uDrops[i].y) - 0.47;
    shift += (strands * 0.5 + uDrops[i].z * 0.08) * env;
    blur = max(blur, env * 0.1);
  }
  float soft = blur + 0.0001;
  float water = smoothstep(-soft, soft, p.y - 1.0 - shift);
  // 混ざる色は光に左右されないよう固定する。下の面には黒、上の面には白が入り込む
  o = vec4(mix(mix(col, inverted, below), mix(vec3(1.0), vec3(0.06, 0.07, 0.08), below), abs(water - below)), 1.0);
}`;

const FADE_MS = 1500;
const INTRO_MS = 1500;
const MAX_DPR = 1.5;
const DROP_GAP_S = 0.25;

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

function createView(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl) return null;
  const program = createProgram(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1f(gl.getUniformLocation(program, 'uSplit'), canvas.dataset.heroLight === 'solid' ? 0 : 1);

  const view = {
    canvas,
    gl,
    uOrigin: gl.getUniformLocation(program, 'uOrigin'),
    uScale: gl.getUniformLocation(program, 'uScale'),
    uM: gl.getUniformLocation(program, 'uM'),
    uDrops: gl.getUniformLocation(program, 'uDrops'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uR: gl.getUniformLocation(program, 'uR'),
    visible: false,
  };
  new IntersectionObserver(([entry]) => {
    view.visible = entry?.isIntersecting ?? true;
  }).observe(canvas);
  return view;
}

function start(hero: HTMLCanvasElement, canvases: HTMLCanvasElement[]) {
  const views = canvases.flatMap((canvas) => createView(canvas) ?? []);
  if (views.length > 0) document.documentElement.classList.add('has-light');

  // 座標の単位は先頭のキャンバス（ホームではファーストビュー）の高さ。原点はその左上
  let unit = 1;
  let heroTop = 0;
  const layout = () => {
    const heroRect = hero.getBoundingClientRect();
    unit = heroRect.height;
    heroTop = heroRect.top + scrollY;
    const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
    for (const { canvas, gl, uOrigin, uScale } of views) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uOrigin, (rect.left - heroRect.left) / unit, (rect.top - heroRect.top) / unit);
      gl.uniform2f(uScale, rect.width / unit, rect.height / unit);
    }
  };
  layout();
  // キャンバスを消すのは描き直す直前にして、白飛びを防ぐ
  let stale = false;
  const observer = new ResizeObserver(() => {
    stale = true;
  });
  canvases.forEach((canvas) => observer.observe(canvas));
  // 画像の読み込みなどでページの高さが変わると、フッターの座標がずれる
  observer.observe(document.body);

  const target = { x: (0.68 * hero.clientWidth) / unit, y: 0.38 };
  // マウスは画面上の位置を覚え、スクロールしてもカーソルの下に光を置く。タッチは触れた場所に留める
  const mouse = { clientY: 0, active: false };
  addEventListener(
    'pointermove',
    (event) => {
      target.x = event.clientX / unit;
      target.y = (event.clientY + scrollY - heroTop) / unit;
      mouse.clientY = event.clientY;
      mouse.active = event.pointerType !== 'touch';
    },
    { passive: true },
  );

  // rate は1秒あたりの追従の速さ。フレームレートが変わっても同じ速さで動く
  const lead = { x: target.x, y: target.y, rate: 9 };
  const followers = [{ x: target.x, y: target.y, rate: 2.1 }, { x: target.x, y: target.y, rate: 4.4 }, lead];
  const positions = new Float32Array(followers.length * 2);
  // インクは x、開始時刻、進行方向（下が1、上が-1）の組で持つ。最初は再生済みの時刻にしておく
  const drops = new Float32Array([0, -100, 1, 0, -100, 1, 0, -100, 1]);
  let nextDrop = 0;
  let lastDrop = -100;
  let leadBelow = lead.y >= 1;
  const introPlays = document.querySelector('.intro') && !document.documentElement.classList.contains('intro-seen');
  let fadeStart = introPlays ? INTRO_MS : null;
  let previous = performance.now();

  const frame = (now: number) => {
    requestAnimationFrame(frame);
    const elapsed = Math.min(now - previous, 100) / 1000;
    previous = now;
    if (mouse.active) target.y = (mouse.clientY + scrollY - heroTop) / unit;
    followers.forEach((follower, i) => {
      const k = 1 - Math.exp(-follower.rate * elapsed);
      follower.x += (target.x - follower.x) * k;
      follower.y += (target.y - follower.y) * k;
      positions[i * 2] = follower.x;
      positions[i * 2 + 1] = follower.y;
    });
    const below = lead.y >= 1;
    if (below !== leadBelow) {
      leadBelow = below;
      if (now / 1000 - lastDrop > DROP_GAP_S) {
        lastDrop = now / 1000;
        drops.set([lead.x, lastDrop, below ? 1 : -1], nextDrop * 3);
        nextDrop = (nextDrop + 1) % 3;
      }
    }
    if (!views.some((view) => view.visible)) return;
    if (stale) {
      stale = false;
      layout();
    }
    fadeStart ??= now;
    const reveal = smoothstep(fadeStart, fadeStart + FADE_MS, now);
    for (const { gl, uM, uDrops, uTime, uR, visible } of views) {
      if (!visible) continue;
      gl.uniform2fv(uM, positions);
      gl.uniform3fv(uDrops, drops);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uR, reveal);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };
  requestAnimationFrame(frame);
}

const canvases = [...document.querySelectorAll<HTMLCanvasElement>('[data-hero-light]')];
const hero = canvases[0];
if (hero && !matchMedia('(prefers-reduced-motion: reduce)').matches) start(hero, canvases);

export {};
