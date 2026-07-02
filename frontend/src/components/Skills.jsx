import { useState } from "react";

// Skills section (replaces the old Welcome section). Keeps Welcome's role as the
// dark → white seam between the dark hero and the white MyWork/Services below.
//
// A single dynamic list (`skills.items`) drives BOTH the tech-stack pills on the
// right and the scrolling icon marquee on the left, so it's all editable from
// the admin dashboard in one place. Icons default to the simple-icons CDN but
// can be overridden with an uploaded image per item.

const FALLBACK = {
  headingLead: "My",
  headingAccent: "Skills",
  subline:
    "Technologies and tools I use to build modern, scalable and efficient digital solutions.",
  items: [
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript" },
    { name: "React", icon: "https://cdn.simpleicons.org/react" },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs" },
    { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb" },
    { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
    { name: "Redis", icon: "https://cdn.simpleicons.org/redis" },
    { name: "Cloudinary", icon: "https://cdn.simpleicons.org/cloudinary" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss" },
    { name: "shadcn/ui", icon: "https://cdn.simpleicons.org/shadcnui/000000" },
    { name: "Sanity CMS", icon: "https://cdn.simpleicons.org/sanity" },
    { name: "Git", icon: "https://cdn.simpleicons.org/git" },
    { name: "GitHub", icon: "https://cdn.simpleicons.org/github/000000" },
  ],
};

// A single icon tile. Falls back to the skill's name if the icon fails to load
// (bad URL, CDN down, or an admin-added skill with no valid icon).
function IconTile({ item }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      title={item.name}
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-sm shadow-black/5"
    >
      {item.icon && !failed ? (
        <img
          src={item.icon}
          alt={item.name}
          loading="lazy"
          draggable="false"
          className="h-8 w-8 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-1 text-center text-[10px] font-bold uppercase leading-tight text-black/55">
          {item.name}
        </span>
      )}
    </div>
  );
}

// One infinite marquee row. The items are duplicated so the -50% translate loops
// seamlessly. Pauses on hover and for users who prefer reduced motion.
function MarqueeRow({ items, reverse }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="marquee-fade group relative overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
      >
        {row.map((s, i) => (
          <IconTile key={`${s.name}-${i}`} item={s} />
        ))}
      </div>
    </div>
  );
}

export default function Skills({ content = {} }) {
  const { headingLead, headingAccent, subline, items } = {
    ...FALLBACK,
    ...content,
  };
  const list = Array.isArray(items) && items.length ? items : FALLBACK.items;
  const iconItems = list.filter((s) => s.icon);

  // Split the icons across two rows that scroll in opposite directions.
  const mid = Math.ceil(iconItems.length / 2);
  const rowA = iconItems.slice(0, mid);
  const rowB = iconItems.slice(mid);

  return (
    <section id="skills" className="relative w-full bg-white text-black">
      {/* Dark → white seam. Tagged dark so the navbar stays light-on-dark while
          this band sits under it, then flips once the white body arrives. */}
      <div
        data-theme="dark"
        className="h-[40vh] w-full bg-gradient-to-b from-black via-black to-white"
      />

      {/* White body */}
      <div
        data-theme="light"
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-28 pt-4 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-36"
      >
        {/* LEFT — heading, subline, marquee */}
        <div>
          <h2
            className="font-sans font-extrabold leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
          >
            <span className="text-black/35">{headingLead} </span>
            <span className="text-black">{headingAccent}</span>
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-black/55">
            {subline}
          </p>

          <div className="mt-12 space-y-4">
            <MarqueeRow items={rowA} />
            <MarqueeRow items={rowB} reverse />
          </div>
        </div>

        {/* RIGHT — tech-stack pills */}
        <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-7 sm:p-9">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-black/45">
            Tech Stack
          </h3>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {list.map((s) => (
              <span
                key={s.name}
                className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-black/75 shadow-sm shadow-black/[0.03] transition-colors hover:border-black/40 hover:text-black"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
