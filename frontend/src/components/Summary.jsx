import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Brief professional summary shown on the Home page, directly beneath the hero.
// It answers "who is Ali?" in a couple of sentences so any first-time visitor
// immediately understands who he is and what he does.
//
// Kept on the dark theme so it flows seamlessly out of the black hero above and
// into the Skills dark→white seam below. All copy comes from `content.summary`
// so it stays editable from the admin dashboard.

const FALLBACK = {
  eyebrow: "About Me",
  headingLead: "Who is",
  headingAccent: "Ali?",
  body: "I'm Ali Jan, a Full-Stack Developer from Pakistan specializing in the MERN stack. Over the past two years I've built and shipped real production apps — from a complete e-commerce platform for a UK-based client to booking systems and admin dashboards. I'm currently interning remotely at Dev Weekends and researching AI/ML through the SISTER program, always focused on turning real problems into clean, reliable products people enjoy using.",
  highlights: [
    "2+ Years Experience",
    "MERN Stack Developer",
    "AI/ML Researcher",
    "BS Computer Science",
  ],
  ctaLabel: "More about me",
};

export default function Summary({ content = {} }) {
  const { eyebrow, headingLead, headingAccent, body, highlights, ctaLabel } = {
    ...FALLBACK,
    ...content,
  };
  const pills = Array.isArray(highlights) ? highlights : FALLBACK.highlights;

  return (
    <section
      id="summary"
      data-theme="dark"
      className="relative w-full bg-black text-cream"
    >
      <div className="mx-auto max-w-4xl px-6 py-24 sm:px-10 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/40">
            {eyebrow}
          </p>

          {/* Heading */}
          <h2
            className="mt-4 font-sans font-extrabold leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
          >
            <span className="text-cream/45">{headingLead} </span>
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px #c9a27e" }}
            >
              {headingAccent}
            </span>
          </h2>

          {/* Summary paragraph */}
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-cream/70 sm:text-lg">
            {body}
          </p>

          {/* Highlight pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {pills.map((p) => (
              <span
                key={p}
                className="rounded-full border border-cream/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-cream/70"
              >
                {p}
              </span>
            ))}
          </div>

          {/* CTA to the full About page */}
          {ctaLabel && (
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-[#c9a27e]"
            >
              {ctaLabel} <span aria-hidden="true">→</span>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
