import { useEffect, useState } from "react";
import QRCode from "qrcode";
import CopyButton from "./CopyButton";
import { DownloadIcon, LinkIcon, MegaphoneIcon, WhatsAppIcon } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: Props) {
  const [qr, setQr] = useState("");
  const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    QRCode.toDataURL(url, { width: 560, margin: 2, color: { dark: "#060b18", light: "#f4f7ff" } })
      .then((d) => alive && setQr(d))
      .catch(() => alive && setQr(""));
    return () => {
      alive = false;
    };
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  const waHref = `https://wa.me/?text=${encodeURIComponent(
    "🎮 العب لعبة V-TECH واكسب كوبونات وهدايا حقيقية من المحل — جرّب حظك دلوقتي!\n" + url
  )}`;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="انشر اللعبة لعملاءك"
    >
      <div
        className="anim-pop relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl border-2 border-edge bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 cursor-pointer rounded-md p-1 text-dim transition hover:text-orangex"
          aria-label="إغلاق"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mb-5 flex items-center gap-3 pe-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orangex/15 text-orangex">
            <MegaphoneIcon size={26} />
          </span>
          <div>
            <h3 className="font-display text-2xl leading-tight text-cream">انشر اللعبة لعملاءك</h3>
            <p className="text-xs font-bold text-dim">QR جاهز للطباعة + رابط للإرسال على واتساب</p>
          </div>
        </div>

        {isLocal && (
          <div className="mb-5 rounded-lg border-2 border-goldx/50 bg-goldx/10 p-3.5 text-xs leading-relaxed text-goldx">
            <strong>خد بالك:</strong> الرابط اللي تحت شغال على جهازك بس دلوقتي. ارفع الموقع الأول (الخطوات تحت — دقيقتين
            بالظبط) عشان يبقى رابط عام يقدر أي عميل يفتحه من موبايله.
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {qr && (
            <div className="rounded-xl border-2 border-edge bg-white p-3 shadow-[0_0_40px_rgba(44,225,255,0.15)]">
              <img src={qr} alt="QR كود لعبة V-TECH" className="block h-44 w-44" />
            </div>
          )}
          <p className="-mt-1 text-[11px] font-bold text-dim">اطبعه وعلّقه في المحل أو على فاتورة الجهاز</p>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-edge bg-deep px-3 py-2.5">
          <LinkIcon size={16} className="shrink-0 text-cyanx" />
          <span className="min-w-0 flex-1 truncate text-[11px] text-dim" dir="ltr">
            {url}
          </span>
          <CopyButton text={url} label="انسخ الرابط" className="px-3 py-1.5 text-[11px]" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-limex px-4 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
          >
            <WhatsAppIcon size={18} /> ابعت واتساب
          </a>
          {qr && (
            <a
              href={qr}
              download="vtech-qr.png"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-cyanx/60 px-4 py-3 text-sm font-black text-cyanx transition hover:-translate-y-0.5 hover:bg-cyanx/10 active:scale-95"
            >
              <DownloadIcon size={18} /> حمّل الـ QR
            </a>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-edge bg-deep p-4">
          <h4 className="font-display mb-3 text-lg text-goldx">لسه ما رفعتش الموقع؟ الخطوات:</h4>
          <ol className="space-y-2.5 text-xs leading-relaxed text-dim">
            {[
              <>
                افتح <b className="font-tech text-cyanx" dir="ltr">app.netlify.com/drop</b> من أي متصفح
              </>,
              <>
                اسحب فولدر <b className="font-tech text-orangex" dir="ltr">dist</b> من المشروع وسيبه — في ثواني هيطلعلك
                رابط عام مجاني
              </>,
              <>
                ارجع هنا واضغط <b className="text-cream">"انشر اللعبة"</b> تاني: حمّل الـ QR واطبعه، وابعت الرابط لعملاءك
                واتساب
              </>,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="font-tech mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-edge text-[11px] font-bold text-goldx">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t border-edge pt-2.5 text-[11px] leading-relaxed text-dim">
            عاوز اسم يشرح أكتر؟ من إعدادات نتليفاي غيّر النطاق لحاجة زي <b className="font-tech text-cyanx" dir="ltr">vtech-game.netlify.app</b> — ببلاش.
          </p>
        </div>
      </div>
    </div>
  );
}
