import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../api.js";
import { defaultContent } from "../content.js";

const FIELD =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream placeholder-cream/35 outline-none transition-colors focus:border-cream/50";

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      {title && <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cream/70">{title}</h2>}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, textarea, rows = 3 }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">{label}</span>}
      {textarea ? (
        <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${FIELD} resize-none`} />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={FIELD} />
      )}
    </label>
  );
}

// Editable list of plain strings.
function StringList({ label, items = [], onChange }) {
  return (
    <div>
      {label && <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">{label}</span>}
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className={FIELD}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-white/15 px-3 text-sm text-cream/60 hover:border-red-400/50 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="w-fit rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:border-cream/40 hover:text-cream"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

// Image URL with optional upload to the backend.
function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      {label && <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">{label}</span>}
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-14 rounded-lg object-cover ring-1 ring-white/10" />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-white/5 text-xs text-cream/30">none</div>
        )}
        <div className="flex-1">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" className={FIELD} />
          <label className="mt-1.5 inline-block cursor-pointer text-xs text-cream/60 hover:text-cream">
            {busy ? "Uploading…" : "↑ Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        </div>
      </div>
    </div>
  );
}

// Resume / CV upload (PDF). Same upload endpoint as images (now PDF-enabled).
function ResumeField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">
        Resume / CV (PDF)
      </span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Resume PDF URL"
        className={FIELD}
      />
      <div className="mt-2 flex items-center gap-4 text-xs">
        <label className="inline-block cursor-pointer text-cream/60 hover:text-cream">
          {busy ? "Uploading…" : "↑ Upload PDF"}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-cream/60 underline hover:text-cream"
          >
            View current ↗
          </a>
        )}
      </div>
    </div>
  );
}

function ContentEditor({ draft, setDraft }) {
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const setIn = (section, key, value) =>
    setDraft((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Brand & hero">
        <Input label="Logo" value={draft.logo} onChange={(v) => set("logo", v)} />
        <Input label="Navbar CTA label" value={draft.cta} onChange={(v) => set("cta", v)} />
        <ImageField label="Hero portrait" value={draft.image} onChange={(v) => set("image", v)} />
        <StringList label="Nav links" items={draft.nav} onChange={(v) => set("nav", v)} />
      </Card>

      <Card title="About page">
        <ResumeField value={draft.about?.resumeUrl} onChange={(v) => setIn("about", "resumeUrl", v)} />
      </Card>

      <Card title="Loading screen">
        <Input label="Eyebrow (name — year)" value={draft.loader?.eyebrow} onChange={(v) => setIn("loader", "eyebrow", v)} />
        <Input label="Big title" value={draft.loader?.title} onChange={(v) => setIn("loader", "title", v)} />
        <Input label="Role" value={draft.loader?.role} onChange={(v) => setIn("loader", "role", v)} />
        <StringList label="Skill pills" items={draft.loader?.skills} onChange={(v) => setIn("loader", "skills", v)} />
      </Card>

      <Card title="Hero">
        <Input label="Eyebrow" value={draft.eyebrow} onChange={(v) => set("eyebrow", v)} />
        <Input label="Greeting" value={draft.greeting} onChange={(v) => set("greeting", v)} />
        <Input label="Name" value={draft.name} onChange={(v) => set("name", v)} />
        <Input label="Description" textarea value={draft.description} onChange={(v) => set("description", v)} />
        <StringList label="Rotating roles" items={draft.roles} onChange={(v) => set("roles", v)} />
      </Card>

      <Card title="Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Heading (lead)" value={draft.skills?.headingLead} onChange={(v) => setIn("skills", "headingLead", v)} />
          <Input label="Heading (accent)" value={draft.skills?.headingAccent} onChange={(v) => setIn("skills", "headingAccent", v)} />
        </div>
        <Input label="Sub-line" textarea value={draft.skills?.subline} onChange={(v) => setIn("skills", "subline", v)} />
        <div>
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">
            Skills — name + icon (powers both the pills and the marquee)
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {(draft.skills?.items || []).map((s, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-white/10 p-3">
                <Input label={`Skill ${i + 1} name`} value={s.name} onChange={(v) => setIn("skills", "items", (draft.skills?.items || []).map((x, j) => (j === i ? { ...x, name: v } : x)))} />
                <ImageField label="Icon" value={s.icon} onChange={(v) => setIn("skills", "items", (draft.skills?.items || []).map((x, j) => (j === i ? { ...x, icon: v } : x)))} />
                <button type="button" onClick={() => setIn("skills", "items", (draft.skills?.items || []).filter((_, j) => j !== i))} className="w-fit text-xs text-red-400/80 hover:text-red-400">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIn("skills", "items", [...(draft.skills?.items || []), { name: "", icon: "" }])} className="mt-3 w-fit rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:border-cream/40 hover:text-cream">+ Add skill</button>
        </div>
      </Card>

      <Card title="Footer">
        <Input label="Availability" value={draft.footer?.available} onChange={(v) => setIn("footer", "available", v)} />
        <Input label="Headline lead" value={draft.footer?.headlineLead} onChange={(v) => setIn("footer", "headlineLead", v)} />
        <Input label="Headline accent" value={draft.footer?.headlineAccent} onChange={(v) => setIn("footer", "headlineAccent", v)} />
        <Input label="CTA label" value={draft.footer?.ctaLabel} onChange={(v) => setIn("footer", "ctaLabel", v)} />
        <StringList label="Trust points" items={draft.footer?.trust} onChange={(v) => setIn("footer", "trust", v)} />
        <Input label="Copyright" value={draft.footer?.copyright} onChange={(v) => setIn("footer", "copyright", v)} />
      </Card>

      <Card title="Contact">
        <Input label="Heading" value={draft.contact?.heading} onChange={(v) => setIn("contact", "heading", v)} />
        <Input label="Sub-line" textarea value={draft.contact?.subline} onChange={(v) => setIn("contact", "subline", v)} />
        <Input label="Email" value={draft.contact?.email} onChange={(v) => setIn("contact", "email", v)} />
        <StringList label="Project types" items={draft.contact?.projectTypes} onChange={(v) => setIn("contact", "projectTypes", v)} />
      </Card>

      <Card title="Services">
        <Input label="Section heading" value={draft.servicesHeading} onChange={(v) => set("servicesHeading", v)} />
        {(draft.services || []).map((s, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-white/10 p-3">
            <Input label={`Service ${i + 1} title`} value={s.title} onChange={(v) => set("services", draft.services.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
            <Input label="Description" value={s.desc} onChange={(v) => set("services", draft.services.map((x, j) => (j === i ? { ...x, desc: v } : x)))} />
            <button type="button" onClick={() => set("services", draft.services.filter((_, j) => j !== i))} className="w-fit text-xs text-red-400/80 hover:text-red-400">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => set("services", [...(draft.services || []), { title: "", desc: "" }])} className="w-fit rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:border-cream/40 hover:text-cream">+ Add service</button>
      </Card>

      <Card title="Projects">
        <Input label="Featured heading (home)" value={draft.workHeading} onChange={(v) => set("workHeading", v)} />
        <p className="-mt-2 text-xs text-cream/40">
          All projects show on the /projects page; the first 5 are featured on the home page.
        </p>
        <div className="flex flex-col gap-4">
          {(draft.projects || []).map((p, i) => {
            const patch = (obj) => set("projects", draft.projects.map((x, j) => (j === i ? { ...x, ...obj } : x)));
            const images = p.images || [];
            return (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-white/10 p-3">
                <Input label={`Project ${i + 1} title`} value={p.title} onChange={(v) => patch({ title: v })} />
                <Input label="Description" textarea value={p.description} onChange={(v) => patch({ description: v })} />
                <StringList label="Tech tags" items={p.tags || []} onChange={(v) => patch({ tags: v })} />
                <Input label="Live URL" value={p.live} onChange={(v) => patch({ live: v })} />
                <Input label="Source URL (GitHub — optional; blank hides the link)" value={p.source} onChange={(v) => patch({ source: v })} />
                <div>
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/45">Images (slider)</span>
                  <div className="flex flex-col gap-2">
                    {images.map((img, k) => (
                      <div key={k} className="flex items-start gap-2">
                        <div className="flex-1">
                          <ImageField value={img} onChange={(v) => patch({ images: images.map((y, m) => (m === k ? v : y)) })} />
                        </div>
                        <button type="button" onClick={() => patch({ images: images.filter((_, m) => m !== k) })} className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-sm text-cream/60 hover:border-red-400/50 hover:text-red-400">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => patch({ images: [...images, ""] })} className="w-fit rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:border-cream/40 hover:text-cream">+ Add image</button>
                  </div>
                </div>
                <button type="button" onClick={() => set("projects", draft.projects.filter((_, j) => j !== i))} className="w-fit text-xs text-red-400/80 hover:text-red-400">Remove project</button>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => set("projects", [...(draft.projects || []), { title: "", description: "", images: [], tags: [], live: "", source: "" }])} className="w-fit rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:border-cream/40 hover:text-cream">+ Add project</button>
      </Card>

      <Card title="Socials (used across the site)">
        {(draft.socials || []).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-sm text-cream/60">{s.name}</span>
            <input value={s.href} onChange={(e) => set("socials", draft.socials.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} placeholder="Profile URL" className={FIELD} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function LeadsInbox() {
  const [leads, setLeads] = useState(null);
  const load = () => api.getLeads().then(setLeads).catch(() => setLeads([]));
  useEffect(() => { load(); }, []);

  const toggle = async (l) => { await api.updateLead(l._id, !l.read); load(); };
  const remove = async (l) => { if (confirm("Delete this message?")) { await api.deleteLead(l._id); load(); } };

  if (!leads) return <p className="text-cream/50">Loading messages…</p>;
  if (leads.length === 0) return <p className="text-cream/50">No messages yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {leads.map((l) => (
        <div key={l._id} className={`rounded-2xl border p-4 ${l.read ? "border-white/10 bg-white/[0.02]" : "border-cream/25 bg-white/[0.05]"}`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-cream">{l.name}</span>
              <a href={`mailto:${l.email}`} className="text-sm text-cream/55 hover:text-cream">{l.email}</a>
              {l.projectType && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-cream/70">{l.projectType}</span>}
            </div>
            <span className="text-xs text-cream/40">{new Date(l.createdAt).toLocaleString()}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-cream/75">{l.message}</p>
          <div className="mt-3 flex gap-4 text-xs">
            <button onClick={() => toggle(l)} className="text-cream/60 hover:text-cream">{l.read ? "Mark unread" : "Mark read"}</button>
            <button onClick={() => remove(l)} className="text-red-400/80 hover:text-red-400">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState("content");
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the mobile menu when clicking outside of it.
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    api.getContent().then(setDraft).catch(() => setDraft(defaultContent));
  }, []);

  const save = async () => {
    setStatus("saving");
    try {
      // Keep the contact socials in sync with the main set for convenience.
      const payload = { ...draft, contact: { ...draft.contact, socials: draft.socials } };
      await api.saveContent(payload);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      setStatus("error");
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-espresso via-black to-black text-cream">
      <header ref={menuRef} className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 sm:px-10 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">✦</span>
            <span className="font-gondens text-lg tracking-wide">Admin</span>
          </div>

          {/* Desktop: tabs centred */}
          <nav className="hidden sm:flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 text-sm">
            {["content", "leads"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 capitalize transition-colors ${tab === t ? "bg-cream text-espresso" : "text-cream/70 hover:text-cream"}`}
              >
                {t === "leads" ? "Messages" : "Content"}
              </button>
            ))}
          </nav>

          {/* Desktop: actions */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/" className="text-cream/60 hover:text-cream">View site ↗</Link>
            <button
              onClick={logout}
              className="rounded-full border border-cream/30 px-4 py-1.5 hover:bg-cream hover:text-espresso"
            >
              Logout
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 block h-0.5 w-5 rounded-full bg-cream transition-all duration-200 ${menuOpen ? "top-[7px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-cream transition-all duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 block h-0.5 w-5 rounded-full bg-cream transition-all duration-200 ${menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-white/10 px-5 py-4 sm:hidden">
            <nav className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1 text-sm">
              {["content", "leads"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setMenuOpen(false); }}
                  className={`flex-1 rounded-full py-2 capitalize transition-colors ${tab === t ? "bg-cream text-espresso" : "text-cream/70 hover:text-cream"}`}
                >
                  {t === "leads" ? "Messages" : "Content"}
                </button>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-1 text-sm">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-cream/60 hover:bg-white/5 hover:text-cream"
              >
                View site ↗
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="rounded-xl px-3 py-2.5 text-left text-cream/60 hover:bg-white/5 hover:text-cream"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-10 sm:py-8">
        {tab === "content" ? (
          !draft ? (
            <p className="text-cream/50">Loading content…</p>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-semibold">Edit content</h1>
                <div className="flex items-center gap-3">
                  {status === "saved" && <span className="text-sm text-emerald-400">Saved ✓</span>}
                  {status === "error" && <span className="text-sm text-red-400">Save failed</span>}
                  <button
                    onClick={save}
                    disabled={status === "saving"}
                    className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-espresso hover:bg-white disabled:opacity-60"
                  >
                    {status === "saving" ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
              <ContentEditor draft={draft} setDraft={setDraft} />
            </>
          )
        ) : (
          <>
            <h1 className="mb-6 text-xl font-semibold">Messages</h1>
            <LeadsInbox />
          </>
        )}
      </main>
    </div>
  );
}
