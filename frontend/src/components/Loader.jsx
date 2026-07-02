import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Intro loading screen. Fills a progress bar 0 → 100% over exactly 4s, then
// calls onDone so the portfolio underneath can take over. Cream background with
// espresso text + the Gondens display face, matching the site theme.
//
// All copy (eyebrow, title, role, skill pills) comes from `content.loader` so
// it stays editable from the admin dashboard without code changes.
const DURATION = 2000; // 2 seconds

const FALLBACK = {
  eyebrow: "Ali Jan — 2026",
  title: "PORTFOLIO",
  role: "Full Stack Engineer",
  skills: ["React", "Express", "MongoDB", "Node.js"],
};

export default function Loader({ content = {}, onDone }) {
  const { eyebrow, title, role, skills } = { ...FALLBACK, ...content };
  const [progress, setProgress] = useState(0);

  // Hold the big title hidden until Gondens is actually loaded, so it never
  // flashes in the fallback font first. Falls back to showing after 2s in the
  // unlikely case the font never resolves.
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    if (!document.fonts?.load) {
      setFontReady(true);
      return;
    }
    let alive = true;
    document.fonts.load("1em Gondens").then(() => alive && setFontReady(true));
    const t = setTimeout(() => alive && setFontReady(true), 2000);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    // rAF drives the smooth bar/counter animation…
    const tick = () => {
      const pct = Math.min(100, ((performance.now() - start) / DURATION) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // …but a real timer guarantees the handoff even if rAF is throttled
    // (e.g. the tab is briefly backgrounded during load).
    const done = setTimeout(() => {
      setProgress(100);
      onDone?.();
    }, DURATION + 450); // 450ms hold on 100%
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [onDone]);

  const pct = Math.round(progress);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-cream text-espresso"
    >
      <div className="flex w-full max-w-2xl flex-col items-center px-6 text-center">
        {/* Eyebrow — name + year */}
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-espresso/50 sm:text-[0.7rem]">
          {eyebrow}
        </p>

        {/* Giant display word (matches the hero, a touch smaller).
            Gondens has huge ink overshoot (~1.6× font size, all above the
            baseline), so on laptop we shrink it and give it a roomy
            line-height to reserve space and avoid overlapping neighbours.
            Mobile keeps its tight, perfect settings. */}
        <h1
          className="my-6 select-none break-words px-2 font-gondens leading-[0.85] text-espresso text-[13vw] transition-opacity duration-200 sm:my-5 sm:text-[clamp(2.5rem,6vw,4.75rem)] sm:leading-[1.75]"
          style={{ letterSpacing: "0.06em", opacity: fontReady ? 1 : 0 }}
        >
          {title}
        </h1>

        {/* Role divider */}
        <div className="flex w-full max-w-md items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-espresso/25" />
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-espresso/50" />
          <span className="whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-[0.25em] text-espresso/70 sm:text-xs sm:tracking-[0.3em]">
            {role}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-espresso/50" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-espresso/25" />
        </div>

        {/* Skill pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {skills.map((t) => (
            <span
              key={t}
              className="rounded-full border border-espresso/20 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-espresso/70"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-12 w-full max-w-md">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-espresso/10">
            <div
              className="h-full rounded-full bg-espresso"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-espresso/50">
              Complete
            </span>
            <span className="font-gondens text-3xl leading-none text-espresso">
              {pct}
              <span className="ml-0.5 align-top text-sm text-espresso/50">%</span>
            </span>
          </div>
        </div>

        {/* Pulsing dots */}
        <div className="mt-8 flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-espresso"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
