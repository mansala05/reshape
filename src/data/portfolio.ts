/**
 * Central content file. Edit everything personal here: name, bio, links,
 * projects, posters and tech stack. The page reads from this file only.
 */

export const profile = {
  name: "Mansala Liyanage",
  initials: "ML",
  title: "Full-Stack Developer & Digital Designer",
  tagline:
    "I build React interfaces, backend workflows, and data-driven applications. I’m a second-year undergraduate at UCSC, combining software development with a background in digital design.",
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
  evidence: { label: string; text: string }[];
  tags: string[];
  /** Which live demo runs on the card and in the modal. */
  preview?: PreviewKind;
  screenshots?: { src: string; alt: string; crop?: boolean; kind?: "event" }[];
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
      "Built with Team ORBIT for NeuroX 1.0. My contribution covered backend decision logging, audit trails, approval handling, replies, and recovery flows. I later used Codex to refine and test the demo workflows.",
    evidence: [
      {
        label: "Workflow",
        text: "Sensitive invoice decisions go through human review. The approval-queue screenshot shows the agent’s reasoning alongside approve, edit, and override actions.",
      },
      {
        label: "Result & evidence",
        text: "Team ORBIT qualified among the Top 15. The gallery includes the qualification announcement, decision history, and executed-action screens from the demo.",
      },
    ],
    tags: ["TypeScript", "Next.js", "React", "Supabase (PostgreSQL)", "Gmail API", "Tailwind CSS"],
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
      {
        src: "/projects/invoice-chaser/neurox-group-photo.png",
        kind: "event",
        alt: "NeuroX 1.0 event group photo",
      },
      {
        src: "/projects/invoice-chaser/team-orbit-at-neurox.png",
        kind: "event",
        alt: "Team ORBIT working together at NeuroX 1.0",
      },
      {
        src: "/projects/invoice-chaser/top-15-announcement.png",
        kind: "event",
        alt: "NeuroX 1.0 Top 15 qualification announcement listing Team ORBIT",
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
    evidence: [
      {
        label: "Design work",
        text: "The design explores the driver and mechanic journeys, including role selection, live tracking, an active job, and a mechanic profile.",
      },
      {
        label: "Evidence & scope",
        text: "The gallery contains design mockups and wireframes, with Figma files linked for closer inspection. This was a team competition concept for CodeSprint 11.",
      },
    ],
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
      "Built with the four-member Team Shadow Stack for HackElite 3.0. I led UI/UX and frontend development for a surgical-kit pharmacy finder. I built search and stock-availability interfaces, integrated maps, contact actions and APIs, improved responsiveness, and presented the prototype.",
    evidence: [
      {
        label: "Workflow",
        text: "Search results bring stock status, distance, contact actions, and directions together. The map view also shows a call-to-verify message when inventory sync is delayed.",
      },
      {
        label: "Result & scope",
        text: "Team Shadow Stack reached the HackElite 3.0 Top 12. The gallery includes prototype screens and the finalist announcement. Inventory synchronization was simulated.",
      },
    ],
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
      {
        src: "/projects/surgimap/hackelite-team-discussion.png",
        kind: "event",
        alt: "Team discussion at HackElite 3.0",
      },
      {
        src: "/projects/surgimap/hackelite-team-session.png",
        kind: "event",
        alt: "Team members during a HackElite 3.0 session",
      },
      {
        src: "/projects/surgimap/hackelite-group-photo.png",
        kind: "event",
        alt: "HackElite 3.0 event group photo",
      },
      {
        src: "/projects/surgimap/hackelite-presentation.png",
        kind: "event",
        alt: "Presenting SurgiMap at HackElite 3.0",
      },
      {
        src: "/projects/surgimap/hackelite-finalists.png",
        kind: "event",
        alt: "HackElite 3.0 finalist announcement listing Team Shadow Stack",
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
    evidence: [
      {
        label: "My scope",
        text: "Part 1 covered frontend UI work; Part 2 covered Stock Manager backend operations and integration. Both parts belong to the same team-built logistics application.",
      },
      {
        label: "Evidence & context",
        text: "The gallery shows the Store Manager dashboard, orders, order-history filters, and profile settings. The repository and demo video accompany this Hackathon entry; the team participated in the competition.",
      },
    ],
    tags: ["React", "Vite", "Tailwind CSS", "NestJS", "Prisma", "PostgreSQL", "Docker"],
    screenshots: [
      {
        src: "/projects/waypoint-ops/dashboard.png",
        alt: "Waypoint Store Manager dashboard with delivery analytics and order summaries",
      },
      {
        src: "/projects/waypoint-ops/my-orders.png",
        alt: "Waypoint orders list with delivery status and expected arrivals",
      },
      {
        src: "/projects/waypoint-ops/order-history.png",
        alt: "Waypoint order history with status and brand filters",
      },
      {
        src: "/projects/waypoint-ops/profile-settings.png",
        alt: "Waypoint Store Manager profile settings",
      },
    ],
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
      "Built with Team Orbit for the Rootcode Tech Triathlon 2026 Datathon. I contributed to weekly demand preparation, feature engineering, model comparison, evaluation, and final prediction generation for ten-week demand forecasts. My focus was Task 2A; teammates handled delivery service-time and lateness models.",
    evidence: [
      {
        label: "Forecasting approach",
        text: "Weekly demand preparation produced 702 aggregated records across 117 historical weeks. The hybrid forecast uses different approaches for different depot-brand combinations and was evaluated with rolling-origin backtesting.",
      },
      {
        label: "Output & scope",
        text: "I contributed to the final Task 2A prediction output for total and chilled demand. Architecture and methodology are shown in the gallery; competition datasets remain private. Task 2B is constraint-based allocation, not a trained ML model.",
      },
    ],
    tags: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Huber Regression",
      "Ridge Regression",
      "Jupyter Notebook",
    ],
    screenshots: [
      {
        src: "/projects/waypoint-ml/architecture.png",
        alt: "Team Orbit Datathon architecture covering delivery predictions, demand forecasting, and allocation checks",
      },
      {
        src: "/projects/waypoint-ml/data-preparation.png",
        alt: "Datathon methodology: data integrity, label construction, and weekly demand preparation",
      },
      {
        src: "/projects/waypoint-ml/forecasting-methodology.png",
        alt: "Hybrid demand forecasting and saved inference methodology, allocation verification, and evidence limits",
      },
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

const dailyDriverSkills = new Set([
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "C",
  "C++",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Vite",
  "Node.js",
  "REST APIs",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Git",
  "GitHub",
  "NumPy",
  "Figma",
  "Wireframing",
  "Graphic Design",
  "Photography",
  "Videography",
]);

export const stack: StackGroup[] = [
  {
    id: "languages",
    code: "A",
    title: "Languages & Web Foundations",
    blurb: "The foundations I use for programming and building for the web.",
    tools: ["HTML", "CSS", "JavaScript", "Python", "C", "C++"].map((name) => ({
      name,
      daily: dailyDriverSkills.has(name),
    })),
  },
  {
    id: "frontend",
    code: "B",
    title: "Frontend & UI",
    blurb: "Responsive web and mobile interfaces, from Figma to implementation.",
    tools: ["TypeScript", "React", "Next.js", "React Native", "Expo", "Tailwind CSS", "Vite"].map(
      (name) => ({
        name,
        daily: dailyDriverSkills.has(name),
      }),
    ),
  },
  {
    id: "backend",
    code: "C",
    title: "Backend & APIs",
    blurb: "Application logic, API integration, and connected workflows.",
    tools: ["Node.js", "NestJS", "REST APIs"].map((name) => ({
      name,
      daily: dailyDriverSkills.has(name),
    })),
  },
  {
    id: "databases",
    code: "D",
    title: "Databases & Tools",
    blurb: "Data storage and development tools used across my team projects.",
    tools: [
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "Firebase",
      "Firestore",
      "Docker",
      "Git",
      "GitHub",
    ].map((name) => ({ name, daily: dailyDriverSkills.has(name) })),
  },
  {
    id: "data-ml",
    code: "E",
    title: "Data & Machine Learning",
    blurb: "Data preparation, feature engineering, and demand forecasting.",
    tools: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Huber Regression",
      "Ridge Regression",
      "Jupyter Notebook",
    ].map((name) => ({ name, daily: dailyDriverSkills.has(name) })),
  },
  {
    id: "design-media",
    code: "F",
    title: "Design & Media",
    blurb:
      "Interface design, event graphics, and visual storytelling through photography and video.",
    tools: ["Figma", "Wireframing", "Graphic Design", "Photography", "Videography"].map((name) => ({
      name,
      daily: dailyDriverSkills.has(name),
    })),
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
    "Now I'm a second-year undergraduate at UCSC. I work on interfaces and backend workflows, and experiment with interactive sites and 3D models. I care as much about how an experience works as how it looks, right down to the smallest details.",
    "My work spans full-stack development and digital design, with experience in demand forecasting. I’m also exploring AI engineering and computer vision.",
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

export type PosterKind =
  "Volunteering" | "Festival" | "Club night" | "Exhibition" | "Concert" | "Conference";

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
  ratio: "3:4" | "2:3" | "4:5" | "1:1";
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
  gallery?: { src: string; alt: string }[];
  role?: string;
};

export const posters: Poster[] = [
  {
    id: "genzpire-2026",
    index: "01",
    headline: "GENZPIRE",
    title: "GenZpire 2026",
    kind: "Volunteering",
    client: "CSSL GenZ Chapter — University of Colombo School of Computing (UCSC)",
    role: "Design Lead",
    venue: "W001, UCSC",
    city: "Colombo",
    date: "6 August",
    year: "2026",
    ratio: "4:5",
    format: "Event graphics",
    lineup: [],
    typography: { display: "", text: "", notes: "" },
    description:
      "As Design Lead, I independently handled all graphic design work for GenZpire 2026. Organized by the CSSL GenZ Chapter at UCSC, the event introduced students to CSSL, encouraged networking with seniors, and opened opportunities for learning and professional growth.",
    tags: ["Volunteering", "Graphic Design", "Design Lead"],
    art: { bg: "#101114", ink: "#f0f2f5", accent: "#a5c9de", face: "sans", layout: "stack" },
    image: "/volunteering/genzpire-2026/happening-today.jpg",
    gallery: [
      {
        src: "/volunteering/genzpire-2026/happening-today.jpg",
        alt: "GenZpire 2026 event-day poster for 6 August at UCSC",
      },
    ],
  },
  {
    id: "ieeextreme-20",
    index: "02",
    headline: "IEEEXTREME 20.0",
    title: "IEEEXtreme 20.0",
    kind: "Volunteering",
    client: "IEEE Student Branch — University of Colombo School of Computing (UCSC)",
    role: "Design Team Member",
    venue: "UCSC",
    city: "Colombo",
    date: "2026",
    year: "2026",
    ratio: "1:1",
    format: "Promotional graphic design",
    lineup: [],
    typography: { display: "", text: "", notes: "" },
    description:
      "Contributed to promotional graphic design as a Design Team Member for IEEEXtreme 20.0 at UCSC, organized by the IEEE Student Branch. The event encouraged competitive programming, problem-solving, and collaboration among university students.",
    tags: ["Volunteering", "Graphic Design", "IEEE"],
    art: { bg: "#101114", ink: "#f0f2f5", accent: "#a5c9de", face: "sans", layout: "stack" },
    image: "/volunteering/ieeextreme-20/entries-locked.png",
  },
  {
    kind: "Volunteering",
    client: "Pahasara Media — University of Colombo School of Computing (UCSC)",
    role: "Photographer & Videographer",
    venue: "UCSC",
    city: "Colombo",
    year: "2026",
    format: "Event photography & videography",
    lineup: [],
    typography: { display: "", text: "", notes: "" },
    tags: ["Volunteering", "Photography", "Videography"],
    art: { bg: "#101114", ink: "#f0f2f5", accent: "#a5c9de", face: "sans", layout: "stack" },
    id: "reid-handawa-2026",
    index: "03",
    headline: "REID HANDAWA",
    title: "Reid Handawa ’25",
    date: "30 January",
    ratio: "2:3",
    description:
      "Volunteered with Pahasara Media at UCSC, contributing photography and videography for Reid Handawa ’25, held on 30 January 2026. The photograph shows a behind-the-scenes moment during event coverage.",
    image: "/volunteering/pahasara-media/reid-handawa-coverage.png",
  },
  {
    kind: "Volunteering",
    client: "Pahasara Media — University of Colombo School of Computing (UCSC)",
    role: "Photographer & Videographer",
    venue: "UCSC",
    city: "Colombo",
    year: "2026",
    format: "Event photography & videography",
    lineup: [],
    typography: { display: "", text: "", notes: "" },
    tags: ["Volunteering", "Photography", "Videography"],
    art: { bg: "#101114", ink: "#f0f2f5", accent: "#a5c9de", face: "sans", layout: "stack" },
    id: "padura-2026",
    index: "04",
    headline: "PADURA",
    title: "Padura 2026",
    date: "2026",
    ratio: "4:5",
    description:
      "Volunteered with Pahasara Media at UCSC, contributing photography and videography for Padura 2026. The group photograph captures a moment with fellow event volunteers.",
    image: "/volunteering/pahasara-media/padura-volunteers.png",
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
    keywords: "volunteering community CSSL GenZpire design lead",
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
