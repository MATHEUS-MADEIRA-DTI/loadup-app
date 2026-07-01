import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ShareExercise {
  name: string;
  bestWeight: number;
  bestReps: number;
}

interface GenerateBody {
  templateId?: "classic" | "bold" | "minimal" | "stats";
  dayName: string;
  date: string;
  stats: { kg: number; series: number; exercises: number; duration: string };
  topExercises: ShareExercise[];
  photoUrl?: string | null;
  primaryColor?: string;
  primaryDarkColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
  subtleColor?: string;
  borderColor?: string;
  successColor?: string;
}

interface Palette {
  P: string;
  PD: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  subtle: string;
  border: string;
  success: string;
}

function resolvePalette(d: GenerateBody): Palette {
  return {
    P: d.primaryColor ?? "#3B82F6",
    PD: d.primaryDarkColor ?? "#1D4ED8",
    bg: d.backgroundColor ?? "#020617",
    surface: d.surfaceColor ?? "#0F172A",
    text: d.textColor ?? "#F8FAFC",
    muted: d.mutedColor ?? "#64748B",
    subtle: d.subtleColor ?? "#94A3B8",
    border: d.borderColor ?? "#1E293B",
    success: d.successColor ?? "#22C55E",
  };
}

// ── Browser launcher ──────────────────────────────────────────────────────────

async function getBrowser() {
  const { default: puppeteer } = await import("puppeteer-core");

  if (process.env.NODE_ENV === "development") {
    const executablePath =
      process.env.CHROME_EXECUTABLE_PATH ?? findLocalChrome();

    if (!executablePath) {
      throw new Error(
        "Chrome não encontrado. Defina CHROME_EXECUTABLE_PATH no .env.local apontando para o binário do Chrome.",
      );
    }

    return puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }

  // Production / Vercel: chromium-min downloads the binary at runtime
  const { default: chromium } = await import("@sparticuz/chromium-min");
  const executablePath = await chromium.executablePath(
    process.env.CHROMIUM_REMOTE_EXEC_PATH ??
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar",
  );

  return puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
}

function findLocalChrome(): string | undefined {
  const candidates: Partial<Record<NodeJS.Platform, string[]>> = {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      `${process.env.LOCALAPPDATA ?? ""}\\Google\\Chrome\\Application\\chrome.exe`,
    ],
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ],
  };

  for (const p of candidates[process.platform] ?? []) {
    try {
      fs.accessSync(p);
      return p;
    } catch {}
  }
}

// ── HTML helpers ──────────────────────────────────────────────────────────────

function esc(s: string | number): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const GOOGLE_FONTS =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Barlow+Condensed:wght@700;900&display=swap";

function htmlDoc(body: string, bg = "#020617"): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('${GOOGLE_FONTS}');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:360px;height:640px;overflow:hidden;background:${bg};}
</style>
</head>
<body>${body}</body>
</html>`;
}

// ── Template: Classic ─────────────────────────────────────────────────────────

function buildClassicHtml(d: GenerateBody): string {
  const { P, PD, bg, surface, text, muted, subtle, border, success } = resolvePalette(d);

  const heroStyle = d.photoUrl
    ? `background-image:url('${d.photoUrl}');background-size:cover;background-position:center;`
    : `background:linear-gradient(160deg,${PD}55 0%,${P}25 50%,transparent 100%);`;

  const heroInner = d.photoUrl
    ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to top,${bg} 0%,${bg}aa 30%,transparent 70%);"></div>`
    : `<div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.08;background-image:repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 20px);"></div>`;

  const visible = d.topExercises.slice(0, 4);
  const hidden = d.topExercises.length - visible.length;

  const exRows =
    visible
      .map(
        (ex, i) => `
    <div style="display:flex;align-items:baseline;gap:10px;padding:16px 0;">
      <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${P};width:24px;flex-shrink:0;line-height:1.2;">${String(i + 1).padStart(2, "0")}</span>
      <div style="font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:${text};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.4;padding-bottom:2px;">${esc(ex.name)}</div>
      <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${subtle};flex-shrink:0;line-height:1.2;">${esc(ex.bestWeight)}<span style="font-size:11px;font-family:'Inter',sans-serif;font-weight:500;">kg</span> × ${esc(ex.bestReps)}</span>
    </div>`,
      )
      .join("") +
    (hidden > 0
      ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:${muted};padding:6px 0 2px;">+${hidden} exercícios</div>`
      : "");

  return htmlDoc(`
  <div style="position:relative;width:360px;height:640px;background:${bg};overflow:hidden;display:flex;flex-direction:column;">
    <div style="position:absolute;top:-80px;right:-80px;width:280px;height:280px;background:radial-gradient(circle,${P}30 0%,transparent 70%);z-index:0;"></div>

    <div style="position:relative;z-index:1;padding:20px 20px 0;flex-shrink:0;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.08em;color:${P};">LOADUP</span>
        <div style="color:${success};font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">CONCLUÍDO</div>
      </div>
    </div>

    <div style="position:relative;z-index:1;height:190px;flex-shrink:0;margin:14px 20px 0;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;background:${surface};${heroStyle}">
      ${heroInner}
      <div style="position:relative;z-index:1;padding:16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#F8FAFC;line-height:1;letter-spacing:0.02em;">${esc(d.dayName)}</div>
        <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(248,250,252,0.7);margin-top:2px;">${esc(d.date)}</div>
      </div>
    </div>

    <div style="position:relative;z-index:1;display:flex;align-items:center;flex-shrink:0;margin:14px 20px 0;padding:14px 0;border-top:1px solid ${border};border-bottom:1px solid ${border};">
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.duration)}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">DURAÇÃO</span>
      </div>
      <div style="width:1px;height:32px;background:${border};flex-shrink:0;"></div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.series)}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">SÉRIES</span>
      </div>
      <div style="width:1px;height:32px;background:${border};flex-shrink:0;"></div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.exercises)}</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">EXERCÍCIOS</span>
      </div>
    </div>

    <div style="position:relative;z-index:1;margin:14px 20px 0;flex:1;min-height:0;overflow:hidden;">
      <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${muted};display:block;margin-bottom:8px;">EXERCÍCIOS</span>
      ${exRows}
    </div>

    <div style="position:relative;z-index:1;display:flex;align-items:center;flex-shrink:0;margin:14px 20px 20px;padding-top:12px;border-top:1px solid ${border};">
      <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:0.1em;color:${P};">LOADUP</span>
    </div>
  </div>`, bg);
}

// ── Template: Bold ────────────────────────────────────────────────────────────

function buildBoldHtml(d: GenerateBody): string {
  const { P, PD, bg, text, muted, subtle, border, success } = resolvePalette(d);

  const heroStyle = d.photoUrl
    ? `background-image:url('${d.photoUrl}');background-size:cover;background-position:center;`
    : "";

  const nophotoGrad = !d.photoUrl
    ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(155deg,${P} 0%,${PD} 100%);"></div>`
    : "";

  const exercises = d.topExercises.slice(0, 4);
  const hiddenBold = d.topExercises.length - exercises.length;
  const exRows =
    exercises
      .map((ex, i) => {
        const isLast = i === exercises.length - 1;
        return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;">
        <div style="font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:${text};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:12px;">${esc(ex.name)}</div>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:${P};line-height:1;flex-shrink:0;">${esc(ex.bestWeight)}<span style="font-family:'Inter',sans-serif;font-size:10px;font-weight:500;color:${subtle};">kg</span></span>
      </div>
      ${!isLast ? `<div style="height:1px;background:${border};"></div>` : ""}`;
      })
      .join("") +
    (hiddenBold > 0
      ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:${muted};padding:8px 0 2px;">+${hiddenBold} exercícios</div>`
      : "");

  return htmlDoc(`
  <div style="position:relative;width:360px;height:640px;background:${bg};overflow:hidden;display:flex;flex-direction:column;">

    <div style="position:relative;height:240px;flex-shrink:0;overflow:hidden;${heroStyle}">
      ${nophotoGrad}
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,rgba(2,6,23,0.15) 0%,rgba(2,6,23,0.5) 55%,rgba(2,6,23,0.92) 100%);"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;display:flex;flex-direction:column;gap:4px;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:0.2em;color:${P};opacity:0.85;margin-bottom:8px;display:block;">LOADUP</span>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:52px;color:#F8FAFC;line-height:0.9;letter-spacing:0.01em;">${esc(d.dayName)}</div>
        <div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(248,250,252,0.65);margin-top:4px;">${esc(d.date)}</div>
      </div>
    </div>

    <div style="flex:1;min-height:0;display:flex;flex-direction:column;padding:0 20px 20px;">
      <div style="display:flex;align-items:center;flex-shrink:0;padding:14px 0;border-bottom:1px solid ${border};">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:26px;color:${text};line-height:1;">${esc(d.stats.duration)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">duração</span>
        </div>
        <div style="width:1px;height:28px;background:${border};"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:26px;color:${text};line-height:1;">${esc(d.stats.series)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">séries</span>
        </div>
        <div style="width:1px;height:28px;background:${border};"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:26px;color:${text};line-height:1;">${esc(d.stats.exercises)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${muted};">exerc.</span>
        </div>
      </div>

      <div style="flex:1;min-height:0;margin-top:14px;overflow:hidden;">
        ${exRows}
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;flex-shrink:0;padding-top:12px;border-top:1px solid ${border};">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:0.1em;color:${P};">LOADUP</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${success};">✓ CONCLUÍDO</span>
      </div>
    </div>
  </div>`, bg);
}

// ── Template: Minimal ─────────────────────────────────────────────────────────

function buildMinimalHtml(d: GenerateBody): string {
  const { P, bg, text, muted, subtle, border, success } = resolvePalette(d);

  const rootStyle = d.photoUrl
    ? `background-image:url('${d.photoUrl}');background-size:cover;background-position:center;`
    : "";

  const bgOverlay = d.photoUrl
    ? `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:${bg}e0;"></div>`
    : "";

  const visibleMin = d.topExercises.slice(0, 4);
  const hiddenMin = d.topExercises.length - visibleMin.length;
  const exRows =
    visibleMin
      .map(
        (ex, i) => `
    <div>
      <div style="display:flex;align-items:center;gap:10px;padding:9px 0;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${P};width:20px;flex-shrink:0;line-height:1;">${String(i + 1).padStart(2, "0")}</span>
        <div style="font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:${text};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(ex.name)}</div>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:14px;color:${subtle};flex-shrink:0;">${esc(ex.bestWeight)}kg × ${esc(ex.bestReps)}</span>
      </div>
      ${i < visibleMin.length - 1 ? `<div style="height:1px;background:${border};"></div>` : ""}
    </div>`,
      )
      .join("") +
    (hiddenMin > 0
      ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:${muted};padding:8px 0 2px;">+${hiddenMin} exercícios</div>`
      : "");

  return htmlDoc(`
  <div style="position:relative;width:360px;height:640px;background:${bg};overflow:hidden;${rootStyle}">
    ${bgOverlay}
    <div style="position:relative;z-index:1;height:100%;padding:24px 24px 20px;display:flex;flex-direction:column;">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-shrink:0;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:0.12em;color:${P};">LOADUP</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${success};">✓ CONCLUÍDO</span>
      </div>

      <div style="width:36px;height:4px;border-radius:999px;background:${P};margin-bottom:14px;flex-shrink:0;"></div>

      <div style="font-family:'Bebas Neue',sans-serif;font-size:54px;color:${text};line-height:0.9;letter-spacing:0.01em;flex-shrink:0;">${esc(d.dayName)}</div>
      <div style="font-family:'Inter',sans-serif;font-size:13px;color:${subtle};margin-top:8px;flex-shrink:0;">${esc(d.date)}</div>

      <div style="height:1px;background:${border};margin:20px 0;flex-shrink:0;"></div>

      <div style="display:flex;align-items:center;flex-shrink:0;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.duration)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${muted};">duração</span>
        </div>
        <div style="width:1px;height:28px;background:${border};"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.series)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${muted};">séries</span>
        </div>
        <div style="width:1px;height:28px;background:${border};"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${text};line-height:1;">${esc(d.stats.exercises)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${muted};">exercícios</span>
        </div>
      </div>

      <div style="height:1px;background:${border};margin:20px 0;flex-shrink:0;"></div>

      <div style="flex:1;min-height:0;overflow:hidden;">
        ${exRows}
      </div>
    </div>
  </div>`, bg);
}

// ── Template: Stats ───────────────────────────────────────────────────────────

function buildStatsHtml(d: GenerateBody): string {
  const { P, bg, text, muted, subtle, border } = resolvePalette(d);
  const dayChipText = esc(d.dayName.split("-")[0].trim());

  const exercisesSt = d.topExercises.slice(0, 4);
  const hiddenSt = d.topExercises.length - exercisesSt.length;
  const exRows =
    exercisesSt
      .map((ex, i) => {
        const isLast = i === exercisesSt.length - 1;
        return `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 0;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${P};width:22px;flex-shrink:0;line-height:1;">${String(i + 1).padStart(2, "0")}</span>
        <div style="font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:${text};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(ex.name)}</div>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;flex-shrink:0;"><span style="color:${P};">${esc(ex.bestWeight)}</span><span style="font-family:'Inter',sans-serif;font-size:10px;font-weight:500;color:${subtle};">kg × ${esc(ex.bestReps)}</span></span>
      </div>
      ${!isLast ? `<div style="height:1px;background:${border};"></div>` : ""}`;
      })
      .join("") +
    (hiddenSt > 0
      ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:${muted};padding:8px 0 2px;">+${hiddenSt} exercícios</div>`
      : "");

  return htmlDoc(`
  <div style="position:relative;width:360px;height:640px;background:${bg};overflow:hidden;">
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at 50% 0%,${P}22 0%,transparent 65%);pointer-events:none;"></div>

    <div style="position:relative;z-index:1;height:100%;padding:24px 20px 20px;display:flex;flex-direction:column;">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-shrink:0;">
        <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.1em;color:${P};">LOADUP</span>
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${subtle};padding:3px 8px;border-radius:999px;border:1px solid ${border};">${dayChipText}</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;flex-shrink:0;padding:8px 0 20px;">
        <span style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:${muted};margin-bottom:8px;display:block;">DURAÇÃO DO TREINO</span>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:64px;line-height:0.9;letter-spacing:-0.01em;background:linear-gradient(135deg,${text} 0%,${P} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${esc(d.stats.duration)}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex-shrink:0;margin-bottom:16px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:14px 10px;border-radius:16px;border:1px solid ${P}30;background:${P}0D;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:${text};line-height:1;">${esc(d.stats.series)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${muted};">SÉRIES</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:14px 10px;border-radius:16px;border:1px solid ${P}30;background:${P}0D;">
          <span style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:${text};line-height:1;">${esc(d.stats.exercises)}</span>
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${muted};">EXERCÍCIOS</span>
        </div>
      </div>

      <div style="height:1px;background:${border};margin-bottom:16px;flex-shrink:0;"></div>

      <span style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${muted};margin-bottom:10px;flex-shrink:0;display:block;">MELHORES SETS</span>

      <div style="flex:1;min-height:0;overflow:hidden;">
        ${exRows}
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid ${border};flex-shrink:0;">
        <span style="font-family:'Inter',sans-serif;font-size:11px;color:${muted};">${esc(d.date)}</span>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:0.1em;color:${P};">LOADUP</span>
      </div>
    </div>
  </div>`, bg);
}

// ── Template dispatcher ───────────────────────────────────────────────────────

function buildHtml(templateId: string, d: GenerateBody): string {
  switch (templateId) {
    case "bold":
      return buildBoldHtml(d);
    case "minimal":
      return buildMinimalHtml(d);
    case "stats":
      return buildStatsHtml(d);
    default:
      return buildClassicHtml(d);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: GenerateBody;

  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (
    !body.dayName ||
    !body.date ||
    !body.stats ||
    !Array.isArray(body.topExercises)
  ) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 },
    );
  }

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3 });

    const html = buildHtml(body.templateId ?? "classic", body);

    await page.setContent(html, { waitUntil: "load", timeout: 30_000 });
    // Ensure web fonts have finished loading before screenshotting
    await page.evaluate(() => document.fonts.ready);

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 360, height: 640 },
    });

    return new NextResponse(new Uint8Array(screenshot as Buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="loadup-treino.png"',
      },
    });
  } catch (err) {
    console.error("[api/share] Error generating card:", err);
    return NextResponse.json(
      { error: "Falha ao gerar imagem" },
      { status: 500 },
    );
  } finally {
    await browser?.close().catch(() => {});
  }
}
