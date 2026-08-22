export interface LevelConfig {
  /** رقم المستوى (1-based) */
  level: number;
  name: string;
  /** اسم الهدية */
  prizeTitle: string;
  /** وصف الهدية */
  prizeDesc: string;
  /** عدد القطع المطلوبة لإنهاء المستوى */
  need: number;
  /** سرعة سقوط القطع px/s */
  fall: number;
  /** الفترة بين كل قطعة بالمللي ثانية */
  spawn: number;
  /** احتمال ظهور قطعة مضرة */
  badChance: number;
  color: string;
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: "جولة التسخين",
    prizeTitle: "خصم 10% على كل الاكسسورات",
    prizeDesc: "ماوس، كيبورد، سماعات، إضاءة RGB — الخصم ساري على أي قطعة اكسسوار في المحل.",
    need: 8,
    fall: 125,
    spawn: 1050,
    badChance: 0.1,
    color: "#2ce1ff",
  },
  {
    level: 2,
    name: "جولة السرعة",
    prizeTitle: "ماوس باد هدية",
    prizeDesc: "ماوس باد V-TECH مجاني مع أي عملية شراء من المحل — مهما كانت قيمة الفاتورة.",
    need: 10,
    fall: 160,
    spawn: 920,
    badChance: 0.14,
    color: "#b8f04d",
  },
  {
    level: 3,
    name: "جولة الفني",
    prizeTitle: "خصم 20% على خدمة الصيانة",
    prizeDesc: "على أي خدمة صيانة: تنظيف داخلي، تغيير معجون حراري، فورمات، أو استبدال قطع.",
    need: 12,
    fall: 195,
    spawn: 800,
    badChance: 0.18,
    color: "#ffd23e",
  },
  {
    level: 4,
    name: "جولة المحترفين",
    prizeTitle: "خصم 30% على تركيب كاميرات المراقبة",
    prizeDesc: "خصم على تركيب أي نظام كاميرات HD أو IP شامل الإعداد والمعاينة من الموبايل.",
    need: 14,
    fall: 230,
    spawn: 700,
    badChance: 0.22,
    color: "#ff8c1a",
  },
  {
    level: 5,
    name: "الجولة النهائية",
    prizeTitle: "خصم 50% على صيانة كاملة + سحب على ماوس جيمنج",
    prizeDesc:
      "نص السعر على صيانة كاملة للجهاز، واسمك يدخل السحب الشهري على ماوس جيمنج مجاني.",
    need: 16,
    fall: 265,
    spawn: 600,
    badChance: 0.26,
    color: "#ff4d8d",
  },
];

export const TOTAL_LEVELS = LEVELS.length;

export function makeCouponCode(level: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 4; i++) tail += chars[Math.floor(Math.random() * chars.length)];
  return `VTECH-${level}-${tail}`;
}
