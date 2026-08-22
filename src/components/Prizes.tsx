import { LEVELS } from "../data/prizes";
import CopyButton from "./CopyButton";
import { CheckIcon, LockIcon, SparkIcon, TrophyIcon } from "./icons";

/* ---------------- سلّم المستويات (جنب اللعبة) ---------------- */
export function PrizeLadder({
  coupons,
  currentLevel,
}: {
  coupons: Record<number, string>;
  currentLevel: number;
}) {
  return (
    <div className="rounded-xl border-2 border-edge bg-panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <TrophyIcon size={20} className="text-goldx" />
        <h3 className="font-display text-2xl text-cream">سلّم الجوايز</h3>
      </div>

      <ol className="relative space-y-2.5">
        <span className="absolute right-[17px] top-4 bottom-4 w-px bg-edge" aria-hidden />
        {LEVELS.map((lv, i) => {
          const unlocked = Boolean(coupons[i]);
          const isCurrent = i === currentLevel;
          return (
            <li key={lv.level} className="relative">
              {isCurrent && !unlocked && (
                <span className="absolute right-[9px] top-1/2 h-[17px] w-[17px] -translate-y-1/2 rounded-full anim-pulse-ring" style={{ background: `${lv.color}33` }} />
              )}
              <a
                href={unlocked ? "#coupons" : "#game"}
                className={`group relative flex items-start gap-3 rounded-lg border p-2.5 transition-all duration-200 ${
                  unlocked
                    ? "border-limex/40 bg-limex/5 hover:border-limex hover:bg-limex/10 cursor-pointer"
                    : isCurrent
                      ? "border-orangex/60 bg-orangex/5 hover:border-orangex"
                      : "border-edge bg-deep opacity-70 hover:opacity-100"
                }`}
              >
                <span
                  className="font-tech relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold"
                  style={{
                    borderColor: unlocked ? "#b8f04d" : lv.color,
                    color: unlocked ? "#b8f04d" : isCurrent ? "#ff8c1a" : "#8fa3c8",
                    background: "#0c1530",
                  }}
                >
                  {unlocked ? <CheckIcon size={16} /> : lv.level}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-0.5 flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold ${isCurrent && !unlocked ? "text-orangex" : "text-dim"}`}>
                      المستوى {lv.level} — {lv.name}
                    </span>
                    {!unlocked && <LockIcon size={13} className={isCurrent ? "text-orangex" : "text-edge"} />}
                  </span>
                  <span
                    className={`block truncate text-sm font-extrabold transition-colors ${
                      unlocked ? "text-limex" : isCurrent ? "text-cream" : "text-dim"
                    }`}
                  >
                    {lv.prizeTitle}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 rounded-lg bg-deep p-2.5 text-[11px] leading-relaxed text-dim">
        <SparkIcon size={12} className="mx-0.5 inline text-goldx" />
        كل مستوى بيحتاج تلمّ عدد معين من القطع من غير ما تلمس فيروس أو ماس كهربائي. الجوايز بتتفتح فورًا وبتفضل محفوظة
        ليك.
      </p>
    </div>
  );
}

/* ---------------- قسم الكوبونات ---------------- */
export function CouponsSection({ coupons }: { coupons: Record<number, string> }) {
  const unlockedCount = Object.keys(coupons).length;

  return (
    <section id="coupons" className="relative scroll-mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 font-tech text-sm font-bold tracking-[0.25em] text-cyanx">PRIZE COUPONS</div>
          <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
            كوبونات الجوايز <span className="text-orangex">بتاعتك</span>
          </h2>
        </div>
        <div className="rounded-lg border border-edge bg-panel px-4 py-2 text-sm font-bold text-dim">
          فتحت <span className="font-tech text-2xl text-goldx">{unlockedCount}</span> من {LEVELS.length} جوايز
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {LEVELS.map((lv, i) => {
          const code = coupons[i];
          const unlocked = Boolean(code);
          return (
            <div
              key={lv.level}
              className={`group relative flex overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                unlocked
                  ? "border-edge bg-panel hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
                  : "border-edge/60 bg-deep"
              }`}
              style={unlocked ? { borderColor: `${lv.color}55` } : undefined}
            >
              {/* جزء الجايزة */}
              <div className="flex-1 p-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="font-tech grid h-8 w-8 place-items-center rounded-lg text-sm font-bold"
                    style={{ background: `${lv.color}1f`, color: lv.color }}
                  >
                    {lv.level}
                  </span>
                  <span className="text-xs font-bold text-dim">
                    المستوى {lv.level} — {lv.name}
                  </span>
                </div>
                <h3
                  className={`font-display text-2xl leading-snug ${unlocked ? "text-cream" : "text-dim"}`}
                  style={unlocked ? { color: lv.color } : undefined}
                >
                  {lv.prizeTitle}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-dim">{lv.prizeDesc}</p>
              </div>

              {/* فاصل التذكرة */}
              <div className="relative w-0 border-l-2 border-dashed border-edge" aria-hidden>
                <span className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-ink" />
                <span className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full bg-ink" />
              </div>

              {/* جزء الكود */}
              <div className="grid w-[150px] shrink-0 place-items-center p-3 sm:w-[175px]">
                {unlocked ? (
                  <div className="flex flex-col items-center gap-2.5 text-center">
                    <div className="font-tech text-sm font-bold tracking-[0.12em] text-cyanx" dir="ltr">
                      {code}
                    </div>
                    <CopyButton text={code} label="انسخ" className="px-3 py-1.5 text-xs" />
                    <div className="text-[10px] text-dim">وريه للكاشير</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <LockIcon size={26} className="text-edge transition-colors group-hover:text-dim" />
                    <div className="text-[11px] font-bold leading-snug text-dim">
                      مقفول
                      <br />
                      اعدي المستوى {lv.level} علشان تفتحه
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-edge bg-panel px-5 py-3.5 text-xs font-bold text-dim">
        <span className="text-goldx">شروط الاستلام:</span>
        <span>• الكوبون بيستخدم مرة واحدة بس</span>
        <span>• كوبون واحد مع كل فاتورة</span>
        <span>• ساري لحد نهاية الشهر الجاري في المحل</span>
      </div>
    </section>
  );
}
