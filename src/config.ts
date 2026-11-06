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

export const projects: { name: string; stack: string; date: string; url?: string; points: string[] }[] = [
  {
    name: "Multi-Site Campus Network",
    stack: "Cisco IOS, VLANs, HSRP, DHCP, WLC",
    date: "June 2026",
    points: [
      "IPv4 addressing for a 3-site enterprise topology, hierarchical subnetting across 20+ VLAN segments",
      "EtherChannel and inter-site static routing with primary/backup paths and floating routes",
      "DHCPv4, VLAN trunking, RSTP and HSRP for Layer 2/3 redundancy in the campus core",
      "Multi-site wireless with WLC, FlexConnect APs, AP Groups and per-site WLANs (staff/guests)",
    ],
  },
  {
    name: "ProofPocket",
    stack: "React Native, TypeScript, Python, AWS, Terraform",
    date: "May 2026",
    url: "https://github.com/vvitorr/ProofPocket-CodeSpring_2026",
    points: [
      "Privacy-first phishing detection platform built at a hackathon (team): Expo mobile app + Chrome extension that intercepts external links",
      "Serverless AWS backend (API Gateway, Lambda, DynamoDB, SQS) with Amazon Bedrock for AI risk classification",
      "AWS Cognito auth (sign-up, email confirmation, JWT) shared across mobile and browser clients",
      "On-device scan history (SecureStore); infrastructure as code with Terraform",
    ],
  },
  {
    name: "AISafe",
    stack: "Java, JPA, PostgreSQL, TCP/UDP, ANTLR, C",
    date: "Mar 2026 – Jun 2026",
    points: [
      "Multi-module aviation backoffice in Java with DDD and layered architecture",
      "Fleet, routes, pilots, weather and flight plans on JPA/Hibernate + PostgreSQL, 1,000+ JUnit tests (JaCoCo)",
      "Custom TCP protocol for remote ATCC, pilot and weather clients with role-based auth and opcode routing",
      "Flight-plan DSL (ANTLR4) validated against a C physics simulator (IPC, shared memory)",
      "UDP audit logging for remote sessions; deployed on ISEP private cloud",
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
