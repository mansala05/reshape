/**
 * Central content file. Edit everything personal here: name, bio, links,
 * projects, posters and tech stack. The page reads from this file only.
 */

export const profile = {
  name: "Mansala Liyanage",
  initials: "ML",
  title: "Full-Stack Developer & Digital Designer",
  tagline: "I design and build thoughtful digital experiences, from interface to implementation.",
  location: "Colombo, Sri Lanka",
  timezone: "UTC+5:30",
  availability: "Exploring the space between creativity and technology",
  available: true,
  email: "liyanagemansala@gmail.com",
  resumeUrl: "#",
};

export type Social = {
  label: string;
  handle: string;
  href: string;
  key: "github" | "linkedin" | "devpost" | "email";
};

export const socials: Social[] = [
  { key: "github", label: "GitHub", handle: "@mansala05", href: "https://github.com/mansala05" },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "in/mansalaliyanage",
    href: "https://www.linkedin.com/in/mansalaliyanage/",
  },
  {
    key: "devpost",
    label: "Devpost",
    handle: "liyanagemansala",
    href: "https://devpost.com/liyanagemansala",
  },
  { key: "email", label: "Email", handle: profile.email, href: `mailto:${profile.email}` },
];

export type PreviewKind = "audio" | "fluid" | "spatial" | "kinetic";

export type Project = {
  id: string;
  index: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  tags: string[];
  /** Which live demo runs on the card and in the modal. */
  preview?: PreviewKind;
  screenshots?: { src: string; alt: string; crop?: boolean }[];
  coverFit?: "cover" | "contain";
  cover?: { src: string; alt: string };
  links: { label: string; href: string }[];
  /** Set for projects that reached a competition final; shows the poppy "Finalist" badge. Delete the line if not. */
  award?: { label: string; event: string };
};

export const projects: Project[] = [
  {
    id: "invoice-chaser",
    cover: { src: "/projects/logos/invoice-chaser.png", alt: "InvoiceChaser logo" },
    index: "01",
    title: "InvoiceChaser",
    year: "2026",
    role: "Backend Development · Team ORBIT",
    summary:
      "An AI receivables agent that reviews overdue invoices, uses customer context to choose a response, and routes sensitive decisions to a person for approval.",
    description:
      "Built with Team ORBIT for NeuroX 1.0. I worked on backend decision logging, audit trails, approvals, reply handling, and recovery flows, then used Codex to refine and test the demo workflows.",
    tags: [
      "TypeScript",
      "Next.js",
      "React",
      "Supabase (PostgreSQL)",
      "Google Gemini",
      "Gmail API",
      "Tailwind CSS",
    ],
    screenshots: [
      {
        src: "/projects/invoice-chaser/dashboard.png",
        alt: "InvoiceChaser dashboard showing overdue balances, approval counts, trends, and recent decisions",
      },
      {
        src: "/projects/invoice-chaser/approval-queue.png",
        alt: "Approval queue with agent reasoning and approve, edit, and override actions",
      },
      {
        src: "/projects/invoice-chaser/decisions.png",
        alt: "Invoice decisions with confidence and review status",
      },
      {
        src: "/projects/invoice-chaser/executed.png",
        alt: "Completed invoice actions filtered by execution source",
      },
      {
        src: "/projects/invoice-chaser/agent-run.png",
        alt: "Agent run summary showing invoices already handled in their current state",
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/invoice-chaser-orbit/Invoice-Chaser",
      },
      {
        label: "Devpost",
        href: "https://devpost.com/software/team-orbit-invoicechaser",
      },
      {
        label: "Qualification video",
        href: "https://youtu.be/ZMG6575WliY",
      },
    ],
    award: {
      label: "Top 15 finalist",
      event: "NeuroX 1.0 · July 2026",
    },
  },
  {
    id: "road-assist-lk",
    cover: { src: "/projects/logos/road-assist-lk.png", alt: "RoadAssistLK logo" },
    index: "02",
    title: "RoadAssistLK",
    year: "2026",
    role: "UI / Frontend · Hello-World-Domain",
    summary:
      "A mobile app concept connecting drivers facing vehicle breakdowns with nearby mechanics.",
    description:
      "A mobile app concept created with Hello-World-Domain for CodeSprint 11. I worked on the early Figma designs, handed off UI specifications, and collaborated with three teammates on the frontend.",
    tags: [
      "React Native",
      "Expo",
      "Figma",
      "Node.js",
      "Express",
      "Firebase",
      "Firestore",
      "Firebase Auth",
      "Firebase Storage",
      "FCM",
      "react-native-maps",
    ],
    coverFit: "contain",
    screenshots: [
      {
        src: "/projects/road-assist-lk/onboarding.png",
        alt: "RoadAssistLK onboarding design mockup",
      },
      {
        src: "/projects/road-assist-lk/sign-in.png",
        alt: "RoadAssistLK sign-in design mockup",
      },
      {
        src: "/projects/road-assist-lk/active-job.png",
        alt: "RoadAssistLK mechanic active-job design mockup",
      },
      {
        src: "/projects/road-assist-lk/mechanic-profile.png",
        alt: "RoadAssistLK mechanic profile design mockup",
      },
      {
        src: "/projects/road-assist-lk/tracking-wireframe.png",
        alt: "RoadAssistLK driver live-tracking wireframe",
      },
      {
        src: "/projects/road-assist-lk/role-selection-wireframe.png",
        alt: "RoadAssistLK driver and garage role-selection wireframe",
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/HelloWorld-Domination/road-assist-lk",
      },
      {
        label: "Demo video",
        href: "https://youtu.be/bcDtwb1ND4c",
      },
      {
        label: "Figma · design file 1",
        href: "https://www.figma.com/design/28qoT94kcrB79RY4fGQP50/Untitled?node-id=0-1",
      },
      {
        label: "Figma · design file 2",
        href: "https://www.figma.com/design/0BpJO35PmIt1d5T2vxNna0/project-1--Copy-?node-id=0-1",
      },
    ],
  },
  {
    id: "surgimap",
    cover: { src: "/projects/logos/surgimap.png", alt: "SurgiMap logo" },
    index: "03",
    title: "SurgiMap",
    year: "2026",
    role: "Frontend Developer · UI/UX Lead · Presenter",
    summary:
      "A healthcare web app prototype that helps patients find nearby pharmacies with urgently needed surgical kits using simulated inventory sync.",
    description:
      "Built with the four-member Team Shadow Stack for HackElite 3.0. I led UI/UX and frontend development, built search and stock availability interfaces, integrated maps, contact actions and APIs, improved responsiveness, and presented the project.",
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLite",
      "REST APIs",
    ],
    screenshots: [
      {
        src: "/projects/surgimap/homepage.png",
        alt: "SurgiMap prototype homepage",
        crop: true,
      },
      {
        src: "/projects/surgimap/pharmacy-results.png",
        alt: "Surgical-kit search results with simulated stock availability and pharmacy contact actions",
        crop: true,
      },
      {
        src: "/projects/surgimap/map-view.png",
        alt: "Pharmacy map view with directions and inventory sync status",
        crop: true,
      },
      {
        src: "/projects/surgimap/search-empty.png",
        alt: "Search empty state with suggested surgical kits",
        crop: true,
      },
      {
        src: "/projects/surgimap/how-it-works.png",
        alt: "SurgiMap guide to searching, checking stock, and contacting pharmacies",
        crop: true,
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mansala05/SurgiMap-Repo",
      },
      {
        label: "Demo video",
        href: "https://youtu.be/QHgVebhWjoM",
      },
    ],
    award: {
      label: "Top 12 finalist",
      event: "HackElite 3.0 · 2026",
    },
  },
  {
    id: "waypoint-ops",
    cover: { src: "/projects/logos/waypoint-ops.png", alt: "WaypointOps logo" },
    index: "04",
    title: "WaypointOps — Parts 1 & 2",
    year: "2026",
    role: "Frontend & Backend Development · Team Orbit",
    summary:
      "A logistics and delivery management system for coordinating store orders, stock operations, and deliveries.",
    description:
      "Built collaboratively with Team Orbit for the Rootcode Tech Triathlon 2026 Hackathon. I contributed to frontend UI design and development, implemented Stock Manager backend functionality, and helped integrate it with the application.",
    tags: ["React", "Vite", "Tailwind CSS", "NestJS", "Prisma", "PostgreSQL", "Docker"],
    links: [
      { label: "Demo video", href: "https://youtu.be/w14kuQ48pxM" },
      {
        label: "GitHub",
        href: "https://github.com/ashen0723/ORBIT_WaypointOps",
      },
      {
        label: "Competition",
        href: "https://tech-triathlon.rootcode.ai/",
      },
    ],
  },
  {
    id: "waypoint-ml",
    cover: { src: "/projects/logos/waypoint-ops.png", alt: "Waypoint AI/ML logo" },
    index: "05",
    title: "Waypoint — AI/ML Models",
    year: "2026",
    role: "Demand Forecasting · Team Orbit",
    summary:
      "A team Datathon project forecasting ten weeks of total and chilled demand, alongside delivery predictions and constraint-based allocation.",
    description:
      "Built with Team Orbit for the Rootcode Tech Triathlon 2026 Datathon. I contributed to weekly demand preparation, feature engineering, forecasting model development, evaluation, and final prediction generation.",
    tags: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Huber Regression",
      "Ridge Regression",
      "Jupyter Notebook",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Vihandu-Nimsara/ORBIT_Datathon" },
      {
        label: "Project video",
        href: "https://youtu.be/7Px1Pmnp5jM",
      },
      {
        label: "Competition",
        href: "https://tech-triathlon.rootcode.ai/",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Craft — tech stack                                                  */
/* ------------------------------------------------------------------ */

/** `daily: true` gets a solid poppy dot; leave it off for tools in rotation. */
export type StackTool = { name: string; daily?: boolean };

export type StackGroup = {
  id: string;
  code: string;
  title: string;
  blurb: string;
  tools: StackTool[];
};

export const stack: StackGroup[] = [
  {
    id: "creative-3d",
    code: "A",
    title: "Creative & 3D",
    blurb: "Real-time graphics, shaders and generative systems.",
    tools: [
      { name: "Three.js", daily: true },
      { name: "React Three Fiber", daily: true },
      { name: "GLSL", daily: true },
      { name: "WebGPU" },
      { name: "p5.js" },
      { name: "TouchDesigner" },
      { name: "Blender" },
    ],
  },
  {
    id: "architecture-ui",
    code: "B",
    title: "Architecture & UI",
    blurb: "Typed, fast front-ends and the systems that hold them together.",
    tools: [
      { name: "TypeScript", daily: true },
      { name: "React", daily: true },
      { name: "TanStack" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Vite" },
      { name: "Node.js" },
    ],
  },
  {
    id: "design-motion",
    code: "C",
    title: "Design & Motion",
    blurb: "Layout, type and movement, decided before the first commit.",
    tools: [
      { name: "Figma", daily: true },
      { name: "GSAP" },
      { name: "Framer Motion" },
      { name: "After Effects" },
      { name: "Rive" },
      { name: "Illustrator" },
    ],
  },
  {
    id: "sound-live",
    code: "D",
    title: "Sound & Live",
    blurb: "Audio as interface, from browser synths to club rigs.",
    tools: [
      { name: "Web Audio API", daily: true },
      { name: "Tone.js" },
      { name: "Web MIDI" },
      { name: "Ableton Live" },
      { name: "Projection mapping" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* About — editorial section                                           */
/* ------------------------------------------------------------------ */

export const about = {
  kicker: "Manifesto",
  headline: { lead: "Developer by craft.", accent: "Designer", tail: "by instinct." },
  intro: "Hey there, I'm Mansala Liyanage.",
  introDetail: "soft-hearted, bubbly, a little chaotic, and a bit of a perfectionist.",
  narrative: [
    "I started designing when I was young, drawn to the way colors, shapes, and details could change how something felt. Working with design teams helped me grow from making static websites into exploring more interactive digital experiences.",
    "Now I'm a second-year undergraduate at UCSC. I design for web and mobile, experiment with interactive sites and 3D models, and bring a touch of AI into the things I make. I care as much about how an experience works as how it looks, right down to the smallest details.",
    "Right now, I'm spending more time exploring AI engineering and moving toward computer vision. I'm interested in how machines can interpret images and the world around us, and I want to keep learning how to build useful things with that knowledge. My design background still shapes how I think.",
  ],
  statement: "They weren’t more talented than you. They were just brave enough to try.",
  statementLabel: "",
  portrait: {
    src: "/mansala-portrait.png",
    alt: "Portrait of Mansala Liyanage",
    badges: ["That's me :)", "Mansi not Mansala"],
  },
};

/* ------------------------------------------------------------------ */
/* Posters & flyers                                                    */
/* ------------------------------------------------------------------ */

export type PosterKind = "Festival" | "Club night" | "Exhibition" | "Concert" | "Conference";

export type Poster = {
  id: string;
  index: string;
  /** Big words printed on the placeholder flyer. Use \n for line breaks. */
  headline: string;
  title: string;
  kind: PosterKind;
  client: string;
  venue: string;
  city: string;
  date: string;
  year: string;
  /** Vertical proportions: 3:4 or 2:3. */
  ratio: "3:4" | "2:3";
  format: string;
  lineup: string[];
  typography: { display: string; text: string; notes: string };
  description: string;
  tags: string[];
  /**
   * Placeholder artwork only (ignored once `image` is set): background, ink and accent
   * colors, the typeface family to draw it with and one of four layouts.
   */
  art: {
    bg: string;
    ink: string;
    accent: string;
    face: "sans" | "serif" | "mono";
    layout: "stack" | "orbit" | "grid" | "split";
  };
  /** Put your flyer in /public (e.g. "/posters/bloom.jpg") or paste an image URL. */
  image?: string;
};

export const posters: Poster[] = [
  {
    id: "bloom-state",
    index: "01",
    headline: "BLOOM\nSTATE",
    title: "Bloom State Festival",
    kind: "Festival",
    client: "Bloom State Collective",
    venue: "Harbour Gardens",
    city: "Lisbon",
    date: "14 — 16 Aug",
    year: "2026",
    ratio: "2:3",
    format: "B1 · 700 × 1000 mm, risograph 2-color",
    lineup: ["Placeholder DJ", "Second Artist", "Live Act Name", "Closing Set b2b"],
    typography: {
      display: "Geist SemiBold, 280 pt, −4% tracking",
      text: "Geist Mono, 11/14 pt, uppercase",
      notes: "Headline set tight enough to touch; lineup hangs from a single baseline.",
    },
    description:
      "Placeholder brief — a three-day open-air festival identity built around a stacked wordmark that bursts off the sheet. Replace with your own story.",
    tags: ["Identity", "Risograph", "Wayfinding"],
    art: { bg: "#e63946", ink: "#0c0d10", accent: "#eef2f6", face: "sans", layout: "stack" },
  },
  {
    id: "afterglass",
    index: "02",
    headline: "After\nGlass",
    title: "Afterglass — Club Night",
    kind: "Club night",
    client: "Afterglass Records",
    venue: "Basement 9",
    city: "Berlin",
    date: "Sat 07 Mar · 23:00",
    year: "2026",
    ratio: "3:4",
    format: "A2 · 420 × 594 mm, digital + wheatpaste",
    lineup: ["Resident One", "Guest From Abroad", "Visuals by You"],
    typography: {
      display: "Instrument Serif Italic, 240 pt",
      text: "Geist Mono, 9/12 pt",
      notes: "One oversized italic ligature as the hero; info set like a ticket stub.",
    },
    description:
      "Placeholder brief — monthly club series where each edition shifts the orbit color. Replace with the night, the crowd and what the poster did.",
    tags: ["Club", "Series", "Motion poster"],
    art: { bg: "#0c0d10", ink: "#a4c8e1", accent: "#ff3344", face: "serif", layout: "orbit" },
  },
  {
    id: "signal-noise",
    index: "03",
    headline: "SIGNAL\n/NOISE",
    title: "Signal / Noise — Media Art Exhibition",
    kind: "Exhibition",
    client: "Placeholder Kunsthalle",
    venue: "Hall B, Placeholder Kunsthalle",
    city: "Rotterdam",
    date: "02 Oct — 18 Jan",
    year: "2025",
    ratio: "2:3",
    format: "A1 · 594 × 841 mm, offset 4-color",
    lineup: ["12 artists", "4 installations", "1 night program"],
    typography: {
      display: "Geist Mono Bold, 190 pt",
      text: "Geist, 10/13 pt",
      notes: "Strict 6-column grid; the index number is the image.",
    },
    description:
      "Placeholder brief — exhibition campaign for generative and audio-visual work. Grid-first system scaled from posters to tram screens.",
    tags: ["Exhibition", "Grid system", "Campaign"],
    art: { bg: "#a4c8e1", ink: "#0c0d10", accent: "#e63946", face: "mono", layout: "grid" },
  },
  {
    id: "velvet-voltage",
    index: "04",
    headline: "Velvet\nVoltage",
    title: "Velvet Voltage — Live",
    kind: "Concert",
    client: "Placeholder Artist Management",
    venue: "The Paradiso Room",
    city: "Amsterdam",
    date: "Fri 22 May · Doors 20:00",
    year: "2025",
    ratio: "3:4",
    format: "50 × 70 cm, screenprint, 2 spot colors",
    lineup: ["Velvet Voltage", "Support: Opening Act"],
    typography: {
      display: "Instrument Serif, 210 pt, roman + italic mix",
      text: "Geist Mono, 10/12 pt",
      notes: "Split field: the poppy half carries the name, the dark half carries the facts.",
    },
    description:
      "Placeholder brief — tour poster for a single headline show, printed in a numbered run of 150.",
    tags: ["Gig poster", "Screenprint", "Limited run"],
    art: { bg: "#efe9e1", ink: "#0c0d10", accent: "#e63946", face: "serif", layout: "split" },
  },
  {
    id: "render-conf",
    index: "05",
    headline: "RENDER\nCONF",
    title: "Render Conf — Creative Tech Summit",
    kind: "Conference",
    client: "Render Conf",
    venue: "Placeholder Convention Centre",
    city: "London",
    date: "09 — 10 Jun",
    year: "2025",
    ratio: "2:3",
    format: "A2 posters + 6 m stage backdrop",
    lineup: ["40 speakers", "2 stages", "1 shader jam"],
    typography: {
      display: "Geist Mono SemiBold, 220 pt",
      text: "Geist, 12/16 pt",
      notes: "Monospaced wordmark that doubles as the stage countdown.",
    },
    description: "Placeholder brief — summit identity spanning print, stage and badges.",
    tags: ["Conference", "Stage design", "Badges"],
    art: { bg: "#14161b", ink: "#eef2f6", accent: "#ff3344", face: "mono", layout: "stack" },
  },
  {
    id: "petal-club",
    index: "06",
    headline: "Petal\nClub",
    title: "Petal Club — Spring Opening",
    kind: "Club night",
    client: "Petal Club",
    venue: "Rooftop 41",
    city: "Barcelona",
    date: "Sat 18 Apr · Sunset",
    year: "2024",
    ratio: "3:4",
    format: "Instagram 4:5 + A3 flyer",
    lineup: ["Sunset Selector", "Peak Time Guest", "Closing Resident"],
    typography: {
      display: "Instrument Serif Italic, 260 pt",
      text: "Geist, 10/13 pt",
      notes: "A single circle as the sun; type wraps around it like petals.",
    },
    description:
      "Placeholder brief — rooftop season opener, one poster family for print and social.",
    tags: ["Club", "Social", "Season launch"],
    art: { bg: "#ff3344", ink: "#efe9e1", accent: "#0c0d10", face: "serif", layout: "orbit" },
  },
  {
    id: "soft-machines",
    index: "07",
    headline: "SOFT\nMACHINES",
    title: "Soft Machines — Group Show",
    kind: "Exhibition",
    client: "Placeholder Gallery",
    venue: "Placeholder Gallery, Ground floor",
    city: "Paris",
    date: "11 Nov — 20 Dec",
    year: "2024",
    ratio: "2:3",
    format: "A1 · 594 × 841 mm, offset + spot silver",
    lineup: ["6 artists", "Robotics", "Textiles", "Light"],
    typography: {
      display: "Geist SemiBold, 200 pt, −3% tracking",
      text: "Geist Mono, 9/12 pt",
      notes: "Swiss grid with one silver spot color standing in for chrome.",
    },
    description:
      "Placeholder brief — group show about tenderness and machines. Replace with your own.",
    tags: ["Exhibition", "Spot silver", "Catalogue"],
    art: { bg: "#efe9e1", ink: "#0c0d10", accent: "#5f8fb3", face: "sans", layout: "grid" },
  },
  {
    id: "night-garden",
    index: "08",
    headline: "Night\nGarden",
    title: "Night Garden — Light Festival",
    kind: "Festival",
    client: "City Placeholder Cultural Office",
    venue: "Botanical Garden",
    city: "Copenhagen",
    date: "06 — 15 Feb",
    year: "2024",
    ratio: "2:3",
    format: "Bus shelters 1185 × 1750 mm",
    lineup: ["18 light works", "Evening walks", "Family Sundays"],
    typography: {
      display: "Instrument Serif, 230 pt",
      text: "Geist Mono, 11/14 pt",
      notes: "Split layout reads from a moving bus; date set at the eye line.",
    },
    description: "Placeholder brief — citywide winter light festival campaign.",
    tags: ["Festival", "Out of home", "Campaign"],
    art: { bg: "#0c0d10", ink: "#eef2f6", accent: "#a4c8e1", face: "serif", layout: "split" },
  },
];

export const sections = [
  { id: "top", label: "Home", code: "00", keywords: "home intro hero top index" },
  {
    id: "about",
    label: "Manifesto",
    code: "01",
    keywords: "about me bio story portrait manifesto",
  },
  { id: "work", label: "Experiences", code: "02", keywords: "projects lab experiments work" },
  {
    id: "posters",
    label: "Volunteering",
    code: "03",
    keywords: "posters flyers events print design gallery",
  },
  {
    id: "craft",
    label: "Tech Stack",
    code: "04",
    keywords: "skills craft stack tools tech capabilities",
  },
  { id: "contact", label: "Contact", code: "05", keywords: "contact email hire talk" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function sectionCode(id: SectionId): string {
  return sections.find((s) => s.id === id)?.code ?? "";
}
