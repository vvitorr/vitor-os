// Edit this file to personalise the desktop. Source: Vitor_Carneiro_CV.pdf.
// Phone number intentionally left out: this site is public.
export const profile = {
  name: "Vítor Carneiro",
  role: "Computer Engineering Student @ ISEP",
  location: "Porto, Portugal",
  bio: "Computer Engineering student at ISEP with a strong interest in networks, cybersecurity and infrastructure. Currently attending CCNA training (ISEP Academy) in preparation for Cisco certification.",
  github: "vvitorr",
  linkedin: "https://www.linkedin.com/in/vitor-carneiro0",
  email: "pfvitorcarneiro@gmail.com",
};

export const education = [
  { school: "ISEP – Instituto Superior de Engenharia do Porto", degree: "Bachelor in Computer Engineering", dates: "Sep 2024 – Jul 2027 (expected)" },
  { school: "ISEP Academy", degree: "Cisco Certified Network Associate (CCNA)", dates: "Feb 2026 – Sep 2026" },
];

export const languages = [
  { name: "Portuguese", level: "Native" },
  { name: "English", level: "B2" },
];

export type ProjectTag = "Software" | "Networking" | "Web";

// The only place projects live. Finder shows them; Spotlight and the Terminal just point there.
// Curated from GitHub (owned, org and contributed repos) plus the CV. Private repos have no url.
export const projects: {
  name: string;
  period: string;
  role: string;
  tags: ProjectTag[];
  stack: string;
  summary: string;
  points: string[];
  url?: string; // public repo
  live?: string; // live site
}[] = [
  {
    name: "LaPrizza Information System",
    period: "Sep 2026 – present",
    role: "Team of 4 · top committer",
    tags: ["Software", "Web"],
    stack: "TypeScript, Node.js, Express, Prisma, PostgreSQL, Redis, React, Three.js, Prolog, Docker, Nginx",
    summary:
      "Information system for a pizza chain: customers, product catalogue, pizza configuration and stock, with orders and kitchen scheduling next. Semester 5 integrative project at ISEP.",
    points: [
      "REST API (/api/v1) with domain rules kept independent of Express and Prisma; PostgreSQL enforces the same invariants",
      "Built authorization enforcement and secure sessions (JWT, OpenID Connect) for role-based access",
      "Set up deployment to the DEI virtual servers: pull-based deploy script, Nginx reverse proxy serving the SPA, health checks and per-run test archives",
      "Added the frontend CI gate and refreshed the storefront UI (search, product photos)",
    ],
  },
  {
    name: "Midi8 Web Projects",
    period: "Oct 2026",
    role: "Contributor",
    tags: ["Web"],
    stack: "Next.js, React, TypeScript, Supabase, Canvas 2D",
    summary: "Midi8 is a small software studio building websites and restaurant systems for local businesses.",
    points: [
      "Gulas Platform: digital menu, table QR ordering, take-away, real-time kitchen display and BI dashboards (Next.js 16 + Supabase Realtime). I synced the menu catalogue and product images",
      "Midi8 website: fixed mobile canvas scaling and made the procedural Perlin hero static on mobile for performance",
      "Restaurant digital menu: revamped the app and replaced Firebase with a local store",
    ],
    url: "https://github.com/Midi-8",
    live: "https://gulas-iota.vercel.app",
  },
  {
    name: "Enterprise Network Lab",
    period: "Sep – Oct 2026",
    role: "Team of 4",
    tags: ["Networking"],
    stack: "Cisco IOS XE, IPsec, OSPF, NAT, ACLs, SNMP, Syslog, Ansible",
    summary: "Final lab of CCNA Enterprise Networking, Security and Automation at ISEP Academy, on real Cisco hardware.",
    points: [
      "My part: site-to-site IPsec VPN tunnels and co-deployment of IP telephony",
      "Team: OSPF routing, static and dynamic NAT, NTP, ACL and VTY hardening, Syslog/SNMP, Ansible configuration backups",
      "3 routers, 4 switches, 2 multilayer switches, a WLC with lightweight APs and IP phones",
    ],
  },
  {
    name: "Multi-Site Campus Network",
    period: "May – Aug 2026",
    role: "Team of 4",
    tags: ["Networking"],
    stack: "Cisco IOS, VLANs, HSRP, DHCP, WLC",
    summary: "Final lab of CCNA Switching, Routing and Wireless Essentials: a 3-site enterprise network (Zagreb, Pula, Split).",
    points: [
      "My part: the IPv4 addressing plan, hierarchical subnetting across 20+ VLAN segments, DHCP and static routing",
      "EtherChannel and inter-site static routing with primary/backup paths and floating routes",
      "RSTP and HSRP for Layer 2/3 redundancy in the campus core",
      "Multi-site wireless with WLC, FlexConnect APs, AP Groups and per-site WLANs (staff/guests)",
    ],
  },
  {
    name: "AIControl (AISafe)",
    period: "Mar – Jun 2026",
    role: "Team of 5 · top committer",
    tags: ["Software"],
    stack: "Java, JPA/Hibernate, PostgreSQL, TCP/UDP, ANTLR, C",
    summary:
      "Backoffice for AISafe, a flight-control startup: airports, air control areas, aircraft models, routes, pilots, weather and flight plans. Semester 4 integrative project.",
    points: [
      "DDD layered architecture (domain, application, persistence, console UI) on JPA/Hibernate + PostgreSQL, with 1,000+ JUnit tests",
      "Custom TCP protocol for remote ATCC, pilot and weather clients with role-based auth and opcode routing; UDP audit logging",
      "Flight-plan DSL in ANTLR4, validated against a C physics simulator (IPC, shared memory)",
      "My work included the TCP login flow, pessimistic locking with transactional rollback, and the flight-plan validation UI and tests",
    ],
    url: "https://github.com/vvitorr/Aircraft_Simulation",
  },
  {
    name: "ProofPocket",
    period: "May 2026",
    role: "Hackathon team of 4",
    tags: ["Software", "Web"],
    stack: "React Native (Expo), TypeScript, Python, AWS, Terraform",
    summary: "Privacy-first phishing detection: a mobile app and a Chrome extension that check links before you open them. Built at the CodeSpring hackathon.",
    points: [
      "Serverless AWS backend (API Gateway, Lambda, DynamoDB, SQS) with Amazon Bedrock for AI risk classification; infrastructure as code with Terraform",
      "AWS Cognito auth shared by the app and the extension",
      "My part: the mobile app — QR scanning from camera or gallery, async analysis with error handling, sign-up flow, on-device history, dark theme and a senior mode",
    ],
    url: "https://github.com/vvitorr/ProofPocket-CodeSpring_2026",
  },
  {
    name: "Airport Network",
    period: "Feb – May 2026",
    role: "Team of 4 · Scrum Master (sprint 2)",
    tags: ["Networking"],
    stack: "Cisco Packet Tracer, OSPF, VLAN/VTP, DHCP, DNS, VoIP, NAT, ACLs",
    summary: "Multi-terminal airport network for the Computer Networks course (RCOMP).",
    points: [
      "Structured cabling design: cross-connects, fibre backbone, redundancy rules and hardware inventory",
      "VLANs over VTP, multi-area OSPF (backbone plus one area per terminal), DHCPv4, a DNS hierarchy, DMZ web servers and VoIP between terminals",
      "Static NAT and layered ACLs: anti-spoofing, DMZ isolation, router self-protection",
      "My part: Terminal 3 (configuration and docs) and the full campus simulation",
    ],
    url: "https://github.com/vvitorr/Airport_Network",
  },
  {
    name: "LogiTrack Rail Management",
    period: "Oct 2025 – Jan 2026",
    role: "Team of 6",
    tags: ["Software"],
    stack: "Java, PL/SQL (Oracle), C, C++, Assembly",
    summary: "Rail logistics: route creation, freight management and train scheduling with resource validation. Semester 3 integrative project.",
    points: [
      "Route manager with shortest-path generation and a manual station-by-station builder",
      "Freight and train scheduling that checks wagon and locomotive availability",
      "My part: the database access layer (PL/SQL functions for facilities, rail lines, segments, trains and wagons) and graph algorithm tests",
    ],
    url: "https://github.com/vvitorr/Rail_Management_System",
  },
  {
    name: "Railway Network Simulator",
    period: "Mar – Jun 2025",
    role: "Team of 5 · top committer",
    tags: ["Software"],
    stack: "Java, JavaFX, GraphStream, Python (Jupyter)",
    summary: "Rail-tycoon style simulator: maps, cities, industries, stations, rail lines and trains. Semester 2 integrative project.",
    points: [
      "My user stories: cities with residential blocks, station building and scenario creation, from design (UML) to tests",
      "Network graphs rendered with GraphStream inside a JavaFX app",
      "Statistical analysis of cargo and algorithm performance in Jupyter",
    ],
  },
  {
    name: "Plant Floor Manager",
    period: "Oct 2024 – Jan 2025",
    role: "Team of 8",
    tags: ["Software"],
    stack: "C, Assembly, Java, PL/SQL (Oracle), Python",
    summary: "Production-plant software: an Oracle plant-floor database, a machine supervisor, a production planning simulator and a PERT/CPM project manager.",
    points: [
      "My main part: the machine supervisor in C and Assembly — instruction loading and processing, machine state and alerts",
      "Production planning simulator and PERT/CPM project manager in Java",
      "Plant floor management with PL/SQL on Oracle",
    ],
  },
];

// Shown in the Code app. Group name -> items.
export const skills: Record<string, string[]> = {
  networking: ["TCP/IP", "VLANs", "Routing & Switching", "DHCP", "DNS", "OSPF", "Network Troubleshooting", "Cisco IOS"],
  languages: ["Java", "C", "SQL (PostgreSQL)", "Prolog", "JavaScript", "TypeScript"],
  webAndFrameworks: ["Node.js", "Angular", "React Native", "Three.js", "WebGL"],
  databases: ["PostgreSQL", "MongoDB"],
  ai: ["Amazon Bedrock", "Generative AI", "AI-assisted development"],
  infrastructure: ["Linux", "Windows Server", "Virtualization", "Docker", "AWS", "Terraform"],
  softwareEngineering: ["OOP", "Software Architecture", "Distributed Systems", "TDD", "UML", "Scrum"],
  tools: ["Git", "GitHub", "Wireshark", "Cisco Packet Tracer"],
};

// Drop images into public/photos and list them here.
export const photos: { src: string; caption: string }[] = [
  { src: "/photos/1.svg", caption: "TODO: add your photos to public/photos" },
  { src: "/photos/2.svg", caption: "Placeholder" },
  { src: "/photos/3.svg", caption: "Placeholder" },
  { src: "/photos/4.svg", caption: "Placeholder" },
  { src: "/photos/5.svg", caption: "Placeholder" },
  { src: "/photos/6.svg", caption: "Placeholder" },
];

// Desktop wallpapers: Apple's originals (via 512pixels.net), resized into public/wallpapers/<id>-light|dark.jpg.
// Each has a light and dark variant that follows the appearance setting. CSS maps html[data-wallpaper] to the files.
export const wallpapers = [
  { id: "tahoe", label: "macOS Tahoe" },
  { id: "sequoia", label: "macOS Sequoia" },
  { id: "sonoma", label: "macOS Sonoma" },
  { id: "ventura", label: "macOS Ventura" },
  { id: "monterey", label: "macOS Monterey" },
  { id: "bigsur", label: "macOS Big Sur" },
  { id: "catalina", label: "macOS Catalina" },
  { id: "mojave", label: "macOS Mojave" },
];
