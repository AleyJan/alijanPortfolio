import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Socials from "../components/Socials.jsx";
import { defaultContent } from "../content.js";
import { api } from "../api.js";

// Deep caramel — the site's accent (#c9a27e) darkened for legible contrast on
// the white About page.
const ACCENT = "#a9713a";

// All About-page copy lives here as defaults. Only `resumeUrl` is wired to the
// admin dashboard for now (merged over this via content.about); the rest can be
// promoted to the dashboard later.
const ABOUT = {
  name: "Ali Jan",
  title: "Full-Stack Developer",
  intro:
    "I'm a Full-Stack Developer specializing in the MERN stack — building modern, scalable, and user-friendly web applications. I turn real-world problems into clean, reliable products, and I care as much about the developer experience as I do about the people using what I build.",
  tags: [
    "Problem solver",
    "Hard worker",
    "Consistent builder",
    "Lifelong learner",
  ],
  location: "Pakistan",
  build: [
    {
      title: "MERN Stack",
      subtitle: "End-to-end web apps",
      tags: ["React", "Node.js", "Express", "MongoDB"],
    },
    {
      title: "Modern Frontend",
      subtitle: "Fast, responsive UIs",
      tags: ["React", "Tailwind CSS", "shadcn/ui"],
    },
    {
      title: "Backend & Data",
      subtitle: "APIs & data layers",
      tags: ["Node.js", "Express", "MongoDB", "Redis"],
    },
    {
      title: "Tools & Delivery",
      subtitle: "Ship and iterate",
      tags: ["Git", "GitHub", "Cloudinary", "Sanity CMS"],
    },
  ],
  whyPills: [
    "2 Years Experience",
    "Remote Internship",
    "AI/ML Research",
    "MERN Stack",
    "Freelance Projects",
    "BS Computer Science",
  ],
  whyCards: [
    {
      title: "One Developer, Full Stack",
      body: "From database design to a polished UI, I handle the whole build — React, Node.js, Express and MongoDB — so your product ships as one coherent, maintainable system.",
    },
    {
      title: "Real, Shipped Work",
      body: "I've built and delivered production projects, including a complete e-commerce website for a UK-based client, alongside internships and self-driven builds. I ship things that actually work.",
    },
    {
      title: "Always Learning",
      body: "Currently researching AI/ML through the SISTER program and interning remotely at Dev Weekends. I keep leveling up so your project is built with modern, proven tools.",
    },
  ],
  experience: [
    {
      role: "Full-Stack Developer Intern",
      org: "Dev Weekends",
      period: "Jun 2026 – Present",
      location: "Remote",
      desc: "Building and maintaining full-stack web applications with the MERN stack as part of a remote engineering team.",
    },
    {
      role: "AI/ML Researcher — SISTER Program",
      org: "Synthica · Dubai Computer Science Society",
      period: "Jun 2026 – Aug 2026",
      location: "Remote",
      desc: "Selected for the SISTER research program to carry out collaborative research in the AI/ML field alongside an international cohort.",
    },
    {
      role: "Freelance Full-Stack Developer",
      org: "UK-based Client",
      period: "2024 – 2026",
      location: "Remote",
      desc: "Designed and built a complete e-commerce website for a UK-based business — from the storefront and product experience to the backend and admin.",
    },
  ],
  education: [
    {
      title: "BS Computer Science",
      org: "Shaikh Zayed Islamic Centre, University of Peshawar",
      period: "2022 – Jun 2026",
      desc: "Core coursework across data structures & algorithms, databases, web development, and software engineering.",
    },
    {
      title: "MERN Stack — Full Course & Certification",
      org: "Saylani Mass IT Training(SMIT), Peshawar",
      period: "Nov 2024 – Mar 2026",
      desc: "In-depth, hands-on training across MongoDB, Express, React and Node.js — building real full-stack applications end to end.",
    },
  ],
  contactHeading: "Have a project in mind?",
  contactSub:
    "Reach out via email or any social platform — let's build something great together.",
};

function Pill({ children }) {
  return (
    <span className="rounded-full border border-black/15 bg-white px-4 py-1.5 text-sm font-medium text-black/70">
      {children}
    </span>
  );
}

// A vertical timeline (used by Experience and Education). Each row draws its own
// dot + connecting line beside the content, so it's robust regardless of length.
function Timeline({ items }) {
  return (
    <div className="mt-12">
      {items.map((it, i) => (
        <div key={i} className="flex gap-5 sm:gap-7">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-espresso ring-4 ring-white" />
            {i < items.length - 1 && (
              <span className="w-px flex-1 bg-black/15" />
            )}
          </div>
          <div className="flex-1 pb-12">
            <h3 className="text-lg font-bold text-espresso sm:text-xl">
              {it.role || it.title}
              {it.org && <span style={{ color: ACCENT }}> @ {it.org}</span>}
            </h3>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-black/45">
              {it.period}
              {it.location ? ` · ${it.location}` : ""}
            </p>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-black/60">
              {it.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Home, About and Projects are pages; the rest are home-page section anchors.
const navHref = (item) => {
  const k = item.toLowerCase();
  if (k === "home") return "/";
  if (k === "about") return "/about";
  if (k === "projects") return "/projects";
  return `/#${k}`;
};
const isRoute = (item) =>
  ["home", "about", "projects"].includes(item.toLowerCase());

export default function About() {
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    let active = true;
    api
      .getContent()
      .then(
        (data) =>
          active && data && typeof data === "object" && setContent(data),
      )
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const a = ABOUT;
  const resumeUrl = content.about?.resumeUrl || "";
  const email = content.contact?.email || "alijan.dev507@gmail.com";
  const socials = content.socials || [];
  // Gmail compose opens reliably in the browser (no mail-client needed).
  const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent("Project inquiry")}`;
  const [first, ...restName] = a.name.split(" ");
  const rest = restName.join(" ");

  const btnBase =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <Navbar
        logo={content.logo}
        links={content.nav}
        cta={content.cta}
        theme="light"
      />

      {/* ---------- Header ---------- */}
      <header className="mx-auto max-w-6xl px-6 pb-16 pt-32 sm:px-10 sm:pt-36">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <img
            src={content.image || "/hero.png"}
            alt={a.name}
            className="h-40 w-40 shrink-0 rounded-2xl object-cover object-top ring-1 ring-black/10 grayscale sm:h-48 sm:w-48"
          />
          <div className="flex-1">
            <h1
              className="font-sans font-extrabold leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              <span className="text-espresso">{first} </span>
              {rest && <span style={{ color: ACCENT }}>{rest}</span>}
            </h1>
            <p className="mt-2 text-lg font-semibold text-black/70">
              {a.title}
            </p>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-black/60">
              {a.intro}
            </p>
            <p className="mt-4 text-sm text-black/45">{a.tags.join("  ·  ")}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={resumeUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`${btnBase} bg-espresso text-cream hover:bg-black ${
                  resumeUrl ? "" : "pointer-events-none opacity-50"
                }`}
              >
                Resume / CV <span aria-hidden="true">↗</span>
              </a>
              <a
                href="#contact"
                className={`${btnBase} border border-black/20 text-espresso hover:bg-black hover:text-white`}
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- What I build with ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
          What I build with
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {a.build.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-black/10 bg-black/[0.015] p-5"
            >
              <h3 className="font-bold text-espresso">{b.title}</h3>
              <p className="mt-1 text-sm text-black/45">{b.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Why Me ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:px-10">
        <h2
          className="font-sans font-extrabold tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          <span className="text-espresso">Why </span>
          <span style={{ color: ACCENT }}>Me?</span>
        </h2>
        <p className="mt-3 text-black/45">
          Here's what makes working with me different.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {a.whyPills.map((p) => (
            <Pill key={p}>{p}</Pill>
          ))}
        </div>
        <div className="mt-10 grid gap-5 text-left md:grid-cols-3">
          {a.whyCards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-black/10 bg-black/[0.015] p-6"
            >
              <h3 className="font-bold text-espresso">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Experience ---------- */}
      <section
        id="experience"
        className="mx-auto max-w-4xl px-6 py-12 sm:px-10"
      >
        <h2
          className="text-center font-sans font-extrabold uppercase tracking-tight text-espresso"
          style={{ fontSize: "clamp(2.75rem, 9vw, 6.5rem)" }}
        >
          Experience
        </h2>
        <Timeline items={a.experience} />
      </section>

      {/* ---------- Education ---------- */}
      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <h2
          className="text-center font-sans font-extrabold uppercase tracking-tight text-espresso"
          style={{ fontSize: "clamp(2.75rem, 9vw, 6.5rem)" }}
        >
          Education
        </h2>
        <Timeline items={a.education} />
      </section>

      {/* ---------- Contact ---------- */}
      <section
        id="contact"
        className="mx-auto max-w-4xl px-6 pb-20 pt-8 sm:px-10"
      >
        <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-8 text-center sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            Get in touch
          </p>
          <h3 className="mt-3 text-2xl font-bold text-espresso sm:text-3xl">
            {a.contactHeading}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-black/60">
            {a.contactSub}
          </p>
          <a
            href={mailHref}
            target="_blank"
            rel="noreferrer"
            className={`${btnBase} mt-7 bg-espresso text-cream hover:bg-black`}
          >
            ✉ Send Email
          </a>
          <p className="mt-4 text-sm text-black/45">
            Or email directly:{" "}
            <a
              href={mailHref}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
              style={{ color: ACCENT }}
            >
              {email}
            </a>
          </p>
        </div>
      </section>

      {/* ---------- Footer bar ---------- */}
      <footer className="bg-espresso text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-5 px-6 py-6 sm:px-10">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl leading-none">✦</span>
            <span className="font-gondens text-lg tracking-wide">
              {content.logo}
            </span>
          </Link>

          {/* nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/60">
            {(content.nav || []).map((item) =>
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
            <span className="text-xs text-cream/40">
              {content.footer?.copyright || "© 2026 Alijan"}
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 text-xs text-cream/60 transition-colors hover:text-cream"
            >
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
