/**
 * audit-data.ts
 *
 * Source: "School Technology Audit Questionnaire" supplied by the client
 * (Imperial EdTech format). 20 questions across 4 sections (A–D).
 * Each option is a checkbox; schools may tick all that apply.
 * Every option maps to one or more Revrica product triggers — the
 * scoring layer (audit-scoring.ts) tallies these to produce ranked
 * product recommendations.
 *
 * Option letters A–E match the source document's visual order only;
 * they carry no maturity-scale meaning here (unlike the old system).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductTrigger =
  | "E-Boards"
  | "Tablets / Laptops"
  | "Rev Micro-Cloud Server"
  | "Doc Cam / E-Boards"
  | "LMS"
  | "Digital Learning Content"
  | "STEM / Robotics Labs"
  | "Capacity Development"
  | "Digital Pedagogy Training"
  | "Student & Parent Portals"
  | "School Management Systems"
  | "Digital Library"
  | "Teacher Laptop Ownership Programme"
  | "R.E.S.T. Squad / Teach with Tech"
  | "Continuous Professional Development"
  | "Teach with Tech Certification"
  | "Campus Networking"
  | "Tech Audit / Infrastructure"
  | "R.E.S.T. Squad Support"
  | "Hardware Financing / DaaS"
  | "Mobile Device Management (MDM)"
  | "Smart ICT Laboratory"
  | "Student Tablets / Laptops"
  | "Device-as-a-Service"
  | "Compliance & Governance"
  | "MDM / Anti-theft Security"
  | "Enterprise-Grade Security"
  | "Hardware Lifecycle Financing"
  | "Flexible Hardware Financing"
  | "Technology Audit"
  | "BNPL / DaaS"
  | "Subscription-based Leasing"
  | "Integrated Solutions Bundles"
  | "Custom Software Development"
  | "Learning Analytics / Custom Portals"
  | "Software Development Services"
  | "Digital School Transformation Programme"
  | "Free Technology Audit"
  | "R.E.S.T. Squad";

export type AuditOption = {
  /** A–E: visual order in the source document */
  letter: "A" | "B" | "C" | "D" | "E";
  text: string;
  triggers: ProductTrigger[];
};

export type AuditQuestion = {
  /** 1-based question number matching the source document */
  number: number;
  /** Focus tag e.g. "Current Position" | "Core Challenge" | "School Need / Outcome" */
  focus: string;
  title: string;
  /** Instruction shown above the options */
  instruction: string;
  options: AuditOption[];
};

export type AuditSection = {
  id: string;
  letter: "A" | "B" | "C" | "D";
  title: string;
  questions: AuditQuestion[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

export const auditSections: AuditSection[] = [
  // ── SECTION A: How Students Learn ────────────────────────────────────────
  {
    id: "students",
    letter: "A",
    title: "How Students Learn",
    questions: [
      {
        number: 1,
        focus: "Current Position",
        title: "Classroom Tools",
        instruction: "What tools do your students currently interact with during daily lessons? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Textbooks and traditional chalkboards / whiteboards.",
            triggers: ["E-Boards"]
          },
          {
            letter: "B",
            text: "Standard non-interactive projectors or TVs.",
            triggers: ["E-Boards"]
          },
          {
            letter: "C",
            text: "Shared computers only available during scheduled lab time.",
            triggers: ["Tablets / Laptops"]
          },
          {
            letter: "D",
            text: "Occasional use of online apps, heavily dependent on live internet.",
            triggers: ["Rev Micro-Cloud Server"]
          },
          {
            letter: "E",
            text: "None of the above — we have more advanced tools in use.",
            triggers: []
          }
        ]
      },
      {
        number: 2,
        focus: "Core Challenge",
        title: "Helping Every Student Keep Up",
        instruction: "What is the biggest hurdle your teachers face in keeping every student engaged? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "It is difficult to present multimedia or 3D objects clearly to the whole class.",
            triggers: ["Doc Cam / E-Boards"]
          },
          {
            letter: "B",
            text: "We cannot easily track which students are falling behind in real-time.",
            triggers: ["LMS"]
          },
          {
            letter: "C",
            text: "Students lose focus due to a lack of interactive, gamified learning.",
            triggers: ["Digital Learning Content"]
          },
          {
            letter: "D",
            text: "We lack the physical spaces for hands-on, practical innovation.",
            triggers: ["STEM / Robotics Labs"]
          },
          {
            letter: "E",
            text: "Engagement is generally good — we are looking to take it further.",
            triggers: []
          }
        ]
      },
      {
        number: 3,
        focus: "Current Position",
        title: "Future-Ready Skills",
        instruction: "What digital skills are actively taught in your classrooms today? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Only basic typing and general computer appreciation.",
            triggers: ["Capacity Development"]
          },
          {
            letter: "B",
            text: "No formal digital skills are currently part of the standard curriculum.",
            triggers: ["STEM / Robotics Labs"]
          },
          {
            letter: "C",
            text: "Fundamental online safety is taught, though advanced digital literacy is omitted.",
            triggers: ["Digital Pedagogy Training"]
          },
          {
            letter: "D",
            text: "Coding, robotics, or other advanced digital subjects are taught.",
            triggers: []
          },
          {
            letter: "E",
            text: "A structured, curriculum-aligned digital skills programme is in place.",
            triggers: []
          }
        ]
      },
      {
        number: 4,
        focus: "Core Challenge",
        title: "Tracking Student Progress",
        instruction: "What limits your ability to test students and share academic results efficiently? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Grading is manual, time-consuming, and prone to human error.",
            triggers: ["LMS"]
          },
          {
            letter: "B",
            text: "Parents only receive updates at the end of the term, not instantly.",
            triggers: ["Student & Parent Portals"]
          },
          {
            letter: "C",
            text: "Tracking historical performance across multiple terms requires sifting through spreadsheets.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "D",
            text: "We have a digital gradebook but it is not integrated with other school systems.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "E",
            text: "Assessment and reporting are already largely automated.",
            triggers: []
          }
        ]
      },
      {
        number: 5,
        focus: "School Need / Outcome",
        title: "Learning Experiences",
        instruction: "How would you prefer your students to interact with educational content? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "We want them to access millions of curated books and research materials easily.",
            triggers: ["Digital Library"]
          },
          {
            letter: "B",
            text: "We want adaptive software that adjusts to individual learning speeds.",
            triggers: ["LMS", "Digital Learning Content"]
          },
          {
            letter: "C",
            text: "We want them to learn coding, robotics, and future-ready skills practically.",
            triggers: ["STEM / Robotics Labs"]
          },
          {
            letter: "D",
            text: "We want rich multimedia lessons delivered directly to personal devices.",
            triggers: ["Tablets / Laptops", "Digital Learning Content"]
          },
          {
            letter: "E",
            text: "We want a comprehensive, offline-capable content platform for the whole school.",
            triggers: ["Rev Micro-Cloud Server", "LMS"]
          }
        ]
      }
    ]
  },

  // ── SECTION B: Supporting Teachers ───────────────────────────────────────
  {
    id: "teachers",
    letter: "B",
    title: "Supporting Teachers",
    questions: [
      {
        number: 6,
        focus: "Current Position",
        title: "Preparing Lessons",
        instruction: "How do your teachers currently source and prepare their lesson materials? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Relying heavily on physical textbooks and printed materials.",
            triggers: ["LMS", "Digital Learning Content"]
          },
          {
            letter: "B",
            text: "Searching the open internet individually for resources.",
            triggers: ["Digital Library"]
          },
          {
            letter: "C",
            text: "Using personal USBs or basic shared folders to store files.",
            triggers: ["LMS", "Rev Micro-Cloud Server"]
          },
          {
            letter: "D",
            text: "Using a shared drive but without structured organisation or version control.",
            triggers: ["LMS"]
          },
          {
            letter: "E",
            text: "Using a proper LMS or structured content management platform.",
            triggers: []
          }
        ]
      },
      {
        number: 7,
        focus: "Core Challenge",
        title: "Comfort With Technology",
        instruction: "What prevents your teaching staff from fully embracing digital education? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "They lack personal devices to practice and prepare lessons at home.",
            triggers: ["Teacher Laptop Ownership Programme"]
          },
          {
            letter: "B",
            text: "They feel anxious because past tech rollouts lacked ongoing support.",
            triggers: ["R.E.S.T. Squad / Teach with Tech"]
          },
          {
            letter: "C",
            text: "They spend too much time on manual admin tasks (attendance, grading).",
            triggers: ["School Management Systems"]
          },
          {
            letter: "D",
            text: "They are willing but there has been no structured training programme.",
            triggers: ["Capacity Development", "Digital Pedagogy Training"]
          },
          {
            letter: "E",
            text: "Our staff are digitally confident and actively use EdTech in lessons.",
            triggers: []
          }
        ]
      },
      {
        number: 8,
        focus: "Current Position",
        title: "Training Received",
        instruction: "What level of professional technology training has your staff received? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Only one-off, irregular workshops with no follow-up.",
            triggers: ["Continuous Professional Development"]
          },
          {
            letter: "B",
            text: "Mostly self-taught through online videos.",
            triggers: ["Teach with Tech Certification"]
          },
          {
            letter: "C",
            text: "No formal digital pedagogy training has been provided.",
            triggers: ["Digital Pedagogy Training"]
          },
          {
            letter: "D",
            text: "Structured training happened once but is now outdated.",
            triggers: ["Continuous Professional Development"]
          },
          {
            letter: "E",
            text: "Ongoing, certified professional development is already in place.",
            triggers: []
          }
        ]
      },
      {
        number: 9,
        focus: "Core Challenge",
        title: "Working Together",
        instruction: "What are the main bottlenecks in staff collaboration and administration? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Communication relies on disorganised WhatsApp groups and physical meetings.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "B",
            text: "Lesson plans and resources cannot be easily co-created or shared digitally.",
            triggers: ["LMS"]
          },
          {
            letter: "C",
            text: "Administrative workflows (reports, fees) are disconnected from academic records.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "D",
            text: "There is no single system that gives leadership a real-time school overview.",
            triggers: ["School Management Systems", "Learning Analytics / Custom Portals"]
          },
          {
            letter: "E",
            text: "Collaboration and admin are well-managed through existing digital tools.",
            triggers: []
          }
        ]
      },
      {
        number: 10,
        focus: "School Need / Outcome",
        title: "Everyday Admin Work",
        instruction: "What support systems would most drastically improve teacher morale and efficiency? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Allowing every teacher to affordably own a personal device.",
            triggers: ["Teacher Laptop Ownership Programme"]
          },
          {
            letter: "B",
            text: "Providing structured, certified training on modern teaching methods.",
            triggers: ["Capacity Development"]
          },
          {
            letter: "C",
            text: "Automating daily admin tasks into one unified digital system.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "D",
            text: "Giving teachers a reliable local network to access resources without internet.",
            triggers: ["Rev Micro-Cloud Server", "Campus Networking"]
          },
          {
            letter: "E",
            text: "Providing dedicated technical support so teachers never have device downtime.",
            triggers: ["R.E.S.T. Squad Support"]
          }
        ]
      }
    ]
  },

  // ── SECTION C: School Infrastructure ─────────────────────────────────────
  {
    id: "infrastructure",
    letter: "C",
    title: "School Infrastructure",
    questions: [
      {
        number: 11,
        focus: "Current Position",
        title: "Internet Access",
        instruction: "How is internet connectivity currently managed across your campus? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Internet is unreliable or frequently drops during school hours.",
            triggers: ["Tech Audit / Infrastructure"]
          },
          {
            letter: "B",
            text: "Bandwidth is insufficient for multiple classrooms to connect at once.",
            triggers: ["Campus Networking"]
          },
          {
            letter: "C",
            text: "There is no localised network to access files if the main internet fails.",
            triggers: ["Rev Micro-Cloud Server"]
          },
          {
            letter: "D",
            text: "We have Wi-Fi but it is unmanaged and accessible to students without controls.",
            triggers: ["Mobile Device Management (MDM)", "Campus Networking"]
          },
          {
            letter: "E",
            text: "We have a fully managed, high-speed campus network.",
            triggers: []
          }
        ]
      },
      {
        number: 12,
        focus: "Core Challenge",
        title: "Classroom Setup",
        instruction: "What are the biggest issues with your current classroom and lab hardware? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Devices frequently break down and repairs take too long.",
            triggers: ["R.E.S.T. Squad Support"]
          },
          {
            letter: "B",
            text: "Our computer lab is outdated and hardware is rapidly depreciating.",
            triggers: ["Hardware Financing / DaaS"]
          },
          {
            letter: "C",
            text: "We cannot remotely track, secure, or update the devices we currently own.",
            triggers: ["Mobile Device Management (MDM)"]
          },
          {
            letter: "D",
            text: "Classrooms lack proper display technology (smartboards, projectors).",
            triggers: ["E-Boards"]
          },
          {
            letter: "E",
            text: "Our hardware is modern and well-maintained.",
            triggers: []
          }
        ]
      },
      {
        number: 13,
        focus: "Current Position",
        title: "Devices for Students",
        instruction: "How do your students currently access digital learning devices? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "They share a limited pool of aging desktop computers.",
            triggers: ["Smart ICT Laboratory"]
          },
          {
            letter: "B",
            text: "They have no dedicated access to personal tablets or laptops.",
            triggers: ["Student Tablets / Laptops"]
          },
          {
            letter: "C",
            text: "Access is strictly limited to scheduled lab sessions.",
            triggers: ["Device-as-a-Service"]
          },
          {
            letter: "D",
            text: "Some students have personal devices (BYOD) but coverage is inconsistent.",
            triggers: ["Mobile Device Management (MDM)", "Device-as-a-Service"]
          },
          {
            letter: "E",
            text: "Every student has consistent, managed access to a personal device.",
            triggers: []
          }
        ]
      },
      {
        number: 14,
        focus: "Core Challenge",
        title: "Keeping Students Safe Online",
        instruction: "What concerns do you have regarding data privacy and digital safety? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "We lack central controls to block students from visiting unsafe websites.",
            triggers: ["Mobile Device Management (MDM)"]
          },
          {
            letter: "B",
            text: "We are unsure if our school's data practices comply with NDPR regulations.",
            triggers: ["Compliance & Governance"]
          },
          {
            letter: "C",
            text: "We have no anti-theft system if a school device goes missing.",
            triggers: ["MDM / Anti-theft Security"]
          },
          {
            letter: "D",
            text: "Student data is stored in multiple unconnected systems with no unified governance.",
            triggers: ["School Management Systems", "Compliance & Governance"]
          },
          {
            letter: "E",
            text: "Digital safety and data governance are already well-managed.",
            triggers: []
          }
        ]
      },
      {
        number: 15,
        focus: "School Need / Outcome",
        title: "Learning Materials Online",
        instruction: "How do you want your campus infrastructure to operate in the future? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "We want a local network that delivers digital content even without live internet.",
            triggers: ["Rev Micro-Cloud Server"]
          },
          {
            letter: "B",
            text: "We want rapid, local repair services to minimise hardware downtime.",
            triggers: ["R.E.S.T. Squad Support"]
          },
          {
            letter: "C",
            text: "We want enterprise-grade security protecting our network and devices.",
            triggers: ["Enterprise-Grade Security"]
          },
          {
            letter: "D",
            text: "We want every classroom fitted with modern interactive display technology.",
            triggers: ["E-Boards", "Smart ICT Laboratory"]
          },
          {
            letter: "E",
            text: "We want a fully managed device fleet with MDM and lifecycle support.",
            triggers: ["Mobile Device Management (MDM)", "Hardware Lifecycle Financing"]
          }
        ]
      }
    ]
  },

  // ── SECTION D: Where You Want To Go ──────────────────────────────────────
  {
    id: "strategy",
    letter: "D",
    title: "Where You Want To Go",
    questions: [
      {
        number: 16,
        focus: "Current Position",
        title: "Investment Plans",
        instruction: "How does your school currently approach large-scale technology spending? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "We operate on a small, reactive budget for emergency repairs only.",
            triggers: ["Hardware Lifecycle Financing"]
          },
          {
            letter: "B",
            text: "We rely entirely on large, upfront capital expenditures.",
            triggers: ["Flexible Hardware Financing"]
          },
          {
            letter: "C",
            text: "We currently have no structured 3-to-5 year financial roadmap for tech.",
            triggers: ["Technology Audit"]
          },
          {
            letter: "D",
            text: "We have a budget but lack confidence in which technologies to prioritise.",
            triggers: ["Technology Audit", "Free Technology Audit"]
          },
          {
            letter: "E",
            text: "We have a structured technology investment plan and roadmap.",
            triggers: []
          }
        ]
      },
      {
        number: 17,
        focus: "Core Challenge",
        title: "How Fast To Move",
        instruction: "What is the biggest barrier preventing your school from fully modernising today? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "The massive upfront cost of buying modern equipment all at once.",
            triggers: ["BNPL / DaaS"]
          },
          {
            letter: "B",
            text: "Fear of investing in technology that will quickly become obsolete.",
            triggers: ["Device-as-a-Service"]
          },
          {
            letter: "C",
            text: "Lack of a clear, expert-guided strategy for rollout and adoption.",
            triggers: ["Technology Audit"]
          },
          {
            letter: "D",
            text: "Difficulty getting staff, parents, and leadership aligned on a shared vision.",
            triggers: ["Digital School Transformation Programme"]
          },
          {
            letter: "E",
            text: "We are actively modernising — we need an implementation partner, not a plan.",
            triggers: ["Integrated Solutions Bundles"]
          }
        ]
      },
      {
        number: 18,
        focus: "School Need / Outcome",
        title: "Funding Transformation",
        instruction: "How would you prefer to fund your school's digital transformation? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "We want to spread the cost of hardware into predictable monthly subscriptions.",
            triggers: ["Subscription-based Leasing"]
          },
          {
            letter: "B",
            text: "We want flexible payment plans so individual teachers can afford their own tools.",
            triggers: ["Teacher Laptop Ownership Programme"]
          },
          {
            letter: "C",
            text: "We want to finance complete, turnkey smart classrooms or laboratories.",
            triggers: ["Integrated Solutions Bundles"]
          },
          {
            letter: "D",
            text: "We want a grant or partnership model rather than debt-based financing.",
            triggers: ["Digital School Transformation Programme"]
          },
          {
            letter: "E",
            text: "We can fund upfront — we just need the right products and a clear proposal.",
            triggers: ["Technology Audit"]
          }
        ]
      },
      {
        number: 19,
        focus: "Core Challenge",
        title: "Tracking School Performance",
        instruction: "What makes tracking the overall health of your institution difficult for leadership? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "Academic, financial, and administrative data are kept in separate, unlinked systems.",
            triggers: ["Custom Software Development"]
          },
          {
            letter: "B",
            text: "We lack visual dashboards to give us a real-time overview of school performance.",
            triggers: ["Learning Analytics / Custom Portals"]
          },
          {
            letter: "C",
            text: "Creating comprehensive reports for the board or parents takes weeks.",
            triggers: ["School Management Systems"]
          },
          {
            letter: "D",
            text: "We cannot benchmark our performance against other schools or national standards.",
            triggers: ["Learning Analytics / Custom Portals", "School Management Systems"]
          },
          {
            letter: "E",
            text: "Leadership has real-time visibility into all key school metrics.",
            triggers: []
          }
        ]
      },
      {
        number: 20,
        focus: "School Need / Outcome",
        title: "Your 3–5 Year Vision",
        instruction: "What is your ultimate 3-5 year vision for your institution? (tick all that apply)",
        options: [
          {
            letter: "A",
            text: "To have a fully integrated, bespoke digital platform unique to our school's brand.",
            triggers: ["Software Development Services"]
          },
          {
            letter: "B",
            text: "To be recognised as a fully digitised, model tech-driven school.",
            triggers: ["Digital School Transformation Programme"]
          },
          {
            letter: "C",
            text: "To receive a comprehensive, cost-free roadmap to begin this journey safely.",
            triggers: ["Free Technology Audit"]
          },
          {
            letter: "D",
            text: "To equip every teacher and student with a personal, managed device.",
            triggers: ["Teacher Laptop Ownership Programme", "Student Tablets / Laptops"]
          },
          {
            letter: "E",
            text: "To build a financially sustainable, phased technology programme over 5 years.",
            triggers: ["Hardware Lifecycle Financing", "Technology Audit"]
          }
        ]
      }
    ]
  }
];

/** Flat list of all 20 questions in document order. */
export const allQuestions: AuditQuestion[] = auditSections.flatMap(
  (section) => section.questions
);

/** Every distinct product trigger that exists across all options. */
export const allProductTriggers: ProductTrigger[] = [
  "E-Boards",
  "Tablets / Laptops",
  "Rev Micro-Cloud Server",
  "Doc Cam / E-Boards",
  "LMS",
  "Digital Learning Content",
  "STEM / Robotics Labs",
  "Capacity Development",
  "Digital Pedagogy Training",
  "Student & Parent Portals",
  "School Management Systems",
  "Digital Library",
  "Teacher Laptop Ownership Programme",
  "R.E.S.T. Squad / Teach with Tech",
  "Continuous Professional Development",
  "Teach with Tech Certification",
  "Campus Networking",
  "Tech Audit / Infrastructure",
  "R.E.S.T. Squad Support",
  "Hardware Financing / DaaS",
  "Mobile Device Management (MDM)",
  "Smart ICT Laboratory",
  "Student Tablets / Laptops",
  "Device-as-a-Service",
  "Compliance & Governance",
  "MDM / Anti-theft Security",
  "Enterprise-Grade Security",
  "Hardware Lifecycle Financing",
  "Flexible Hardware Financing",
  "Technology Audit",
  "BNPL / DaaS",
  "Subscription-based Leasing",
  "Integrated Solutions Bundles",
  "Custom Software Development",
  "Learning Analytics / Custom Portals",
  "Software Development Services",
  "Digital School Transformation Programme",
  "Free Technology Audit",
  "R.E.S.T. Squad"
];
