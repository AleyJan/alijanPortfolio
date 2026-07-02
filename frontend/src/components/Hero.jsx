import { forwardRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Socials from "./Socials.jsx";

// Hero (formerly the Intro section). This is now the first thing visitors see:
// greeting, name, rotating role, description and socials. The portrait floats
// in on the right via <Portrait /> on lg+ screens; on smaller screens it's
// text-only.
const Hero = forwardRef(function Hero({ content }, ref) {
  const { greeting, name, roles, description, socials } = content;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <section
      ref={ref}
      id="home"
      data-theme="dark"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-espresso via-black to-black text-cream"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl items-start px-6 pt-28 sm:px-10 sm:pt-24 lg:items-center">
        <div className="w-full max-w-2xl">
          {/* HELLO I'M / NAME */}
          <h1
            className="font-sans font-extrabold uppercase leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
          >
            <span className="block text-cream/85">{greeting}</span>
            <span className="block text-cream">{name}</span>
          </h1>

          {/* rotating role */}
          <div
            className="mt-3 flex h-[1.2em] items-center overflow-hidden font-sans font-bold uppercase tracking-tight"
            style={{ fontSize: "clamp(1.4rem, 4vw, 3rem)" }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[index]}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-transparent"
                style={{ WebkitTextStroke: "2px #c9a27e" }}
              >
                {roles[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* description */}
          <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
            {description}
          </p>

          {/* socials */}
          <div className="mt-8">
            <Socials items={socials} />
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
