import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { heroInput } from "@/lib/hero-input";
import { palette } from "@/lib/palette";

/* Feel constants */
const SPRING = 7; // pull flowers back to rest position
const DAMP = 3.4; // velocity damping
const IMPULSE = 4.5; // click push strength
const PULSE = 3.4; // click -> petals open wider, then spring back
const BLOOM_SPRING = 24;
const BLOOM_DAMP = 4.5;
const SPIN_FROM_SPEED = 0.12; // cursor velocity -> flower spin
const SPIN_DECAY = 1.4;
const HEAD_TILT = 0.38; // flower heads turn toward the cursor
const BREATHE = 0.06; // idle opening/closing of petals
const PETAL_FALL = 0.22; // loose petals drift down
const PETAL_FLUTTER = 0.35;
const CAM_SCROLL_Z = 5;
const CAM_SCROLL_Y = 3;

/**
 * Reduced-motion multipliers: each value is the share of full-motion amplitude
 * kept when reduced motion is on. Blended by heroInput.calm (0 full, 1 reduced).
 */
const CALM = {
  impulse: 0.15,
  pulse: 0.3,
  clickSpin: 0,
  cursorSpin: 0,
  drift: 0.3,
  breathe: 0.3,
  bob: 0.25,
  headTilt: 0.3,
  tilt: 0.25,
  scrollTurn: 0.3,
  parallax: 0.2,
  camScroll: 0.4,
  follow: 0.45,
  lightSpeed: 0,
  ripple: 0.45,
  dust: 0.3,
  fall: 0.3,
  flutter: 0.25,
};
/** Full-motion value scaled toward its reduced share. */
const amp = (share: number) => 1 + (share - 1) * heroInput.calm;

/* ------------------------------------------------------------------ */
/* Geometry & materials                                                */
/* ------------------------------------------------------------------ */

/**
 * One sculpted petal: base at the origin, growing along +Y, edges cupped toward -Z
 * and the tip curling toward +Z. Rotating it about X opens it away from the stem.
 */
function makePetalGeometry(cup = 0.34, curl = 0.3) {
  const U = 22;
  const V = 12;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= U; i++) {
    const u = i / U;
    const w = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.6) * (0.5 + 0.5 * u);
    for (let j = 0; j <= V; j++) {
      const v = (j / V) * 2 - 1;
      const x = v * w * 0.5;
      const ripple = Math.sin(v * Math.PI * 1.5 + u * 5) * 0.018 * u;
      const z = -cup * v * v * w + curl * u * u + ripple;
      pos.push(x, u, z);
      uv.push(j / V, u);
    }
  }
  for (let i = 0; i < U; i++) {
    for (let j = 0; j < V; j++) {
      const a = i * (V + 1) + j;
      const b = a + V + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setIndex(idx);
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

type MatKey = "chrome" | "glass" | "poppy" | "pearl";

function useMaterials() {
  const mats = useMemo<Record<MatKey, THREE.MeshPhysicalMaterial>>(
    () => ({
      // Liquid chrome with a powder-blue sheen.
      chrome: new THREE.MeshPhysicalMaterial({
        color: "#e9eff5",
        metalness: 1,
        roughness: 0.07,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        iridescence: 0.4,
        iridescenceIOR: 1.6,
        sheen: 0.6,
        sheenColor: new THREE.Color(palette.powder),
        sheenRoughness: 0.35,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
      }),
      // Glass flora.
      glass: new THREE.MeshPhysicalMaterial({
        color: "#eaf3fa",
        transmission: 1,
        thickness: 0.45,
        roughness: 0.05,
        ior: 1.42,
        iridescence: 0.85,
        iridescenceIOR: 1.3,
        clearcoat: 1,
        attenuationColor: new THREE.Color(palette.powder),
        attenuationDistance: 1.4,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
      }),
      // Poppy-red lacquered chrome.
      poppy: new THREE.MeshPhysicalMaterial({
        color: palette.poppy,
        metalness: 0.7,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        emissive: new THREE.Color(palette.poppy),
        emissiveIntensity: 0.14,
        iridescence: 0.2,
        side: THREE.DoubleSide,
      }),
      pearl: new THREE.MeshPhysicalMaterial({
        color: "#f4f7fa",
        metalness: 0.3,
        roughness: 0.18,
        clearcoat: 1,
        iridescence: 1,
        iridescenceIOR: 1.8,
      }),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}

/* ------------------------------------------------------------------ */
/* Flower definitions                                                  */
/* ------------------------------------------------------------------ */

type Ring = { count: number; length: number; width: number; open: number };

const BLOOM: Ring[] = [
  { count: 7, length: 1.05, width: 0.62, open: 1.32 },
  { count: 7, length: 0.86, width: 0.56, open: 0.92 },
  { count: 5, length: 0.6, width: 0.5, open: 0.48 },
];
const LILY: Ring[] = [
  { count: 6, length: 1.2, width: 0.36, open: 1.55 },
  { count: 6, length: 0.72, width: 0.3, open: 1.05 },
];
const TULIP: Ring[] = [
  { count: 5, length: 0.95, width: 0.72, open: 0.38 },
  { count: 4, length: 0.82, width: 0.66, open: 0.2 },
];

type FlowerDef = {
  pos: [number, number, number];
  scale: number;
  /** Euler rotation that points the flower's axis (+Y) roughly at the camera. */
  facing: [number, number, number];
  petals: MatKey;
  center: MatKey;
  rings: Ring[];
  stamens: number;
  drift: number;
  stem?: boolean;
};

const FLOWERS: FlowerDef[] = [
  {
    pos: [1.9, -0.1, 0],
    scale: 1.45,
    facing: [1.05, 0, -0.35],
    petals: "chrome",
    center: "poppy",
    rings: BLOOM,
    stamens: 14,
    drift: 0.25,
    stem: true,
  },
  {
    pos: [0.3, 2.55, -2.2],
    scale: 0.74,
    facing: [1.2, 0, 0.5],
    petals: "glass",
    center: "chrome",
    rings: LILY,
    stamens: 8,
    drift: 0.6,
  },
  {
    pos: [4.3, 1.9, -1.2],
    scale: 0.62,
    facing: [0.6, 0, -0.6],
    petals: "poppy",
    center: "chrome",
    rings: TULIP,
    stamens: 0,
    drift: 0.8,
  },
  {
    pos: [3.7, -2.4, -0.5],
    scale: 0.72,
    facing: [1.3, 0, -0.2],
    petals: "glass",
    center: "poppy",
    rings: BLOOM,
    stamens: 10,
    drift: 0.5,
    stem: true,
  },
  {
    pos: [-0.6, -2.1, 0.7],
    scale: 0.42,
    facing: [1.1, 0, 0.4],
    petals: "chrome",
    center: "poppy",
    rings: LILY,
    stamens: 6,
    drift: 0.9,
  },
  {
    pos: [5.6, 0.1, -2.6],
    scale: 0.6,
    facing: [0.8, 0, -0.8],
    petals: "chrome",
    center: "poppy",
    rings: TULIP,
    stamens: 0,
    drift: 0.7,
  },
  {
    pos: [1.9, 3.3, -4.4],
    scale: 0.5,
    facing: [1.1, 0, 0.2],
    petals: "poppy",
    center: "chrome",
    rings: BLOOM,
    stamens: 8,
    drift: 0.65,
  },
  {
    pos: [2.4, -3.3, -2.2],
    scale: 0.38,
    facing: [0.9, 0, 0.3],
    petals: "glass",
    center: "poppy",
    rings: TULIP,
    stamens: 0,
    drift: 1.1,
  },
];

const petalCount = (rings: Ring[]) => rings.reduce((n, r) => n + r.count, 0);

const STEM_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -0.05, -0.08),
  new THREE.Vector3(0.12, -1.1, -0.35),
  new THREE.Vector3(-0.12, -2.5, -0.6),
  new THREE.Vector3(0.2, -4.6, -0.5),
]);

/* ------------------------------------------------------------------ */
/* Flora: flowers that tilt toward the cursor and pulse on click       */
/* ------------------------------------------------------------------ */

type Body = {
  offset: THREE.Vector3;
  vel: THREE.Vector3;
  bloom: number;
  bloomVel: number;
  spin: number;
  baseQ: THREE.Quaternion;
};

const tmpV = new THREE.Vector3();
const tmpDir = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const dummy = new THREE.Object3D();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();

function Flora({
  onRipple,
  geo,
  mats,
}: {
  onRipple: (p: THREE.Vector3) => void;
  geo: THREE.BufferGeometry;
  mats: Record<MatKey, THREE.MeshPhysicalMaterial>;
}) {
  const root = useRef<THREE.Group>(null);
  const outers = useRef<(THREE.Group | null)[]>([]);
  const heads = useRef<(THREE.Group | null)[]>([]);
  const spinners = useRef<(THREE.Group | null)[]>([]);
  const petalMeshes = useRef<(THREE.InstancedMesh | null)[]>([]);
  const stamenMeshes = useRef<(THREE.InstancedMesh | null)[]>([]);
  const stemGeo = useMemo(() => new THREE.TubeGeometry(STEM_CURVE, 48, 0.035, 8, false), []);
  const stamenGeo = useMemo(() => new THREE.SphereGeometry(0.028, 12, 10), []);
  const centerGeo = useMemo(() => new THREE.SphereGeometry(0.15, 32, 24), []);
  useEffect(
    () => () => {
      stemGeo.dispose();
      stamenGeo.dispose();
      centerGeo.dispose();
    },
    [stemGeo, stamenGeo, centerGeo],
  );

  const bodies = useMemo<Body[]>(
    () =>
      FLOWERS.map((f) => ({
        offset: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        bloom: 0,
        bloomVel: 0,
        spin: 0,
        baseQ: new THREE.Quaternion().setFromEuler(new THREE.Euler(...f.facing)),
      })),
    [],
  );
  const camera = useThree((s) => s.camera);

  // Stamens never move relative to their flower; lay them out once.
  useLayoutEffect(() => {
    FLOWERS.forEach((f, i) => {
      const m = stamenMeshes.current[i];
      if (!m) return;
      for (let s = 0; s < f.stamens; s++) {
        const a = (s / f.stamens) * Math.PI * 2 + (s % 2) * 0.3;
        const r = 0.07 + (s % 3) * 0.035;
        dummy.position.set(Math.sin(a) * r, 0.2 + (s % 2) * 0.07, Math.cos(a) * r);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(1 - (s % 3) * 0.15);
        dummy.updateMatrix();
        m.setMatrixAt(s, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    });
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const g = root.current;
    if (!g) return;

    // New clicks push flowers away and make them bloom wider for a moment.
    for (const r of heroInput.ripples) {
      if (r.consumed) continue;
      r.consumed = true;
      ndc.set(r.x, r.y);
      ray.setFromCamera(ndc, camera);
      const hit = ray.ray.intersectPlane(plane, tmpV);
      if (!hit) continue;
      onRipple(hit.clone());
      const local = g.worldToLocal(hit.clone());
      bodies.forEach((b, i) => {
        tmpDir
          .set(...FLOWERS[i]!.pos)
          .add(b.offset)
          .sub(local);
        const d = Math.max(0.6, tmpDir.length());
        const fall = 1 / (d * d * 0.3 + 1);
        tmpDir.normalize().multiplyScalar(IMPULSE * amp(CALM.impulse) * fall);
        b.vel.add(tmpDir);
        b.bloomVel += PULSE * amp(CALM.pulse) * (0.35 + fall);
        b.spin += (Math.random() - 0.5) * 4 * amp(CALM.clickSpin);
      });
    }

    const speed = Math.min(8, Math.hypot(heroInput.vx, heroInput.vy));
    heroInput.speed = speed;
    const headTilt = HEAD_TILT * amp(CALM.headTilt);
    const slerpK = 1 - Math.exp(-4 * dt);

    bodies.forEach((b, i) => {
      const def = FLOWERS[i]!;
      const outer = outers.current[i];
      const head = heads.current[i];
      const spinner = spinners.current[i];
      const petals = petalMeshes.current[i];
      if (!outer || !head || !spinner || !petals) return;

      // Damped spring back to rest.
      tmpV.copy(b.offset).multiplyScalar(-SPRING);
      b.vel.addScaledVector(tmpV, dt);
      b.vel.multiplyScalar(Math.exp(-DAMP * dt));
      b.offset.addScaledVector(b.vel, dt);
      const bob = Math.sin(t * 0.6 * def.drift + i) * 0.1 * amp(CALM.bob);
      outer.position.set(
        def.pos[0] + b.offset.x,
        def.pos[1] + b.offset.y + bob,
        def.pos[2] + b.offset.z,
      );

      // Bloom pulse: a spring that overshoots, so petals open then settle.
      b.bloomVel += -BLOOM_SPRING * b.bloom * dt;
      b.bloomVel *= Math.exp(-BLOOM_DAMP * dt);
      b.bloom = THREE.MathUtils.clamp(b.bloom + b.bloomVel * dt, -0.45, 0.8);

      // Heads turn toward the cursor.
      tmpE.set(-heroInput.py * headTilt, heroInput.px * headTilt, 0);
      tmpQ.setFromEuler(tmpE).multiply(b.baseQ);
      head.quaternion.slerp(tmpQ, slerpK);

      // Cursor speed spins flowers on their own axis; spin decays to an idle drift.
      b.spin += speed * SPIN_FROM_SPEED * amp(CALM.cursorSpin) * dt;
      b.spin *= Math.exp(-SPIN_DECAY * (1 + heroInput.calm * 2) * dt);
      spinner.rotation.y += (b.spin + 0.1 * def.drift * amp(CALM.drift)) * dt;

      // Petal transforms.
      const breath = Math.sin(t * 0.7 + i * 1.7) * BREATHE * amp(CALM.breathe);
      let k = 0;
      def.rings.forEach((ring, ri) => {
        const tilt = Math.min(
          1.8,
          ring.open * (1 + b.bloom * (0.55 + ri * 0.25)) + breath * (1 + ri * 0.4),
        );
        const r0 = 0.07 - ri * 0.015;
        for (let p = 0; p < ring.count; p++) {
          const yaw = (p / ring.count) * Math.PI * 2 + ri * (Math.PI / ring.count);
          dummy.position.set(Math.sin(yaw) * r0, ri * 0.045, Math.cos(yaw) * r0);
          dummy.rotation.set(tilt, yaw, 0, "YXZ");
          dummy.scale.set(ring.width, ring.length, ring.width);
          dummy.updateMatrix();
          petals.setMatrixAt(k++, dummy.matrix);
        }
      });
      petals.instanceMatrix.needsUpdate = true;
      stamenMeshes.current[i]?.scale.setScalar(1 + b.bloom * 0.7);
    });

    // Whole bouquet tilts toward the cursor and turns with scroll.
    const s = heroInput.scroll;
    const k = 1 - Math.exp(-3 * dt);
    const tilt = amp(CALM.tilt);
    const turn = amp(CALM.scrollTurn);
    g.rotation.y += (heroInput.px * 0.25 * tilt + s * 0.7 * turn - g.rotation.y) * k;
    g.rotation.x += (-heroInput.py * 0.12 * tilt + s * 0.2 * turn - g.rotation.x) * k;

    // Velocity naturally decays when the cursor stops.
    heroInput.vx *= Math.exp(-6 * dt);
    heroInput.vy *= Math.exp(-6 * dt);
  });

  return (
    <group ref={root} position={[1.1, 0.15, 0]}>
      {FLOWERS.map((f, i) => (
        <group
          key={i}
          ref={(el) => {
            outers.current[i] = el;
          }}
          position={f.pos}
          scale={f.scale}
        >
          {f.stem && (
            <>
              <mesh geometry={stemGeo} material={mats.chrome} />
              <mesh
                geometry={geo}
                material={mats[f.petals === "glass" ? "chrome" : f.petals]}
                position={[-0.08, -1.7, -0.45]}
                rotation={[0.5, -0.4, 1.05]}
                scale={[0.9, 1.5, 0.9]}
              />
            </>
          )}
          <group
            ref={(el) => {
              heads.current[i] = el;
            }}
            rotation={f.facing}
          >
            <group
              ref={(el) => {
                spinners.current[i] = el;
              }}
              rotation={[0, i * 0.8, 0]}
            >
              <instancedMesh
                ref={(el) => {
                  petalMeshes.current[i] = el;
                }}
                args={[geo, mats[f.petals], petalCount(f.rings)]}
                frustumCulled={false}
              />
              <mesh geometry={centerGeo} material={mats[f.center]} position={[0, 0.08, 0]} />
              {f.stamens > 0 && (
                <instancedMesh
                  ref={(el) => {
                    stamenMeshes.current[i] = el;
                  }}
                  args={[stamenGeo, f.center === "poppy" ? mats.pearl : mats.poppy, f.stamens]}
                  frustumCulled={false}
                />
              )}
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Loose petals drifting through the scene                             */
/* ------------------------------------------------------------------ */

const LOOSE = 32;
type Loose = {
  p: THREE.Vector3;
  v: THREE.Vector3;
  rot: THREE.Vector3;
  rs: THREE.Vector3;
  ph: number;
  f: number;
  s: number;
  slot: number;
  red: boolean;
};

function LoosePetals({
  register,
  geo,
  mats,
}: {
  register: (fn: (p: THREE.Vector3) => void) => void;
  geo: THREE.BufferGeometry;
  mats: Record<MatKey, THREE.MeshPhysicalMaterial>;
}) {
  const chrome = useRef<THREE.InstancedMesh>(null);
  const red = useRef<THREE.InstancedMesh>(null);
  const items = useMemo<Loose[]>(() => {
    let seed = 11;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let c = 0;
    let r = 0;
    return Array.from({ length: LOOSE }, (_, i) => {
      const isRed = i % 4 === 0;
      return {
        p: new THREE.Vector3(-4 + rand() * 13, -7 + rand() * 12.5, -5 + rand() * 7.5),
        v: new THREE.Vector3(),
        rot: new THREE.Vector3(rand() * 6, rand() * 6, rand() * 6),
        rs: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(1.6),
        ph: rand() * Math.PI * 2,
        f: 0.4 + rand() * 0.6,
        s: 0.14 + rand() * 0.16,
        slot: isRed ? r++ : c++,
        red: isRed,
      };
    });
  }, []);
  const redCount = items.filter((x) => x.red).length;

  register((hit) => {
    for (const it of items) {
      tmpDir.copy(it.p).sub(hit);
      const d = Math.max(0.5, tmpDir.length());
      tmpDir.normalize().multiplyScalar((IMPULSE * 1.3 * amp(CALM.impulse)) / (d * d * 0.25 + 1));
      it.v.add(tmpDir);
      const kick = 5 * amp(CALM.clickSpin);
      it.rs.x += (Math.random() - 0.5) * kick;
      it.rs.z += (Math.random() - 0.5) * kick;
    }
  });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const fall = PETAL_FALL * amp(CALM.fall);
    const flutter = PETAL_FLUTTER * amp(CALM.flutter);
    const spinBoost = 1 + heroInput.speed * 0.15 * amp(CALM.cursorSpin);
    for (const it of items) {
      it.v.multiplyScalar(Math.exp(-1.8 * dt));
      it.p.addScaledVector(it.v, dt);
      it.p.y -= fall * it.f * dt;
      if (it.p.y < -8) it.p.y = 5.5;
      if (it.p.y > 6) it.p.y = -7.5;
      // Spin kicked by clicks settles back to a gentle tumble.
      it.rs.multiplyScalar(Math.exp(-0.4 * dt));
      it.rs.clampLength(0.3, 6);
      it.rot.addScaledVector(it.rs, dt * amp(CALM.flutter) * spinBoost);
      dummy.position.set(
        it.p.x + Math.sin(t * it.f + it.ph) * flutter,
        it.p.y,
        it.p.z + Math.cos(t * it.f * 0.8 + it.ph) * flutter * 0.5,
      );
      dummy.rotation.set(it.rot.x, it.rot.y, it.rot.z);
      dummy.scale.set(it.s * 0.9, it.s, it.s * 0.9);
      dummy.updateMatrix();
      (it.red ? red.current : chrome.current)?.setMatrixAt(it.slot, dummy.matrix);
    }
    if (chrome.current) chrome.current.instanceMatrix.needsUpdate = true;
    if (red.current) red.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={chrome}
        args={[geo, mats.chrome, LOOSE - redCount]}
        frustumCulled={false}
      />
      <instancedMesh ref={red} args={[geo, mats.poppy, redCount]} frustumCulled={false} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Click rings, dust, lights & camera                                  */
/* ------------------------------------------------------------------ */

const RING_POOL = 5;
function Ripples({ register }: { register: (fn: (p: THREE.Vector3) => void) => void }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const life = useRef<number[]>(Array(RING_POOL).fill(1));
  const next = useRef(0);

  register((p) => {
    const i = next.current++ % RING_POOL;
    const r = rings.current[i];
    if (!r) return;
    r.position.copy(p);
    life.current[i] = 0;
  });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    rings.current.forEach((r, i) => {
      if (!r) return;
      const l = (life.current[i] = Math.min(1, (life.current[i] ?? 1) + dt * 0.9));
      r.visible = l < 1;
      const calm = amp(CALM.ripple);
      const s = 0.2 + l * 4.5 * calm;
      r.scale.setScalar(s);
      r.quaternion.copy(state.camera.quaternion);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - l) * 0.8 * calm;
    });
  });

  return (
    <>
      {Array.from({ length: RING_POOL }).map((_, i) => (
        <mesh
          key={i}
          visible={false}
          ref={(el) => {
            rings.current[i] = el;
          }}
        >
          <ringGeometry args={[0.96, 1, 96]} />
          <meshBasicMaterial
            color={i % 2 ? palette.powder : palette.poppyBright}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

function Dust() {
  const geo = useMemo(() => {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const n = 600;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rand() - 0.5) * 30;
      arr[i * 3 + 1] = (rand() - 0.5) * 24 - 4;
      arr[i * 3 + 2] = (rand() - 0.5) * 18 - 4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * 0.01 * amp(CALM.dust);
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={palette.powder}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function Rig({ onReady }: { onReady: () => void }) {
  const red = useRef<THREE.PointLight>(null);
  const blue = useRef<THREE.PointLight>(null);
  const ready = useRef(false);
  const fpsAcc = useRef({ frames: 0, time: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Ease between full and reduced motion over about half a second.
    heroInput.calm += ((heroInput.reduced ? 1 : 0) - heroInput.calm) * (1 - Math.exp(-6 * dt));
    const cam = state.camera;
    const s = Math.min(heroInput.scroll, 3);
    const k = 1 - Math.exp(-2.5 * amp(CALM.follow) * dt);
    const par = amp(CALM.parallax);
    const scr = amp(CALM.camScroll);
    const tx = heroInput.px * 0.6 * par;
    const ty = heroInput.py * 0.4 * par - s * CAM_SCROLL_Y * scr;
    const tz = 9 + s * CAM_SCROLL_Z * scr;
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.y += (ty - cam.position.y) * k;
    cam.position.z += (tz - cam.position.z) * k;
    cam.lookAt(1.2, -s * CAM_SCROLL_Y * 0.7 * scr, 0);

    // Lights chase the cursor: the poppy light paints red caustic glints across the chrome.
    const lx = heroInput.px * 6;
    const ly = heroInput.py * 4;
    red.current?.position.lerp(tmpV.set(lx + 1.5, ly, 3), k * 2);
    blue.current?.position.lerp(tmpV.set(-lx - 1, -ly + 2, 2.5), k * 1.5);
    if (red.current) red.current.intensity = 20 + heroInput.speed * 8 * amp(CALM.lightSpeed);

    // Stats for the performance widget (gl.info holds the previous frame).
    const a = fpsAcc.current;
    a.frames++;
    a.time += delta;
    if (a.time > 0.5) {
      heroInput.stats.fps = Math.round(a.frames / a.time);
      heroInput.stats.ms = +((a.time / a.frames) * 1000).toFixed(1);
      heroInput.stats.calls = state.gl.info.render.calls;
      heroInput.stats.triangles = state.gl.info.render.triangles;
      heroInput.stats.dpr = state.viewport.dpr;
      a.frames = 0;
      a.time = 0;
    }

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <>
      <pointLight
        ref={red}
        color={palette.poppyBright}
        intensity={20}
        distance={14}
        decay={1.6}
        position={[3, 0, 3]}
      />
      <pointLight
        ref={blue}
        color={palette.powder}
        intensity={22}
        distance={16}
        decay={1.6}
        position={[-2, 2, 3]}
      />
    </>
  );
}

export default function HeroScene({ onReady }: { onReady: () => void }) {
  const rippleFn = useRef<(p: THREE.Vector3) => void>(() => {});
  const petalPushFn = useRef<(p: THREE.Vector3) => void>(() => {});
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={[palette.raven, 10, 26]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={[palette.powder, palette.raven, 0.5]} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} color={"#ffffff"} />
      {/* Studio reflections for the chrome: soft white top, powder strips, poppy accents. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2.4}
          position={[0, 5, -2]}
          scale={[12, 4, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          intensity={1.6}
          color={palette.powder}
          position={[-6, 1, 0]}
          rotation-y={Math.PI / 2}
          scale={[20, 2.5, 1]}
        />
        <Lightformer
          intensity={1.1}
          color={palette.powder}
          position={[0, -4, 3]}
          rotation-x={-Math.PI / 2}
          scale={[14, 3, 1]}
        />
        <Lightformer
          intensity={2}
          color={palette.poppyBright}
          position={[6, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[10, 1, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.6}
          color={palette.poppyBright}
          position={[3, 2, 6]}
          scale={1.6}
        />
        <Lightformer form="ring" intensity={1.2} position={[-2, 0, 8]} scale={4} />
      </Environment>
      <Rig onReady={onReady} />
      <Scene
        onRipple={(p) => {
          rippleFn.current(p);
          petalPushFn.current(p);
        }}
        registerPetals={(fn) => {
          petalPushFn.current = fn;
        }}
      />
      <Ripples
        register={(fn) => {
          rippleFn.current = fn;
        }}
      />
      <Dust />
    </Canvas>
  );
}

function Scene({
  onRipple,
  registerPetals,
}: {
  onRipple: (p: THREE.Vector3) => void;
  registerPetals: (fn: (p: THREE.Vector3) => void) => void;
}) {
  const geo = useMemo(() => makePetalGeometry(), []);
  useEffect(() => () => geo.dispose(), [geo]);
  const mats = useMaterials();
  return (
    <>
      <Flora onRipple={onRipple} geo={geo} mats={mats} />
      <LoosePetals register={registerPetals} geo={geo} mats={mats} />
    </>
  );
}
