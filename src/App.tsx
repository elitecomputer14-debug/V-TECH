import { useCallback, useEffect, useRef, useState } from "react";
import Game from "./game/Game";
import { CouponsSection, PrizeLadder } from "./components/Prizes";
import { AmbientBackground, CtaStrip, Footer, Header, HowToClaim, Services, Ticker } from "./components/Sections";
import { ShareModal } from "./components/ShareModal";
import { TOTAL_LEVELS, makeCouponCode } from "./data/prizes";

const LS_COUPONS = "vtech_coupons";
const LS_BEST = "vtech_best";
const LS_MUTED = "vtech_muted";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* تخزين غير متاح */
  }
}

export default function App() {
  const [coupons, setCoupons] = useState<Record<number, string>>(() => loadJSON(LS_COUPONS, {}));
  const [best, setBest] = useState<number>(() => loadJSON(LS_BEST, 0));
  const [muted, setMuted] = useState<boolean>(() => loadJSON(LS_MUTED, false));
  const [currentLevel, setCurrentLevel] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const couponsRef = useRef(coupons);
  useEffect(() => {
    couponsRef.current = coupons;
  }, [coupons]);

  /** بيرجّع كود الكوبون للمستوى — يولّده أول مرة ويحفظه */
  const claimCoupon = useCallback((levelIndex: number): string => {
    const existing = couponsRef.current[levelIndex];
    if (existing) return existing;
    const code = makeCouponCode(levelIndex + 1);
    const next = { ...couponsRef.current, [levelIndex]: code };
    couponsRef.current = next;
    setCoupons(next);
    saveJSON(LS_COUPONS, next);
    return code;
  }, []);

  const onBest = useCallback((score: number) => {
    setBest(score);
    saveJSON(LS_BEST, score);
  }, []);

  const onPhaseChange = useCallback((levelIndex: number) => {
    setCurrentLevel(levelIndex);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      saveJSON(LS_MUTED, !m);
      return !m;
    });
  }, []);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <div className="relative z-10">
        <Header muted={muted} onToggleMute={toggleMute} onOpenShare={() => setShareOpen(true)} />
        <Ticker />

        <main className="mx-auto max-w-6xl px-4">
          {/* ============ افتتاحية اللعبة ============ */}
          <section className="flex flex-col gap-8 pb-8 pt-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyanx/40 bg-cyanx/10 px-4 py-1.5 text-xs font-bold text-cyanx">
                <span className="anim-blink inline-block h-2 w-2 rounded-full bg-cyanx" />
                اللعبة الدعائية الرسمية لمحل V-TECH
              </div>
              <h1 className="font-display text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
                لَمّ القِطَع…
                <br />
                <span className="text-orangex">وافتَح الجوايز</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
                حرّك عربة الصيانة والتقط قطع الكمبيوتر النازلة — كل ما تكمّل مستوى بتفتح كوبون هدية حقيقي تستلمه من
                المحل: خصومات، اكسسورات، وتركيب كاميرات مراقبة.
              </p>
            </div>

            <div className="flex items-center self-start overflow-hidden rounded-xl border-2 border-edge bg-panel py-3 xl:self-end">
              {[
                { v: `${TOTAL_LEVELS}`, l: "مستويات", c: "#2ce1ff" },
                { v: `${TOTAL_LEVELS}`, l: "جوايز حقيقية", c: "#ff8c1a" },
                { v: "3", l: "حيوات بس", c: "#ff4d8d" },
              ].map((s, i) => (
                <div key={s.l} className={`px-5 text-center ${i > 0 ? "border-s-2 border-edge" : ""}`}>
                  <div className="font-tech tabular text-3xl font-bold leading-none" style={{ color: s.c }}>
                    {s.v}
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-dim">{s.l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ============ اللعبة + سلّم الجوايز ============ */}
          <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <Game
              muted={muted}
              best={best}
              claimCoupon={claimCoupon}
              onPhaseChange={onPhaseChange}
              onBest={onBest}
            />
            <aside className="xl:sticky xl:top-24">
              <PrizeLadder coupons={coupons} currentLevel={currentLevel} />
            </aside>
          </section>

          <div className="mt-24">
            <CouponsSection coupons={coupons} />
          </div>

          <div className="mt-24">
            <Services />
          </div>

          <div className="mt-24">
            <HowToClaim />
          </div>

          <div className="mt-24">
            <CtaStrip />
          </div>
        </main>

        <Footer />
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
