import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export default function CopyButton({
  text,
  label = "انسخ الكود",
  doneLabel = "اتنسخ!",
  className = "",
}: {
  text: string;
  label?: string;
  doneLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = useRef<number | null>(null);

  useEffect(() => () => {
    if (t.current) window.clearTimeout(t.current);
  }, []);

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (t.current) window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* تجاهل */
    }
  };

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
        copied
          ? "bg-limex text-ink"
          : "bg-orangex text-ink hover:bg-goldx hover:-translate-y-0.5"
      } ${className}`}
    >
      {copied ? <CheckIcon size={17} /> : <CopyIcon size={17} />}
      {copied ? doneLabel : label}
    </button>
  );
}
