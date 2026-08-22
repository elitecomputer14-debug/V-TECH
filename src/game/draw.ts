export type ItemType =
  | "mouse"
  | "keyboard"
  | "ram"
  | "gpu"
  | "dome"
  | "ssd"
  | "headset"
  | "cpu"
  | "virus"
  | "bolt";

export const GOODS: ItemType[] = ["mouse", "keyboard", "ram", "gpu", "dome", "ssd", "headset"];
export const BADS: ItemType[] = ["virus", "bolt"];

export const POINTS: Record<ItemType, number> = {
  mouse: 10,
  keyboard: 10,
  ram: 10,
  gpu: 15,
  dome: 15,
  ssd: 10,
  headset: 10,
  cpu: 50,
  virus: 0,
  bolt: 0,
};

export const LABEL: Record<ItemType, string> = {
  mouse: "ماوس",
  keyboard: "كيبورد",
  ram: "RAM",
  gpu: "كارت شاشة",
  dome: "كاميرا",
  ssd: "SSD",
  headset: "سماعة",
  cpu: "شريحة V-TECH",
  virus: "فيروس!",
  bolt: "ماس كهربائي!",
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** يرسم القطعة حول نقطة الأصل بمقاس s (يتأرجح/يلمع حسب الزمن t) */
export function drawSprite(ctx: CanvasRenderingContext2D, type: ItemType, s: number, t: number) {
  ctx.save();
  ctx.lineWidth = Math.max(1.4, s * 0.045);

  switch (type) {
    case "mouse": {
      // سلك
      ctx.strokeStyle = "#7d92b8";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.44);
      ctx.quadraticCurveTo(s * 0.14, -s * 0.62, 0, -s * 0.74);
      ctx.stroke();
      // جسم الماوس
      ctx.fillStyle = "#e9effc";
      ctx.strokeStyle = "#8fa3c8";
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.3, s * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#b9c7e4";
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.44);
      ctx.lineTo(0, -s * 0.1);
      ctx.stroke();
      // سكرول
      ctx.fillStyle = "#2ce1ff";
      rr(ctx, -s * 0.055, -s * 0.3, s * 0.11, s * 0.17, s * 0.05);
      ctx.fill();
      break;
    }
    case "keyboard": {
      ctx.fillStyle = "#152242";
      ctx.strokeStyle = "#3b4f79";
      rr(ctx, -s * 0.46, -s * 0.28, s * 0.92, s * 0.56, s * 0.07);
      ctx.fill();
      ctx.stroke();
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 5; c++) {
          const kx = -s * 0.37 + c * s * 0.165;
          const ky = -s * 0.17 + r * s * 0.2;
          ctx.fillStyle = c === 3 && r === 0 ? "#ff8c1a" : "#2ce1ff";
          ctx.globalAlpha = c === 3 && r === 0 ? 1 : 0.5 + 0.4 * Math.sin(t * 3 + c + r);
          rr(ctx, kx, ky, s * 0.12, s * 0.12, s * 0.025);
          ctx.fill();
        }
      ctx.globalAlpha = 1;
      break;
    }
    case "ram": {
      ctx.fillStyle = "#0e7a3d";
      ctx.strokeStyle = "#0a5c2e";
      rr(ctx, -s * 0.46, -s * 0.18, s * 0.92, s * 0.32, s * 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0a2415";
      for (let i = 0; i < 4; i++) rr(ctx, -s * 0.38 + i * s * 0.2, -s * 0.12, s * 0.14, s * 0.16, s * 0.02), ctx.fill();
      ctx.fillStyle = "#ffd23e";
      for (let i = 0; i < 9; i++) ctx.fillRect(-s * 0.42 + i * s * 0.1, s * 0.14, s * 0.05, s * 0.08);
      break;
    }
    case "gpu": {
      ctx.fillStyle = "#1a2544";
      ctx.strokeStyle = "#42568c";
      rr(ctx, -s * 0.46, -s * 0.24, s * 0.92, s * 0.48, s * 0.06);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff8c1a";
      ctx.fillRect(-s * 0.46, -s * 0.24, s * 0.92, s * 0.07);
      // مروحة
      ctx.fillStyle = "#0c1530";
      ctx.strokeStyle = "#2ce1ff";
      ctx.beginPath();
      ctx.arc(0, s * 0.03, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.translate(0, s * 0.03);
      ctx.rotate(t * 6);
      ctx.strokeStyle = "#2ce1ff";
      for (let i = 0; i < 3; i++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s * 0.11, s * 0.03);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case "dome": {
      // قاعدة
      ctx.fillStyle = "#dfe7f7";
      ctx.strokeStyle = "#8fa3c8";
      rr(ctx, -s * 0.42, -s * 0.3, s * 0.84, s * 0.13, s * 0.04);
      ctx.fill();
      ctx.stroke();
      // القبة
      ctx.beginPath();
      ctx.arc(0, -s * 0.16, s * 0.3, 0, Math.PI);
      ctx.closePath();
      ctx.fillStyle = "#eef3fd";
      ctx.fill();
      ctx.stroke();
      // العدسة
      ctx.fillStyle = "#0c1530";
      ctx.beginPath();
      ctx.arc(0, -s * 0.02, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2ce1ff";
      ctx.beginPath();
      ctx.arc(s * 0.035, -s * 0.05, s * 0.035, 0, Math.PI * 2);
      ctx.fill();
      // لمعة تسجيل
      ctx.fillStyle = Math.sin(t * 5) > 0 ? "#ff4d4d" : "#7a1f1f";
      ctx.beginPath();
      ctx.arc(s * 0.3, -s * 0.24, s * 0.035, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "ssd": {
      ctx.fillStyle = "#232f52";
      ctx.strokeStyle = "#42568c";
      rr(ctx, -s * 0.32, -s * 0.22, s * 0.64, s * 0.44, s * 0.05);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff8c1a";
      rr(ctx, -s * 0.24, -s * 0.13, s * 0.48, s * 0.16, s * 0.03);
      ctx.fill();
      ctx.fillStyle = "#0c1530";
      ctx.font = `bold ${s * 0.12}px "Chakra Petch", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SSD", 0, -s * 0.045);
      ctx.fillStyle = "#2ce1ff";
      ctx.fillRect(-s * 0.24, s * 0.09, s * 0.48, s * 0.05);
      break;
    }
    case "headset": {
      ctx.strokeStyle = "#28355c";
      ctx.lineWidth = s * 0.08;
      ctx.beginPath();
      ctx.arc(0, s * 0.02, s * 0.3, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = "#ff8c1a";
      ctx.strokeStyle = "#c96a0c";
      ctx.lineWidth = Math.max(1.4, s * 0.04);
      rr(ctx, -s * 0.4, -s * 0.06, s * 0.18, s * 0.3, s * 0.07);
      ctx.fill();
      ctx.stroke();
      rr(ctx, s * 0.22, -s * 0.06, s * 0.18, s * 0.3, s * 0.07);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#28355c";
      ctx.beginPath();
      ctx.moveTo(-s * 0.31, s * 0.24);
      ctx.quadraticCurveTo(-s * 0.2, s * 0.4, 0, s * 0.36);
      ctx.stroke();
      break;
    }
    case "cpu": {
      const pulse = 0.75 + 0.25 * Math.sin(t * 6);
      // أرجل
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = s * 0.03;
      for (let i = 0; i < 4; i++) {
        const o = -s * 0.22 + i * s * 0.147;
        ctx.beginPath();
        ctx.moveTo(o, -s * 0.34); ctx.lineTo(o, -s * 0.44);
        ctx.moveTo(o, s * 0.34); ctx.lineTo(o, s * 0.44);
        ctx.moveTo(-s * 0.34, o); ctx.lineTo(-s * 0.44, o);
        ctx.moveTo(s * 0.34, o); ctx.lineTo(s * 0.44, o);
        ctx.stroke();
      }
      ctx.fillStyle = "#0f1a36";
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = s * 0.05;
      rr(ctx, -s * 0.32, -s * 0.32, s * 0.64, s * 0.64, s * 0.07);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = `rgba(44,225,255,${pulse})`;
      ctx.lineWidth = s * 0.035;
      rr(ctx, -s * 0.2, -s * 0.2, s * 0.4, s * 0.4, s * 0.04);
      ctx.stroke();
      ctx.fillStyle = "#2ce1ff";
      ctx.font = `${s * 0.3}px "Lalezar", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("V", 0, s * 0.03);
      break;
    }
    case "virus": {
      const wob = 1 + 0.06 * Math.sin(t * 8);
      ctx.save();
      ctx.scale(wob, wob);
      // أشواك
      ctx.strokeStyle = "#2f9e2f";
      ctx.lineWidth = s * 0.05;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t;
        const x1 = Math.cos(a) * s * 0.3;
        const y1 = Math.sin(a) * s * 0.3;
        const x2 = Math.cos(a) * s * 0.46;
        const y2 = Math.sin(a) * s * 0.46;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fillStyle = "#57d53c";
        ctx.beginPath();
        ctx.arc(x2, y2, s * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#43b832";
      ctx.strokeStyle = "#2f7d23";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // عينان غاضبتان
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(-s * 0.1, -s * 0.06, s * 0.07, 0, Math.PI * 2);
      ctx.arc(s * 0.1, -s * 0.06, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a11010";
      ctx.beginPath();
      ctx.arc(-s * 0.1, -s * 0.05, s * 0.03, 0, Math.PI * 2);
      ctx.arc(s * 0.1, -s * 0.05, s * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1d5215";
      ctx.lineWidth = s * 0.04;
      ctx.beginPath();
      ctx.arc(0, s * 0.2, s * 0.12, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "bolt": {
      const glow = 0.5 + 0.5 * Math.sin(t * 9);
      ctx.shadowColor = "rgba(255,210,62,0.9)";
      ctx.shadowBlur = 12 * glow;
      ctx.fillStyle = "#ffd23e";
      ctx.strokeStyle = "#e08900";
      ctx.beginPath();
      ctx.moveTo(s * 0.1, -s * 0.46);
      ctx.lineTo(-s * 0.26, s * 0.08);
      ctx.lineTo(-s * 0.02, s * 0.08);
      ctx.lineTo(-s * 0.12, s * 0.46);
      ctx.lineTo(s * 0.26, -s * 0.1);
      ctx.lineTo(s * 0.02, -s * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      break;
    }
  }
  ctx.restore();
}

/** عربة الصيانة اللي بتلم القطع */
export function drawTray(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  tilt: number,
  t: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.max(-0.14, Math.min(0.14, tilt * 0.0004)));

  // توهج تحت العربة
  const grad = ctx.createLinearGradient(0, -10, 0, 40);
  grad.addColorStop(0, "rgba(255,140,26,0.35)");
  grad.addColorStop(1, "rgba(255,140,26,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(-w / 2, -6, w, 46);

  // جسم العربة
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(w / 2, 0);
  ctx.lineTo(w / 2 - 10, 26);
  ctx.lineTo(-w / 2 + 10, 26);
  ctx.closePath();
  ctx.fillStyle = "#1b2544";
  ctx.fill();
  ctx.strokeStyle = "#ff8c1a";
  ctx.lineWidth = 3;
  ctx.stroke();

  // حافة علوية نيون
  ctx.strokeStyle = "#2ce1ff";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(w / 2, 0);
  ctx.stroke();

  // جوانب رافعة
  ctx.strokeStyle = "#ff8c1a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(-w / 2 - 6, -14);
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2 + 6, -14);
  ctx.stroke();

  // اسم الشركة
  ctx.fillStyle = `rgba(44,225,255,${0.75 + 0.25 * Math.sin(t * 4)})`;
  ctx.font = 'bold 13px "Chakra Petch", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V-TECH", 0, 13);

  // عجل صغير
  ctx.fillStyle = "#0c1530";
  ctx.strokeStyle = "#42568c";
  ctx.lineWidth = 2;
  for (const wx of [-w / 3, w / 3]) {
    ctx.beginPath();
    ctx.arc(wx, 30, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
