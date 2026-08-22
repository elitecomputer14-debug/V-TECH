import { useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, TOTAL_LEVELS } from "../data/prizes";
import {
  BADS,
  GOODS,
  LABEL,
  POINTS,
  drawSprite,
  drawTray,
  type ItemType,
} from "./draw";
import CopyButton from "../components/CopyButton";
import {
  ChipLifeIcon,
  KeyboardIcon,
  LogoMark,
  MouseIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  SparkIcon,
  TouchIcon,
  TrophyIcon,
} from "../components/icons";

export const GAME_W = 960;
export const GAME_H = 560;
const TRAY_W = 140;
const TRAY_TOP = GAME_H - 84;

type Phase = "idle" | "playing" | "paused" | "reward" | "over" | "won";

interface Item {
  type: ItemType;
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}
interface FloatText {
  x: number;
  y: number;
  txt: string;
  color: string;
  life: number;
}

interface Hud {
  score: number;
  lives: number;
  levelIdx: number;
  catches: number;
  combo: number;
  mult: number;
}

interface Props {
  muted: boolean;
  best: number;
  claimCoupon: (levelIndex: number) => string;
  onPhaseChange: (levelIndex: number, phase: Phase) => void;
  onBest: (score: number) => void;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const multOf = (combo: number) => 1 + Math.min(2, Math.floor(combo / 5) * 0.5);

export default function Game({ muted, best, claimCoupon, onPhaseChange, onBest }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState<Hud>({ score: 0, lives: 3, levelIdx: 0, catches: 0, combo: 0, mult: 1 });
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  const phaseRef = useRef<Phase>("idle");
  const mutedRef = useRef(muted);
  const bestRef = useRef(best);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  const eng = useRef({
    items: [] as Item[],
    parts: [] as Particle[],
    texts: [] as FloatText[],
    px: GAME_W / 2,
    lastPx: GAME_W / 2,
    targetX: null as number | null,
    left: false,
    right: false,
    spawnT: 0,
    time: 0,
    shake: 0,
    score: 0,
    lives: 3,
    levelIdx: 0,
    catches: 0,
    combo: 0,
  });

  const audioCtx = useRef<AudioContext | null>(null);

  const setPhaseAll = (p: Phase, levelIdx: number) => {
    phaseRef.current = p;
    setPhase(p);
    onPhaseChange(levelIdx, p);
  };

  const apiRef = useRef({
    start: () => {},
    cont: () => {},
    pauseToggle: () => {},
  });

  /* ---------------- صوت ---------------- */
  function tone(freq: number, dur = 0.09, type: OscillatorType = "square", vol = 0.04, delay = 0, slideTo?: number) {
    if (mutedRef.current) return;
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx.current = audioCtx.current ?? new AC();
      const ctx = audioCtx.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t0 = ctx.currentTime + delay;
      o.type = type;
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.03);
    } catch {
      /* بدون صوت */
    }
  }
  const sfx = {
    catch: (combo: number) => {
      const f = 620 + Math.min(10, combo) * 28;
      tone(f, 0.07, "square", 0.035);
      tone(f * 1.5, 0.06, "square", 0.028, 0.05);
    },
    cpu: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.09, "square", 0.04, i * 0.07)),
    bad: () => {
      tone(130, 0.22, "sawtooth", 0.055, 0, 60);
      tone(90, 0.3, "triangle", 0.05, 0.04, 45);
    },
    level: () => [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.11, "triangle", 0.05, i * 0.09)),
    over: () => [330, 240, 160, 90].forEach((f, i) => tone(f, 0.2, "sawtooth", 0.05, i * 0.14)),
    win: () => [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.14, "triangle", 0.05, i * 0.1)),
    click: () => tone(880, 0.05, "sine", 0.04),
  };

  /* ---------------- المحرك ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = GAME_W * dpr;
    canvas.height = GAME_H * dpr;
    ctx.scale(dpr, dpr);

    const e = eng.current;

    const updateHud = () =>
      setHud({
        score: e.score,
        lives: e.lives,
        levelIdx: e.levelIdx,
        catches: e.catches,
        combo: e.combo,
        mult: multOf(e.combo),
      });

    const burst = (x: number, y: number, colors: string[], n = 14, power = 220) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = power * (0.35 + Math.random() * 0.85);
        e.parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 90,
          life: 0.6 + Math.random() * 0.35,
          maxLife: 1,
          color: colors[i % colors.length],
          size: 2.5 + Math.random() * 4,
        });
      }
    };

    const addText = (x: number, y: number, txt: string, color: string) =>
      e.texts.push({ x: clamp(x, 60, GAME_W - 60), y, txt, color, life: 1 });

    const saveBest = (s: number) => {
      if (s > bestRef.current) {
        setNewRecord(true);
        onBest(s);
      }
    };

    const levelComplete = () => {
      const code = claimCoupon(e.levelIdx);
      setActiveCode(code);
      e.items = [];
      sfx.level();
      burst(GAME_W / 2, GAME_H / 2, ["#2ce1ff", "#ff8c1a", "#b8f04d", "#ffd23e"], 40, 320);
      setPhaseAll("reward", e.levelIdx);
    };

    const endGame = () => {
      saveBest(e.score);
      sfx.over();
      setPhaseAll("over", e.levelIdx);
    };

    const finishWin = () => {
      saveBest(e.score);
      sfx.win();
      setPhaseAll("won", e.levelIdx);
    };

    const resolveCatch = (it: Item) => {
      if (BADS.includes(it.type)) {
        e.lives -= 1;
        e.combo = 0;
        e.shake = 15;
        const screenEl = wrapRef.current;
        if (screenEl) {
          screenEl.classList.remove("anim-shake");
          void screenEl.offsetWidth;
          screenEl.classList.add("anim-shake");
        }
        setFlashKey((k) => k + 1);
        burst(it.x, TRAY_TOP - 10, ["#ff4d4d", "#ff8c1a", "#7a1f1f"], 18, 260);
        addText(it.x, TRAY_TOP - 46, LABEL[it.type], "#ff6b6b");
        sfx.bad();
        updateHud();
        if (e.lives <= 0) endGame();
        return;
      }
      e.combo += 1;
      const mult = multOf(e.combo);
      const pts = Math.round(POINTS[it.type] * mult);
      e.score += pts;
      e.catches += 1;
      const isCpu = it.type === "cpu";
      burst(
        it.x,
        TRAY_TOP - 8,
        isCpu ? ["#ffd23e", "#2ce1ff", "#fff"] : ["#2ce1ff", "#ff8c1a", "#b8f04d"],
        isCpu ? 26 : 12,
        isCpu ? 300 : 200
      );
      addText(it.x, TRAY_TOP - 46, `+${pts}${mult > 1 ? ` ×${mult}` : ""}`, isCpu ? "#ffd23e" : "#2ce1ff");
      if (isCpu) {
        addText(it.x, TRAY_TOP - 74, "شريحة V-TECH!", "#ffd23e");
        sfx.cpu();
      } else sfx.catch(e.combo);
      updateHud();
      if (e.catches >= LEVELS[e.levelIdx].need) levelComplete();
    };

    const missItem = (it: Item) => {
      if (BADS.includes(it.type)) return;
      if (e.combo >= 3) addText(it.x, GAME_H - 40, "فاتتك!", "#8fa3c8");
      e.combo = 0;
      burst(it.x, GAME_H - 14, ["#3a4a73", "#223055"], 6, 110);
      updateHud();
    };

    const spawnItem = () => {
      const cfg = LEVELS[e.levelIdx];
      const bad = Math.random() < cfg.badChance;
      let type: ItemType;
      if (bad) type = BADS[Math.floor(Math.random() * BADS.length)];
      else if (Math.random() < 0.06) type = "cpu";
      else type = GOODS[Math.floor(Math.random() * GOODS.length)];
      const size = type === "cpu" ? 48 : 40 + Math.random() * 9;
      e.items.push({
        type,
        size,
        x: 50 + Math.random() * (GAME_W - 100),
        y: -size,
        vy: cfg.fall * (0.85 + Math.random() * 0.35),
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * (bad ? 3 : 1.8),
      });
    };

    const start = () => {
      e.items = [];
      e.parts = [];
      e.texts = [];
      e.score = 0;
      e.lives = 3;
      e.levelIdx = 0;
      e.catches = 0;
      e.combo = 0;
      e.spawnT = 350;
      e.px = GAME_W / 2;
      e.targetX = null;
      setNewRecord(false);
      setActiveCode(null);
      updateHud();
      sfx.click();
      setPhaseAll("playing", 0);
    };

    const continueNext = () => {
      sfx.click();
      setActiveCode(null);
      if (e.levelIdx >= TOTAL_LEVELS - 1) {
        finishWin();
        return;
      }
      e.levelIdx += 1;
      e.catches = 0;
      e.lives = Math.min(3, e.lives + 1);
      e.spawnT = 500;
      addText(GAME_W / 2, GAME_H / 2 - 40, `المستوى ${e.levelIdx + 1}`, "#ff8c1a");
      updateHud();
      setPhaseAll("playing", e.levelIdx);
    };

    const pauseToggle = () => {
      if (phaseRef.current === "playing") {
        sfx.click();
        setPhaseAll("paused", e.levelIdx);
      } else if (phaseRef.current === "paused") {
        sfx.click();
        setPhaseAll("playing", e.levelIdx);
      }
    };

    apiRef.current = { start, cont: continueNext, pauseToggle };

    /* ---------- تحديث ---------- */
    const step = (dt: number) => {
      e.time += dt;
      if (e.shake > 0) e.shake = Math.max(0, e.shake - dt * 42);

      if (phaseRef.current === "playing") {
        const speed = 640;
        if (e.left || e.right) {
          e.px += (e.right ? speed : 0) * dt - (e.left ? speed : 0) * dt;
          e.targetX = null;
        } else if (e.targetX != null) {
          e.px += (e.targetX - e.px) * Math.min(1, dt * 15);
        }
        e.px = clamp(e.px, TRAY_W / 2 + 8, GAME_W - TRAY_W / 2 - 8);

        e.spawnT -= dt * 1000;
        if (e.spawnT <= 0) {
          spawnItem();
          e.spawnT = LEVELS[e.levelIdx].spawn * (0.75 + Math.random() * 0.5);
        }

        for (let i = e.items.length - 1; i >= 0; i--) {
          const it = e.items[i];
          it.y += it.vy * dt;
          it.rot += it.vr * dt;
          if (
            it.y + it.size / 2 >= TRAY_TOP &&
            it.y - it.size / 2 <= TRAY_TOP + 32 &&
            Math.abs(it.x - e.px) <= TRAY_W / 2 + it.size * 0.3
          ) {
            e.items.splice(i, 1);
            resolveCatch(it);
            if (phaseRef.current !== "playing") break;
            continue;
          }
          if (it.y > GAME_H + 60) {
            e.items.splice(i, 1);
            missItem(it);
          }
        }
      }

      for (let i = e.parts.length - 1; i >= 0; i--) {
        const p = e.parts[i];
        p.life -= dt;
        if (p.life <= 0) {
          e.parts.splice(i, 1);
          continue;
        }
        p.vy += 540 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      for (let i = e.texts.length - 1; i >= 0; i--) {
        const tx = e.texts[i];
        tx.life -= dt * 1.1;
        tx.y -= 44 * dt;
        if (tx.life <= 0) e.texts.splice(i, 1);
      }
    };

    /* ---------- رسم ---------- */
    const render = (c: CanvasRenderingContext2D, t: number) => {
      const bg = c.createLinearGradient(0, 0, 0, GAME_H);
      bg.addColorStop(0, "#0a1230");
      bg.addColorStop(1, "#060b18");
      c.fillStyle = bg;
      c.fillRect(0, 0, GAME_W, GAME_H);

      c.strokeStyle = "rgba(44,225,255,0.055)";
      c.lineWidth = 1;
      for (let x = 0; x <= GAME_W; x += 48) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, GAME_H);
        c.stroke();
      }
      for (let y = 0; y <= GAME_H; y += 48) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(GAME_W, y);
        c.stroke();
      }

      // خط مسح ضوئي
      const sy = ((t * 70) % (GAME_H + 240)) - 120;
      const sweep = c.createLinearGradient(0, sy - 60, 0, sy + 60);
      sweep.addColorStop(0, "rgba(255,140,26,0)");
      sweep.addColorStop(0.5, "rgba(255,140,26,0.05)");
      sweep.addColorStop(1, "rgba(255,140,26,0)");
      c.fillStyle = sweep;
      c.fillRect(0, sy - 60, GAME_W, 120);

      // علامة مائية
      c.fillStyle = "rgba(44,225,255,0.05)";
      c.font = '700 130px "Chakra Petch", sans-serif';
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("V-TECH", GAME_W / 2, GAME_H / 2 - 30);

      c.save();
      if (e.shake > 0) {
        c.translate((Math.random() - 0.5) * e.shake, (Math.random() - 0.5) * e.shake);
      }

      // خط الأرضية
      c.strokeStyle = "rgba(255,140,26,0.25)";
      c.setLineDash([10, 8]);
      c.beginPath();
      c.moveTo(0, GAME_H - 26);
      c.lineTo(GAME_W, GAME_H - 26);
      c.stroke();
      c.setLineDash([]);

      for (const it of e.items) {
        c.save();
        c.translate(it.x, it.y);
        c.rotate(it.rot);
        drawSprite(c, it.type, it.size, t);
        c.restore();
      }

      const velocity = (e.px - e.lastPx) * 60;
      e.lastPx = e.px;
      drawTray(c, e.px, TRAY_TOP, TRAY_W, velocity, t);

      for (const p of e.parts) {
        c.globalAlpha = Math.max(0, p.life / p.maxLife);
        c.fillStyle = p.color;
        c.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      c.globalAlpha = 1;

      for (const tx of e.texts) {
        c.globalAlpha = Math.max(0, Math.min(1, tx.life * 1.4));
        c.font = '800 22px "Tajawal", sans-serif';
        c.textAlign = "center";
        c.lineWidth = 5;
        c.strokeStyle = "rgba(6,11,24,0.85)";
        c.strokeText(tx.txt, tx.x, tx.y);
        c.fillStyle = tx.color;
        c.fillText(tx.txt, tx.x, tx.y);
      }
      c.globalAlpha = 1;
      c.restore();
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      step(dt);
      render(ctx, now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /* ---------- إدخال ---------- */
    const toX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * GAME_W;
    };
    const onMove = (ev: MouseEvent) => {
      e.targetX = toX(ev.clientX);
    };
    const onTouch = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        e.targetX = toX(ev.touches[0].clientX);
        ev.preventDefault();
      }
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      const c = ev.code;
      if (c === "ArrowLeft" || c === "KeyA") {
        e.left = true;
        ev.preventDefault();
      } else if (c === "ArrowRight" || c === "KeyD") {
        e.right = true;
        ev.preventDefault();
      } else if (c === "Space" || c === "Enter") {
        ev.preventDefault();
        const p = phaseRef.current;
        if (p === "idle" || p === "over" || p === "won") start();
        else if (p === "reward") continueNext();
      } else if (c === "KeyP") {
        pauseToggle();
      }
    };
    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.code === "ArrowLeft" || ev.code === "KeyA") e.left = false;
      if (ev.code === "ArrowRight" || ev.code === "KeyD") e.right = false;
    };
    const onHide = () => {
      if (phaseRef.current === "playing") setPhaseAll("paused", e.levelIdx);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onHide);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onHide);
    };
    // claimCoupon / onPhaseChange / onBest ثابتة من App
  }, [claimCoupon, onPhaseChange, onBest]);

  /* ---------------- كونفيتي الجايزة ---------------- */
  const confetti = useMemo(
    () =>
      phase === "reward" || phase === "won"
        ? Array.from({ length: 22 }, (_, i) => ({
            left: (i * 41) % 100,
            delay: (i % 7) * 0.12,
            dur: 2.2 + (i % 5) * 0.35,
            color: ["#2ce1ff", "#ff8c1a", "#b8f04d", "#ffd23e", "#ff4d8d"][i % 5],
            w: 6 + (i % 3) * 4,
          }))
        : [],
    [phase]
  );

  const cfg = LEVELS[hud.levelIdx];
  const progress = Math.min(100, Math.round((hud.catches / cfg.need) * 100));

  return (
    <div id="game" className="relative">
      {/* ============ كابينة الأركيد ============ */}
      <div className="relative rounded-xl border-2 border-edge bg-panel shadow-[0_0_60px_rgba(44,225,255,0.08)]">
        {/* شريط الكابينة العلوي */}
        <div className="flex items-center justify-between gap-2 rounded-t-[10px] border-b-2 border-edge bg-panel2 px-4 py-2.5 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-bold text-dim">النقاط</span>
            <span className="font-tech tabular text-2xl leading-none font-bold text-cyanx">
              {hud.score.toLocaleString("en-US")}
            </span>
          </div>

          <div className="flex-1 min-w-[160px] max-w-[380px]">
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
              <span className="text-dim">
                مستوى <span className="font-tech text-cream">{hud.levelIdx + 1}</span>/{TOTAL_LEVELS} — {cfg.name}
              </span>
              <span className="font-tech text-dim tabular">
                {hud.catches}/{cfg.need} قطعة
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${cfg.color}, #ff8c1a)`,
                  boxShadow: `0 0 10px ${cfg.color}`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hud.combo >= 3 && (
              <span
                key={hud.combo}
                className="anim-pop font-tech rounded-md bg-goldx/15 px-2 py-0.5 text-sm font-bold text-goldx"
              >
                كومبو ×{hud.mult}
              </span>
            )}
            <div className="flex items-center gap-1" dir="ltr">
              {[0, 1, 2].map((i) => (
                <ChipLifeIcon
                  key={i}
                  size={22}
                  className={i < hud.lives ? "text-limex" : "text-edge"}
                />
              ))}
            </div>
            {(phase === "playing" || phase === "paused") && (
              <button
                onClick={() => apiRef.current.pauseToggle()}
                className="cursor-pointer rounded-md border border-edge p-1.5 text-dim transition hover:border-cyanx hover:text-cyanx"
                aria-label="وقفة"
              >
                {phase === "paused" ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* الشاشة */}
        <div ref={wrapRef} className="scanlines crt-vignette relative overflow-hidden rounded-b-[10px]">
          <canvas
            ref={canvasRef}
            className="block w-full cursor-none touch-none"
            style={{ aspectRatio: `${GAME_W}/${GAME_H}` }}
          />

          {/* فلاش الإصابة */}
          {flashKey > 0 && (
            <div
              key={flashKey}
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,60,60,0.28), rgba(255,60,60,0.05))",
                animation: "flashFade 0.45s ease-out both",
              }}
            />
          )}

          {/* ===== شاشة البداية ===== */}
          {phase === "idle" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-ink/85 px-6 text-center backdrop-blur-[2px]">
              <div className="anim-floaty flex items-center gap-3">
                <LogoMark size={52} />
                <div className="text-right">
                  <div className="font-tech text-sm font-bold tracking-[0.3em] text-cyanx">V-TECH ARCADE</div>
                  <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
                    لَمّ القِطَع… وافتَح الجوايز
                  </h2>
                </div>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-dim sm:text-base">
                حرّك عربة الصيانة والتقط قطع الكمبيوتر. كل ما تلمّ <b className="text-limex">{cfg.need} قطع</b> تفتح
                مستوى جديد بجائزة حقيقية — وتجنّب <b className="text-[#ff6b6b]">الفيروس</b> و
                <b className="text-goldx">الماس الكهربائي</b>!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                <span className="flex items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-dim">
                  <KeyboardIcon size={16} className="text-cyanx" /> أسهم أو A / D
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-dim">
                  <MouseIcon size={16} className="text-orangex" /> حرّك الماوس
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-dim">
                  <TouchIcon size={16} className="text-limex" /> اسحب بإصبعك
                </span>
              </div>

              <button
                onClick={() => apiRef.current.start()}
                className="group flex cursor-pointer items-center gap-3 rounded-xl bg-orangex px-10 py-4 text-2xl font-black text-ink shadow-[0_0_35px_rgba(255,140,26,0.45)] transition-all hover:-translate-y-1 hover:bg-goldx hover:shadow-[0_0_50px_rgba(255,210,62,0.55)] active:scale-95"
              >
                <PlayIcon size={26} className="transition-transform group-hover:scale-125" />
                ابدأ اللعب
              </button>
              <div className="anim-blink font-tech text-xs tracking-widest text-dim">— أو اضغط مسافة —</div>

              {best > 0 && (
                <div className="flex items-center gap-2 text-sm font-bold text-goldx">
                  <TrophyIcon size={18} /> أفضل نتيجة عندك: <span className="font-tech tabular">{best.toLocaleString("en-US")}</span>
                </div>
              )}
            </div>
          )}

          {/* ===== وقفة ===== */}
          {phase === "paused" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ink/80">
              <div className="font-display text-5xl text-cyanx">وقفة مؤقّتة</div>
              <p className="text-dim">خد نفس… القطع مستنياك</p>
              <button
                onClick={() => apiRef.current.pauseToggle()}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyanx px-8 py-3 text-xl font-black text-ink transition hover:-translate-y-0.5 hover:bg-cream active:scale-95"
              >
                <PlayIcon size={20} /> كمّل اللعب
              </button>
              <div className="font-tech text-xs text-dim">P للرجوع</div>
            </div>
          )}

          {/* ===== خسارة ===== */}
          {phase === "over" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ink/88 px-6 text-center">
              <div className="font-display text-6xl text-[#ff5252]">اتحرقت الدائرة!</div>
              <p className="max-w-sm text-dim">
                الفيروسات والماس الكهربائي خلصوا على العربيات التلاتة. بس متقلقش — الجوايز اللي فتحتها محفوظة ليك.
              </p>
              {newRecord && (
                <div className="anim-pop flex items-center gap-2 rounded-lg bg-goldx/15 px-4 py-2 font-black text-goldx">
                  <SparkIcon size={20} /> رقم قياسي جديد!
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-dim">نتيجتك:</span>
                <span className="font-tech tabular text-4xl font-bold text-cyanx">{hud.score.toLocaleString("en-US")}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => apiRef.current.start()}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-orangex px-8 py-3 text-xl font-black text-ink transition hover:-translate-y-0.5 hover:bg-goldx active:scale-95"
                >
                  <RefreshIcon size={20} /> العب تاني
                </button>
                <a
                  href="#coupons"
                  className="rounded-xl border-2 border-edge px-6 py-3 text-lg font-bold text-dim transition hover:border-cyanx hover:text-cyanx"
                >
                  شوف جوايزك
                </a>
              </div>
            </div>
          )}

          {/* ===== الفوز النهائي ===== */}
          {phase === "won" && (
            <div className="absolute inset-0 z-10 overflow-hidden bg-ink/88">
              {confetti.map((cf, i) => (
                <span
                  key={i}
                  className="absolute top-0 block rounded-[2px]"
                  style={{
                    left: `${cf.left}%`,
                    width: cf.w,
                    height: cf.w * 1.8,
                    background: cf.color,
                    animation: `confettiFall ${cf.dur}s linear ${cf.delay}s infinite`,
                  }}
                />
              ))}
              <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <TrophyIcon size={64} className="anim-floaty text-goldx" />
                <div className="font-display text-6xl leading-tight text-goldx sm:text-7xl">أسطورة V-TECH!</div>
                <p className="max-w-md text-lg text-dim">
                  خلّصت الـ 5 مستويات كلها وفتحت <b className="text-cream">كل الجوايز</b>. ورينا كوبوناتهم في المحل وخد
                  هداياك.
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-dim">النتيجة النهائية:</span>
                  <span className="font-tech tabular text-4xl font-bold text-cyanx">{hud.score.toLocaleString("en-US")}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#coupons"
                    className="flex items-center gap-2 rounded-xl bg-goldx px-8 py-3 text-xl font-black text-ink transition hover:-translate-y-0.5 active:scale-95"
                  >
                    <SparkIcon size={20} /> استلم جوايزك
                  </a>
                  <button
                    onClick={() => apiRef.current.start()}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-edge px-6 py-3 text-lg font-bold text-dim transition hover:border-orangex hover:text-orangex"
                  >
                    <RefreshIcon size={18} /> جولة كمان
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== نافذة الجايزة ===== */}
          {phase === "reward" && activeCode && (
            <div className="absolute inset-0 z-20 overflow-hidden bg-ink/90">
              {confetti.map((cf, i) => (
                <span
                  key={i}
                  className="absolute top-0 block rounded-[2px]"
                  style={{
                    left: `${cf.left}%`,
                    width: cf.w,
                    height: cf.w * 1.8,
                    background: cf.color,
                    animation: `confettiFall ${cf.dur}s linear ${cf.delay}s infinite`,
                  }}
                />
              ))}
              <div className="relative z-[1] flex h-full items-center justify-center p-4">
                <div className="anim-pop w-full max-w-md rounded-2xl border-2 p-6 text-center sm:p-8"
                  style={{ borderColor: cfg.color, background: "#0c1530", boxShadow: `0 0 70px ${cfg.color}44` }}
                >
                  <div
                    className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1 font-tech text-sm font-bold"
                    style={{ background: `${cfg.color}22`, color: cfg.color }}
                  >
                    <SparkIcon size={16} /> المستوى {cfg.level} اكتمل — {cfg.name}
                  </div>
                  <div className="font-display text-4xl leading-tight text-cream sm:text-[2.6rem]">مبروووك! كسبت</div>
                  <div className="font-display mt-1 text-3xl leading-snug sm:text-4xl" style={{ color: cfg.color }}>
                    {cfg.prizeTitle}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dim">{cfg.prizeDesc}</p>

                  <div className="mt-5 rounded-xl border-2 border-dashed border-edge bg-ink p-4">
                    <div className="mb-1 text-[11px] font-bold text-dim">كود الكوبون بتاعك</div>
                    <div className="font-tech text-2xl font-bold tracking-[0.18em] text-cyanx sm:text-3xl" dir="ltr">
                      {activeCode}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <CopyButton text={activeCode} />
                    <button
                      onClick={() => apiRef.current.cont()}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-cyanx px-5 py-2 font-bold text-cyanx transition-all hover:bg-cyanx hover:text-ink active:scale-95 sm:w-auto"
                    >
                      {hud.levelIdx >= TOTAL_LEVELS - 1 ? (
                        <>
                          <TrophyIcon size={18} /> استلم الجايزة الكبرى
                        </>
                      ) : (
                        <>
                          <PlayIcon size={16} /> المستوى {cfg.level + 1}
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 text-[11px] text-dim">احفظ الكود أو صوّره — ووريه للكاشير في المحل</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* شريط تحت الكابينة */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-dim">
        <span className="font-tech" dir="ltr">
          ← → / A D : حركة&nbsp;&nbsp;•&nbsp;&nbsp;SPACE : بدء&nbsp;&nbsp;•&nbsp;&nbsp;P : وقفة
        </span>
        <span className="flex items-center gap-1.5">
          <TrophyIcon size={14} className="text-goldx" />
          أفضل نتيجة: <span className="font-tech tabular text-goldx">{best.toLocaleString("en-US")}</span>
        </span>
      </div>
    </div>
  );
}
