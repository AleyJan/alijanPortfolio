import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Portrait from "../components/Portrait.jsx";
import Skills from "../components/Skills.jsx";
import MyWork from "../components/MyWork.jsx";
// import Services from "../components/Services.jsx"; // Services section hidden
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import { defaultContent } from "../content.js";
import { introState } from "../introState.js";
import { api } from "../api.js";

// Detects which [data-theme] band currently sits under the navbar, so the
// navbar (and top scrim) can invert between dark and white sections.
function useNavTheme(lineFromTop = 64) {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-theme]"));
    let frame = 0;
    const update = () => {
      let current = "dark";
      // Last match wins: when sections overlap (e.g. the rising Contact over the
      // pinned Services), the later one in DOM order is visually on top.
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= lineFromTop && r.bottom > lineFromTop) {
          current = s.dataset.theme;
        }
      }
      setTheme(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lineFromTop]);
  return theme;
}

export default function Portfolio() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const navTheme = useNavTheme();

  // Intro loading screen — plays on a real page load, but is skipped when
  // arriving here via client-side navigation (see introState).
  const [loading, setLoading] = useState(!introState.shown);
  useEffect(() => {
    introState.shown = true;
  }, []);
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  // Start from the local fallback, then override with admin-edited content if
  // the API is reachable. If it isn't, the site still renders perfectly.
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    let active = true;
    api
      .getContent()
      .then((data) => {
        if (active && data && typeof data === "object") setContent(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Cursor position drives the spotlight in both the hero overlay and the
  // portrait. Tracked once at window level and shared via CSS vars (--mx/--my).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const setCenter = () => {
      root.style.setProperty("--mx", `${window.innerWidth / 2}px`);
      root.style.setProperty("--my", `${window.innerHeight / 2}px`);
    };
    setCenter();

    let frame = 0;
    const onMove = (e) => {
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${clientX}px`);
        root.style.setProperty("--my", `${clientY}px`);
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", setCenter);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", setCenter);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <Loader
            key="loader"
            content={content.loader}
            onDone={() => setLoading(false)}
          />
        )}
      </AnimatePresence>
      <main ref={rootRef} className="relative">
        <Navbar
        logo={content.logo}
        links={content.nav}
        cta={content.cta}
        theme={navTheme}
      />
      <Portrait image={content.image} introRef={heroRef} />
      <Hero ref={heroRef} content={content} />
      <Skills content={content.skills} />
      <MyWork heading={content.workHeading} projects={content.projects} />
      {/* Services section temporarily hidden */}
      {/* <Services heading={content.servicesHeading} services={content.services} /> */}
      <Contact content={content.contact} />
      <Footer
        logo={content.logo}
        nav={content.nav}
        socials={content.socials}
        email={content.contact.email}
        footer={content.footer}
      />
      </main>
    </>
  );
}
