import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Socials from "../components/Socials.jsx";
import { defaultContent } from "../content.js";
import { api } from "../api.js";

const ACCENT = "#a9713a";

// Backward-compatible accessors (old projects used img/href).
const projImages = (p) =>
  p.images && p.images.length ? p.images : p.img ? [p.img] : [];
const projLive = (p) => p.live || p.href || "";

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LiveIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

// Image carousel: prev/next arrows + dots. Falls back to a placeholder when a
// project has no images yet.
function Slider({ images, alt }) {
  const [i, setI] = useState(0);
  if (!images.length)
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black/5 text-sm text-black/30">
        No images yet
      </div>
    );
  const go = (d) => setI((p) => (p + d + images.length) % images.length);
  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-black">
      <img
        src={images[i]}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        draggable="false"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {images.map((_, d) => (
              <button
                type="button"
                key={d}
                aria-label={`Go to image ${d + 1}`}
                onClick={() => setI(d)}
                className={`h-2 rounded-full transition-all ${
                  i === d ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const images = projImages(project);
  const live = projLive(project);
  const source = project.source || "";
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm shadow-black/[0.03]">
      <Slider images={images} alt={project.title} />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-espresso">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/60">
          {project.description}
        </p>

        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/70"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {(source || live) && (
          <div className="mt-6 flex items-center justify-end gap-6 border-t border-black/5 pt-4 text-sm font-medium">
            {source && (
              <a
                href={source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-black/70 transition-colors hover:text-espresso"
              >
                <GithubIcon className="h-4 w-4" /> Source
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-black/70 transition-colors hover:text-espresso"
              >
                <LiveIcon className="h-4 w-4" /> Live
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Home and About/Projects are pages; the rest are home-page section anchors.
const navHref = (item) => {
  const k = item.toLowerCase();
  if (k === "home") return "/";
  if (k === "about") return "/about";
  if (k === "projects") return "/projects";
  return `/#${k}`;
};
const isRoute = (item) =>
  ["home", "about", "projects"].includes(item.toLowerCase());

export default function Projects() {
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

  const projects = content.projects || [];
  const socials = content.socials || [];

  return (
    <div className="min-h-screen w-full bg-white text-black">
      <Navbar
        logo={content.logo}
        links={content.nav}
        cta={content.cta}
        theme="light"
      />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 sm:px-10 sm:pt-36">
        <h1
          className="font-sans font-extrabold tracking-tight text-espresso"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          Projects
        </h1>
        <p className="mt-3 text-black/50">
          Here are some of the projects I'd like to share
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.title || i} project={p} />
          ))}
        </div>
      </section>

      {/* ---------- Footer bar ---------- */}
      <footer className="bg-espresso text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-5 px-6 py-6 sm:px-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl leading-none">✦</span>
            <span className="font-gondens text-lg tracking-wide">
              {content.logo}
            </span>
          </Link>

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
