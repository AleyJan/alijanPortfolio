import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// How many projects to feature here; the rest live on the /projects page.
const MAX_FEATURED = 5;

// New project shape uses images[]/live; fall back to the old img/href fields.
const projImg = (p) => (p.images && p.images[0]) || p.img || "";
const projLive = (p) => p.live || p.href || "";
// Scroll distance (in vh) the pinned stage holds for each project before the
// section releases. Higher = slower reveal.
const SCROLL_PER_PROJECT = 34;
// Extra pinned scroll (vh) held after the last project — this is the room the
// Contact section rises up over. Must match Contact's `lg:-mt-[100vh]`.
const RISE_ROOM = 100;

export default function MyWork({ heading = "My Work", projects = [] }) {
  const sectionRef = useRef(null);
  const shown = projects.slice(0, MAX_FEATURED);
  const count = shown.length;

  // Desktop gets the pinned, scroll-driven index; below lg we render a simple
  // stacked list of linked project cards instead.
  const [desktop, setDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [active, setActive] = useState(0);

  // Map scroll position within the pinned section to the active project index.
  // Computed straight from the section's rect so it's robust and predictable:
  // -rect.top is how far we've scrolled into the section; the pinnable span is
  // the section height minus one viewport (the sticky stage).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !count) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      // Projects reveal over the first (count * SCROLL_PER_PROJECT) vh of scroll.
      // The remaining RISE_ROOM keeps the last project pinned while Contact rises.
      const revealPx = ((count * SCROLL_PER_PROJECT) / 100) * window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const p = revealPx > 0 ? Math.min(1, scrolled / revealPx) : 0;
      const i = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
      setActive(i);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, desktop]);

  if (!count) return null;

  const cur = shown[Math.min(active, count - 1)];
  const sectionHeight = 100 + count * SCROLL_PER_PROJECT + RISE_ROOM; // vh

  const moreLink = (
    <Link
      to="/projects"
      className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-white"
    >
      More projects <span aria-hidden="true">→</span>
    </Link>
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-theme="light"
      className="relative w-full bg-white text-black"
      style={desktop ? { height: `${sectionHeight}vh` } : undefined}
    >
      {/* ---------- Mobile / tablet: simple stacked list ---------- */}
      <div className="px-6 py-20 sm:px-10 lg:hidden">
        <h2
          className="font-sans font-extrabold tracking-tight"
          style={{ fontSize: "clamp(2.9rem, 8vw, 2.75rem)" }}
        >
          {heading}
        </h2>
        <div className="mt-10 flex flex-col gap-12">
          {shown.map((p) => (
            <a
              key={p.title}
              href={projLive(p) || undefined}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-black/10">
                <img
                  src={projImg(p)}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
                {p.title}
              </h3>
            </a>
          ))}
        </div>
        <div className="mt-12">{moreLink}</div>
      </div>

      {/* ---------- Desktop: pinned scroll-driven index ---------- */}
      <div className="sticky top-0 hidden h-screen w-full lg:block">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-10 pt-24 pb-12">
          <h2
            className="mb-8 translate-y-[9px] font-sans font-extrabold tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
          >
            {heading}
          </h2>

          <div className="grid grid-cols-2 items-center gap-16">
            {/* Left: project names + more link */}
            <div>
              <ul className="flex flex-col gap-1">
                {shown.map((p, i) => {
                  const on = active === i;
                  return (
                    <li key={p.title}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-baseline gap-4 py-1.5 transition-all duration-300"
                        style={{ transform: on ? "translateX(10px)" : "none" }}
                      >
                        <span
                          className={`font-mono text-sm transition-colors duration-300 ${
                            on ? "text-black/50" : "text-black/20"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-sans font-extrabold uppercase leading-tight tracking-tight transition-colors duration-300 ${
                            on ? "text-black" : "text-black/25"
                          }`}
                          style={{ fontSize: "clamp(1.25rem, 2.1vw, 2rem)" }}
                        >
                          {p.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8">{moreLink}</div>
            </div>

            {/* Right: sticky image that crossfades to the active project */}
            <div className="relative h-[56vh] w-full -translate-y-2 overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-black/10 shadow-2xl shadow-black/20">
              <AnimatePresence>
                <motion.a
                  key={active}
                  href={projLive(cur) || undefined}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 block"
                >
                  <img
                    src={projImg(cur)}
                    alt={cur.title}
                    className="h-full w-full object-contain"
                  />
                  {/* title label */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                    <span className="text-lg font-semibold text-white">
                      {cur.title}
                    </span>
                  </div>
                </motion.a>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
