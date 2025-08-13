import { spawn } from "node:child_process";

const routes = ["/", "/el", "/el/login", "/el/announcements", "/el/articles", "/el/events"];
const base = "http://localhost:4000";

function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(base, { redirect: "manual" as any });
      if (res.status === 200 || res.status === 307) return true;
    } catch {}
    await wait(500);
  }
  return false;
}

async function run() {
  const child = spawn("pnpm", ["exec", "next", "start", "-p", "4000"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  let killed = false;
  const killServer = () => {
    if (!killed) { child.kill("SIGTERM"); killed = true; }
  };
  process.on("exit", killServer);
  process.on("SIGINT", () => { killServer(); process.exit(1); });
  process.on("SIGTERM", () => { killServer(); process.exit(1); });

  const ok = await waitForServer();
  if (!ok) {
    killServer();
    console.error("Smoke: server did not start within 30s");
    process.exit(1);
  }

  let allGood = true;
  for (const r of routes) {
    try {
      const res = await fetch(base + r, { redirect: "manual" as any });
      const status = res.status;
      const expect = r === "/" ? 307 : 200;
      const pass = status === expect;
      console.log(`${r} -> ${status} ${pass ? "✓" : "✗ (expected " + expect + ")"}`);
      if (!pass) allGood = false;
    } catch (e) {
      console.log(`${r} -> ERROR ${String(e)}`);
      allGood = false;
    }
  }

  killServer();
  if (!allGood) process.exit(1);
}

run().catch(err => { console.error(err); process.exit(1); });