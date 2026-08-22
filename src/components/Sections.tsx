import { useMemo } from "react";
import {
  DomeCamIcon,
  LogoMark,
  MegaphoneIcon,
  MouseIcon,
  PhoneIcon,
  RouterIcon,
  SoundOffIcon,
  SoundOnIcon,
  SsdIcon,
  WhatsAppIcon,
  WrenchIcon,
} from "./icons";

const PHONE = "01012345678";
const WHATSAPP = "201012345678";

/* ---------------- الهيدر ---------------- */
export function Header({
  muted,
  onToggleMute,
  onOpenShare,
}: {
  muted: boolean;
  onToggleMute: () => void;
  onOpenShare: () => void;
}) {
  const links = [
    { href: "#game", label: "اللعبة" },
    { href: "#coupons", label: "الجوايز" },
    { href: "#services", label: "خدماتنا" },
    { href: "#contact", label: "تواصل معانا" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b-2 border-edge bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#game" className="group flex items-center gap-2.5">
          <LogoMark size={38} className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className="leading-none">
            <span className="font-tech block text-xl font-bold tracking-wider">
              <span className="text-cyanx">V</span>
              <span className="text-orangex">-TECH</span>
            </span>
            <span className="text-[10px] font-bold text-dim">صيانة • اكسسورات • كاميرات مراقبة</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-bold text-dim transition-all hover:bg-panel hover:text-cyanx"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShare}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-limex/60 px-3 py-2 text-sm font-black text-limex transition hover:-translate-y-0.5 hover:bg-limex hover:text-ink"
            title="QR كود ورابط لنشر اللعبة لعملاءك"
          >
            <MegaphoneIcon size={17} />
            <span className="hidden sm:inline">انشر اللعبة</span>
          </button>
          <button
            onClick={onToggleMute}
            className="cursor-pointer rounded-lg border border-edge p-2 text-dim transition hover:border-cyanx hover:text-cyanx"
            aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
            title={muted ? "تشغيل صوت اللعبة" : "كتم صوت اللعبة"}
          >
            {muted ? <SoundOffIcon size={18} /> : <SoundOnIcon size={18} />}
          </button>
          <a
            href={`tel:${PHONE}`}
            className="hidden items-center gap-2 rounded-lg bg-orangex px-4 py-2 text-sm font-black text-ink transition hover:-translate-y-0.5 hover:bg-goldx sm:flex"
          >
            <PhoneIcon size={16} />
            <span className="font-tech" dir="ltr">{PHONE}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- الشريط المتحرك ---------------- */
const TICKER_ITEMS = [
  "صيانة كمبيوتر ولاب توب",
  "اكسسورات جيمنج ومكتب",
  "كاميرات مراقبة HD و IP",
  "العب واكسب كوبونات حقيقية",
  "ترقية RAM و SSD",
  "شبكات وراوترات",
];

export function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-display px-5 text-lg leading-none">{item}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
            <path d="M12 2l2.6 7.4H22l-6 4.6 2.3 7.5-6.3-4.6-6.3 4.6L8 14 2 9.4h7.4L12 2z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="anim-glow overflow-hidden border-b-2 border-edge bg-orangex py-2 text-ink" dir="ltr">
      <div className="anim-ticker flex w-max" dir="rtl">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ---------------- الخدمات ---------------- */
const SERVICES = [
  {
    icon: WrenchIcon,
    color: "#2ce1ff",
    title: "صيانة الكمبيوتر واللاب توب",
    big: true,
    span: "md:col-span-4",
    points: ["تنظيف داخلي وتغيير معجون حراري", "استبدال شاشات وكيبوردات وبطاريات", "استرجاع البيانات من الهاردات", "حل مشاكل الهانج والشاشة الزرقاء"],
  },
  {
    icon: MouseIcon,
    color: "#ff8c1a",
    title: "اكسسورات الكمبيوتر",
    span: "md:col-span-2",
    points: ["كيبوردات وماوسات جيمنج", "سماعات ومايكات", "إضاءة RGB وحوامل"],
  },
  {
    icon: DomeCamIcon,
    color: "#b8f04d",
    title: "كاميرات المراقبة",
    span: "md:col-span-3",
    points: ["كاميرات HD و IP لكل المساحات", "متابعة مباشرة من موبايلك", "أجهزة تسجيل وتخزين"],
  },
  {
    icon: RouterIcon,
    color: "#ff4d8d",
    title: "شبكات وراوترات",
    span: "md:col-span-3",
    points: ["تأسيس شبكات للمحلات والشركات", "ضبط راوترات وتوسيع تغطية"],
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-28">
      <div className="mb-8">
        <div className="mb-1 font-tech text-sm font-bold tracking-[0.25em] text-orangex">OUR SERVICES</div>
        <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
          غير اللعبة… <span className="text-cyanx">ده شغلنا الأساسي</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-dim">
          V-TECH مش مجرد لعبة دعايا — دي خدمات بنقدمها كل يوم، والكوبونات اللي بتكسبها بتطبق عليها كلها.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <article
              key={s.title}
              className={`group relative overflow-hidden rounded-xl border-2 border-edge bg-panel p-6 transition-all duration-300 hover:-translate-y-1.5 ${s.span ?? ""}`}
              style={{ ["--acc" as string]: s.color }}
              onMouseEnter={(ev) => (ev.currentTarget.style.borderColor = s.color)}
              onMouseLeave={(ev) => (ev.currentTarget.style.borderColor = "")}
            >
              <div
                className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-25"
                style={{ background: s.color }}
              />
              <div className="flex items-center gap-4">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                  style={{ background: `${s.color}1a`, color: s.color }}
                >
                  <Icon size={30} />
                </span>
                <h3 className="font-display text-2xl leading-snug text-cream sm:text-[1.7rem]">{s.title}</h3>
              </div>
              <ul className={`mt-4 ${s.big ? "grid gap-x-6 gap-y-2 sm:grid-cols-2" : "space-y-2"}`}>
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-dim">
                    <svg width="14" height="14" viewBox="0 0 24 24" className="mt-1 shrink-0" style={{ color: s.color }}>
                      <path d="M4 12l6 6L20 6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}

        <article className="group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border-2 border-edge bg-deep p-5 md:col-span-6 transition-colors hover:border-goldx/60">
          <SsdIcon size={26} className="text-goldx" />
          <span className="font-display text-xl text-cream">وكمان بنعمل:</span>
          {["فورمات وتثبيت ويندوز", "ترقية RAM و SSD", "تجميع أجهزة جيمنج ومكاتب", "تجهيز كاميرات للمحلات", "صيانة بلايستيشن وأجهزة"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-edge bg-panel px-3.5 py-1 text-xs font-bold text-dim transition-all duration-200 hover:-translate-y-0.5 hover:border-goldx hover:text-goldx"
            >
              {t}
            </span>
          ))}
        </article>
      </div>
    </section>
  );
}

/* ---------------- إزاي تستلم الجايزة ---------------- */
const STEPS = [
  {
    n: "01",
    color: "#2ce1ff",
    title: "العب",
    desc: "ادخل اللعبة من فوق، لَمّ القطع وعدّي المستوى. كل مستوى بيفتح كوبون فورًا — حتى لو خسرت بعدها.",
  },
  {
    n: "02",
    color: "#ff8c1a",
    title: "انسخ الكود",
    desc: "الكوبون بيظهرلك على طول وممكن تنسخه أو تصوّره. الكود محفوظ ليك وترجع تلاقيه في أي وقت.",
  },
  {
    n: "03",
    color: "#b8f04d",
    title: "تعالى المحل",
    desc: "ورّي الكود للكاشير قبل الدفع واستلم هديتك أو خصمك. كوبون واحد مع كل فاتورة.",
  },
];

export function HowToClaim() {
  return (
    <section className="scroll-mt-28">
      <div className="mb-10 text-center">
        <div className="mb-1 font-tech text-sm font-bold tracking-[0.25em] text-limex">HOW TO CLAIM</div>
        <h2 className="font-display text-4xl text-cream sm:text-5xl">
          إزاي تستلم <span className="text-orangex">جوايزك؟</span>
        </h2>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        <span className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-edge md:block" aria-hidden />
        {STEPS.map((st, i) => (
          <div key={st.n} className="group relative text-center">
            <div
              className="font-tech relative z-[1] mx-auto mb-5 grid h-16 w-16 place-items-center rounded-xl border-2 bg-panel text-xl font-bold transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-3"
              style={{ borderColor: st.color, color: st.color, boxShadow: `0 0 25px ${st.color}22` }}
            >
              {st.n}
            </div>
            <h3 className="font-display mb-2 text-3xl" style={{ color: st.color }}>
              {st.title}
            </h3>
            <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-dim">{st.desc}</p>
            {i < STEPS.length - 1 && (
              <svg className="absolute -left-5 top-6 hidden h-4 w-4 text-edge md:block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- شريط الدعوة ---------------- */
export function CtaStrip() {
  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-orangex/50 bg-orangex px-6 py-8 text-ink sm:px-10">
      <LogoMark size={150} className="pointer-events-none absolute -bottom-9 -left-6 opacity-[0.14]" />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">الجوايز مش هتستنى كتير…</h2>
          <p className="mt-1 font-bold text-ink/75">
            عدّي مستوى دلوقتي، وخد الكوبون معاك وأنت جاي المحل. الكوبونات سارية لحد نهاية الشهر.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#game"
            className="rounded-xl bg-ink px-7 py-3.5 text-lg font-black text-cyanx transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,11,24,0.4)] active:scale-95"
          >
            العب دلوقتي
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border-2 border-ink/70 px-6 py-3.5 text-lg font-black transition hover:bg-ink hover:text-limex active:scale-95"
          >
            <WhatsAppIcon size={20} /> ابعتلنا واتساب
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- الفوتر ---------------- */
export function Footer() {
  return (
    <footer id="contact" className="mt-20 scroll-mt-28 border-t-2 border-edge bg-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark size={44} />
            <span className="font-tech text-2xl font-bold tracking-wider">
              <span className="text-cyanx">V</span>
              <span className="text-orangex">-TECH</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-dim">
            محل الكمبيوتر بتاعك لكل حاجة: صيانة محترفة، اكسسورات أصلية، وكاميرات مراقبة بتركيب كامل. واللعبة دي هديتنا
            ليك.
          </p>
        </div>

        <div>
          <h4 className="font-display mb-4 text-2xl text-cream">تعالى زورنا</h4>
          <ul className="space-y-3 text-sm text-dim">
            <li className="flex items-center gap-2.5">
              <PhoneIcon size={17} className="shrink-0 text-cyanx" />
              <a href={`tel:${PHONE}`} className="font-tech transition hover:text-cyanx" dir="ltr">
                {PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <WhatsAppIcon size={17} className="shrink-0 text-limex" />
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="font-tech transition hover:text-limex" dir="ltr">
                {WHATSAPP}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff8c1a" strokeWidth="1.9" className="mt-0.5 shrink-0">
                <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinejoin="round" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              مول النور — الدور الأول — محل 12، شارع الهرم، الجيزة
            </li>
            <li className="flex items-center gap-2.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff4d8d" strokeWidth="1.9" className="shrink-0">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" strokeLinecap="round" />
              </svg>
              يوميًا من 11 صباحًا لـ 11 مساءً — الجمعة بعد الصلاة
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display mb-4 text-2xl text-cream">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm font-bold text-dim">
            {[
              ["#game", "العب واكسب"],
              ["#coupons", "كوبونات الجوايز"],
              ["#services", "خدماتنا"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="group inline-flex items-center gap-2 transition hover:text-orangex">
                  <span className="h-1.5 w-1.5 rounded-full bg-edge transition-colors group-hover:bg-orangex" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg border border-edge bg-panel p-3 text-[11px] leading-relaxed text-dim">
            كوبونات اللعبة تسري داخل المحل فقط، كوبون واحد لكل فاتورة، ولحد نهاية الشهر الجاري.
          </div>
        </div>
      </div>
      <div className="border-t border-edge py-4 text-center text-xs font-bold text-dim">
        © {new Date().getFullYear()} <span className="font-tech text-cyanx">V-TECH</span> — اتعملت اللعبة دي بحب لعملائنا
      </div>
    </footer>
  );
}

/* ---------------- الخلفية المحيطة ---------------- */
export function AmbientBackground() {
  const pixels = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 61 + 13) % 100,
        top: (i * 37 + 7) % 100,
        size: 3 + (i % 3) * 2,
        delay: (i % 8) * 0.55,
        dur: 2.8 + (i % 5) * 0.7,
        color: ["#2ce1ff", "#ff8c1a", "#b8f04d", "#ffd23e", "#ff4d8d"][i % 5],
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
      <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-cyanx/[0.07] blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-8%] h-[520px] w-[520px] rounded-full bg-orangex/[0.06] blur-3xl" />
      <div className="absolute top-[40%] left-[55%] h-[300px] w-[300px] rounded-full bg-magx/[0.05] blur-3xl" />
      {pixels.map((px, i) => (
        <span
          key={i}
          className="anim-twinkle absolute rounded-full"
          style={{
            left: `${px.left}%`,
            top: `${px.top}%`,
            width: px.size,
            height: px.size,
            background: px.color,
            animationDelay: `${px.delay}s`,
            animationDuration: `${px.dur}s`,
            boxShadow: `0 0 8px ${px.color}`,
          }}
        />
      ))}
    </div>
  );
}
