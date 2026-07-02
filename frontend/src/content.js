// Fallback portfolio content. The site renders from this immediately, then (if
// the API is reachable) overrides it with the admin-edited version from the DB.
// Keep this in sync with backend/defaultContent.js.
export const defaultContent = {
  logo: "ALIJAN",
  nav: ["Home", "About", "Projects", "Services"],
  cta: "Get a quote",
  // About page — only the resume link is admin-editable for now; the rest of the
  // page content lives as defaults inside the About component.
  about: { resumeUrl: "" },
  heroTitle: "PORTFOLIO",
  loader: {
    eyebrow: "Ali Jan — 2026",
    title: "PORTFOLIO",
    role: "Full Stack Engineer",
    skills: ["React", "Express", "MongoDB", "Node.js"],
  },
  image: "/hero.png",
  eyebrow: "Creative Developer",
  greeting: "Hello I'm",
  name: "Ali jan",
  roles: ["Web Developer", "Web Designer", "UI/UX Designer", "ML Enthusiast"],
  description:
    "I craft fast, accessible, and visually refined web experiences, blending clean engineering with thoughtful design to turn ideas into products people genuinely enjoy using.",
  socials: [
    { name: "GitHub", icon: "github", href: "#" },
    { name: "LinkedIn", icon: "linkedin", href: "#" },
    { name: "Instagram", icon: "instagram", href: "#" },
  ],
  skills: {
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
  },
  workHeading: "My Work",
  // Each project: title, description, images[] (slider), tags[], live, source.
  // `source` is optional — when empty the GitHub link is hidden.
  projects: [
    {
      title: "Virtual Intelligent Tuition Academy",
      description:
        "Complete tutor booking platform with Student, Tutor, and Admin roles. Students request tutors, tutors apply, admins approve. Built with a modern tech stack and deployed on Vercel with a Supabase backend.",
      images: [
        "https://picsum.photos/seed/vita1/800/450",
        "https://picsum.photos/seed/vita2/800/450",
      ],
      tags: ["React", "TypeScript", "PostgreSQL", "Supabase", "Vercel"],
      live: "",
      source: "",
    },
    {
      title: "E-commerce Platform (Scalable) — In Development",
      description:
        "A high-performance e-commerce platform built to handle 10,000+ requests/minute. Features AWS deployment, EasyPaisa payment integration, real-time inventory, and a modern UI. Focus on scalability, security, and a seamless user experience.",
      images: [
        "https://picsum.photos/seed/khokharmart1/800/450",
        "https://picsum.photos/seed/khokharmart2/800/450",
      ],
      tags: ["React", "Node.js", "Express", "MongoDB", "Redis", "JWT", "Docker"],
      live: "",
      source: "",
    },
  ],
  servicesHeading: "SERVICES",
  services: [
    { title: "Business Website Development", desc: "Marketing sites that build trust and convert." },
    { title: "Admin Dashboard Development", desc: "Powerful internal tools, panels & analytics." },
    { title: "E-commerce Website", desc: "Fast online stores built to sell." },
    { title: "Portfolio Website", desc: "Personal brands that stand out." },
  ],
  contact: {
    heading: "Let's work together",
    subline:
      "Have a project in mind? Tell me about it — I usually reply within a day.",
    email: "alijan.dev507@gmail.com",
    projectTypes: [
      "Business Website",
      "Admin Dashboard",
      "E-commerce Website",
      "Portfolio Website",
      "Something else",
    ],
    socials: [
      { name: "GitHub", icon: "github", href: "#" },
      { name: "LinkedIn", icon: "linkedin", href: "#" },
      { name: "Instagram", icon: "instagram", href: "#" },
    ],
  },
  footer: {
    available: "Available for projects · 2026",
    headlineLead: "Let's build something",
    headlineAccent: "worth sharing",
    ctaLabel: "Start a project",
    trust: ["Replies within a day", "No obligation", "Fixed, upfront quotes"],
    copyright: "© 2026 Alijan",
  },
};
