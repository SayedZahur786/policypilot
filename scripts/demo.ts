import { chromium } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { intake } from "../tests/helpers";
const scenes = [
  [
    "Your app is ready. Let’s finish the fine print.",
    "Your app is ready. Policy Pilot helps you turn the remaining fine print into three clear policy drafts.",
  ],
  [
    "Ten questions about your actual app.",
    "Describe your app, operator, customers, data, service providers, payments, retention and refunds. These answers should match your actual practices.",
  ],
  [
    "Review every draft. Keep the HTML.",
    "Review privacy, terms and refund drafts. Copy the HTML to your own app, or publish a clean hosted policy set.",
  ],
  [
    "Local payment simulation. No charge.",
    "This walkthrough simulates payment locally. Live Stripe checkout is not configured, and no money is charged.",
  ],
  [
    "Three policies. One clear home.",
    "The published policy centre gives each document its own stable link, with regional clauses selected from your answers.",
  ],
  [
    "Change your answers. Keep your links.",
    "When the app changes, edit the answers and republish. The policy URL stays the same.",
  ],
  [
    "Drafts for review. Not legal advice.",
    "Policy Pilot is a working draft generator, not a law firm. Verify your practices and get the legal review your business needs.",
  ],
];
await mkdir(".local/video", { recursive: true });
const durations: number[] = [];
for (let i = 0; i < scenes.length; i++) {
  const r = spawnSync("say", [
    "-v",
    "Samantha",
    "-r",
    "175",
    "-o",
    `.local/video/voice-${i}.aiff`,
    scenes[i][1],
  ]);
  if (r.status !== 0) throw new Error("Narration failed");
  const d = Number(
    spawnSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=nw=1:nk=1",
        `.local/video/voice-${i}.aiff`,
      ],
      { encoding: "utf8" },
    ).stdout.trim(),
  );
  durations.push(Math.max(d + 1, i === 1 ? 14 : i === 5 ? 10 : 7));
}
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  recordVideo: { dir: ".local/video", size: { width: 1440, height: 1000 } },
});
await context.addInitScript(() => {
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (k.startsWith("pp-key-")) return;
    original.call(this, k, v);
  };
});
const page = await context.newPage();
const base = "http://127.0.0.1:3418";
async function caption(text: string) {
  await page.evaluate((text) => {
    document.getElementById("demo-caption")?.remove();
    const e = document.createElement("div");
    e.id = "demo-caption";
    e.textContent = text;
    Object.assign(e.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      zIndex: "99999",
      padding: "22px 30px",
      background: "#10281ff5",
      color: "white",
      fontSize: "34px",
      fontFamily: "Arial",
      fontWeight: "600",
      textAlign: "center",
    });
    document.body.append(e);
  }, text);
}
let manage = "",
  hosted = "";
const started = Date.now();
for (let i = 0; i < scenes.length; i++) {
  const start = Date.now();
  if (i === 0) await page.goto(base);
  if (i === 1) {
    await intakeWithBase();
    manage = page.url();
  }
  if (i === 2) {
    await page
      .getByRole("button", { name: "Refund policy", exact: true })
      .click();
  }
  if (i === 3) {
    await page
      .getByRole("button", { name: "Simulate payment locally" })
      .click();
    await page.getByRole("link", { name: "Open hosted policies" }).waitFor();
    hosted = (await page
      .getByRole("link", { name: "Open hosted policies" })
      .getAttribute("href"))!;
  }
  if (i === 4) await page.goto(base + hosted);
  if (i === 5) {
    await page.goto(manage);
    await page.getByRole("button", { name: "Edit answers" }).click();
    await page.getByLabel("App or business name").fill("Orbit Notes Studio");
    for (let n = 0; n < 9; n++)
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("button", { name: "Save and republish" }).click();
    await page.getByRole("heading", { name: "Orbit Notes Studio", exact: true }).waitFor();
    await page.getByRole("button", { name: "Return to preview" }).click();
  }
  if (i === 6) await page.goto(base + hosted + "/privacy");
  await caption(scenes[i][0]);
  const remaining = durations[i] * 1000 - (Date.now() - start);
  if (remaining < 0) throw new Error("Scene exceeded narration allocation");
  await page.waitForTimeout(remaining);
}
async function intakeWithBase() {
  const original = page.goto.bind(page);
  page.goto = ((url: string, opts: Parameters<typeof original>[1]) =>
    original(url.startsWith("/") ? base + url : url, opts)) as typeof page.goto;
  await intake(page);
  page.goto = original;
}
const video = page.video()!;
await context.close();
const videoPath = await video.path();
await browser.close();
for (let i = 0; i < scenes.length; i++) {
  const r = spawnSync("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    `.local/video/voice-${i}.aiff`,
    "-af",
    "apad",
    "-t",
    String(durations[i]),
    "-ar",
    "48000",
    "-ac",
    "1",
    `.local/video/audio-${i}.wav`,
  ]);
  if (r.status !== 0) throw new Error("Audio preparation failed");
}
await writeFile(
  ".local/video/audio-list.txt",
  scenes.map((_, i) => `file 'audio-${i}.wav'`).join("\n"),
);
const joined = spawnSync("ffmpeg", [
  "-y",
  "-v",
  "error",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  ".local/video/audio-list.txt",
  "-c",
  "copy",
  ".local/video/narration.wav",
]);
if (joined.status !== 0) throw new Error("Audio concatenation failed");
const render = spawnSync("ffmpeg", [
  "-y",
  "-v",
  "error",
  "-i",
  videoPath,
  "-i",
  ".local/video/narration.wav",
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "24",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-shortest",
  "-movflags",
  "+faststart",
  "docs/demo.mp4",
]);
if (render.status !== 0) throw new Error("Video encode failed");
spawnSync("ffmpeg", [
  "-y",
  "-v",
  "error",
  "-ss",
  "3",
  "-i",
  "docs/demo.mp4",
  "-frames:v",
  "1",
  "docs/demo-poster.png",
]);
console.log(
  `Created narrated real-browser demo (${Math.round((Date.now() - started) / 1000)} seconds including encoding).`,
);
