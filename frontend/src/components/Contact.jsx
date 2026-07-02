import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Socials from "./Socials.jsx";
import { api } from "../api.js";

const EMPTY = { name: "", email: "", projectType: "", message: "" };

export default function Contact({ content }) {
  const { heading, subline, email, projectTypes = [], socials } = content;
  // Gmail compose opens reliably in the browser (no mail client needed).
  const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent("Project inquiry")}`;
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // Auto-dismiss the success/error message after a few seconds.
  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    const id = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(id);
  }, [status]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Saved as a lead in MongoDB → visible in the admin dashboard inbox.
      await api.submitLead(form);
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-cream placeholder-cream/35 outline-none transition-colors focus:border-cream/50";

  return (
    <section
      id="contact"
      data-theme="dark"
      className="relative z-30 flex min-h-screen w-full items-center justify-center bg-black px-6 py-24 text-cream sm:px-10 lg:-mt-[100vh]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full max-w-5xl gap-12 md:grid-cols-2 md:gap-16"
      >
        {/* Left: pitch + direct contact */}
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-cream/50 sm:text-sm">
            Got a project?
          </p>
          <h2
            className="font-sans font-extrabold uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
            {subline}
          </p>
          <a
            href={mailHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block w-fit text-sm text-cream/60 underline-offset-4 transition-colors hover:text-cream hover:underline"
          >
            {email}
          </a>
          <div className="mt-8">
            <Socials items={socials} />
          </div>
        </div>

        {/* Right: contact form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectType" className="sr-only">
              Project type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              required
              className={`${fieldClass} ${
                form.projectType ? "text-cream" : "text-cream/35"
              }`}
            >
              <option value="" disabled className="bg-black text-cream">
                Project type
              </option>
              {projectTypes.map((t) => (
                <option key={t} value={t} className="bg-black text-cream">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tell me about your project..."
              className={`${fieldClass} resize-none`}
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
            whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mt-1 rounded-full bg-cream px-8 py-3.5 text-sm font-semibold text-espresso transition-colors hover:bg-white disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </motion.button>

          {status === "sent" && (
            <p className="text-sm text-emerald-400">
              Thanks! Your message has been sent — I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">
              Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
