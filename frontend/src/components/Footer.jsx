import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Socials from "./Socials.jsx";

// About and Projects are pages; Home/Services are sections on this (home) page.
const navHref = (item) => {
  const k = item.toLowerCase();
  if (k === "about") return "/about";
  if (k === "projects") return "/projects";
  return `#${k}`;
};
const isRoute = (item) => ["about", "projects"].includes(item.toLowerCase());

// Button that leans toward the cursor (magnetic), springing back on leave.
function MagneticButton({ href, children, className }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15 });
  const y = useSpring(my, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// Each word slides up from a clipped line for the headline reveal.
const wordVariant = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Word({ children, accent }) {
  return (
    <span className="mr-[0.25em] inline-block overflow-hidden align-bottom">
      <motion.span
        variants={wordVariant}
        className={`inline-block ${accent ? "text-[#c9a27e]" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Footer({ logo, nav, socials, email, footer }) {
  const { available, headlineLead, headlineAccent, ctaLabel, trust, copyright } =
    footer;
  // Gmail compose opens reliably in the browser (no mail client needed).
  const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent("Project inquiry")}`;

  return (
    <footer
      id="footer"
      data-theme="dark"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-espresso to-black px-6 pb-8 pt-28 text-cream sm:px-10"
    >
      {/* Top: availability + label */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-sage">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {available}
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-cream/40">
          The end — or the start
        </span>
      </div>

      {/* Middle: the pitch */}
      <div className="py-12">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.08 }}
          className="font-sans font-extrabold uppercase leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}
        >
          {headlineLead.split(" ").map((w, i) => (
            <Word key={`l-${i}`}>{w}</Word>
          ))}
          <br />
          {headlineAccent.split(" ").map((w, i) => (
            <Word key={`a-${i}`} accent>
              {w}
            </Word>
          ))}
        </motion.h2>

        {/* CTA + email */}
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-espresso transition-colors hover:bg-white"
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </MagneticButton>
          <span className="text-sm text-cream/65">
            or email{" "}
            <a
              href={mailHref}
              target="_blank"
              rel="noreferrer"
              className="text-cream underline underline-offset-4 transition-colors hover:text-white"
            >
              {email}
            </a>
          </span>
        </div>

        {/* Trust line */}
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/50">
          {trust.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-cream/40" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee ribbon */}
      <div
        className="select-none overflow-hidden border-y border-cream/10 py-4"
        aria-hidden="true"
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="flex shrink-0">
              {Array.from({ length: 6 }).map((__, i) => (
                <span
                  key={i}
                  className="mx-6 text-2xl font-semibold uppercase tracking-tight text-cream/25"
                >
                  Let's talk <span className="text-[#c9a27e]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 text-sm">
        <a href="#home" className="flex items-center gap-2 text-cream">
          <span className="text-xl leading-none">✦</span>
          <span className="font-gondens text-lg tracking-wide">{logo}</span>
        </a>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-cream/60">
          {nav.map((item) =>
            isRoute(item) ? (
              <Link
                key={item}
                to={navHref(item)}
                className="transition-colors hover:text-cream"
              >
                {item}
              </Link>
            ) : (
              <a
                key={item}
                href={navHref(item)}
                className="transition-colors hover:text-cream"
              >
                {item}
              </a>
            ),
          )}
        </nav>

        <Socials items={socials} />

        <div className="flex items-center gap-5">
          <span className="text-xs text-cream/40">{copyright}</span>
          <a
            href="#home"
            className="inline-flex items-center gap-1 text-xs text-cream/60 transition-colors hover:text-cream"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
