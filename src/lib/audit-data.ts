export type AuditOption = {
  /** A–E, used for the maturity scoring framework (A=1 ... E=5) */
  letter: "A" | "B" | "C" | "D" | "E";
  text: string;
};

export type AuditPrompt = {
  /** Stable id used as the storage key, e.g. "s1-q1-challenge" */
  id: string;
  /** The question text shown above the options */
  label: string;
  options: AuditOption[];
};

export type AuditItem = {
  /** Numbered item 1–20, as in the source document */
  number: number;
  title: string;
  /** Each numbered item has a "challenge" prompt and a "current resources/tools" prompt */
  prompts: AuditPrompt[];
};

export type AuditSection = {
  id: string;
  letter: "A" | "B" | "C" | "D";
  title: string;
  description: string;
  items: AuditItem[];
};

const letterPoints: Record<AuditOption["letter"], number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };

export function pointsForLetter(letter: AuditOption["letter"]): number {
  return letterPoints[letter];
}

/**
 * Source: Imperial EdTech "School Technology Audit Questionnaire" (docx
 * supplied by the client). Originally a single-select A–E maturity scale
 * per prompt; per product decision this renders as checkboxes (schools
 * may select more than one option per prompt), and the maturity score
 * is computed as the average point value (A=1 ... E=5) across every
 * option a school checks. See lib/audit-scoring.ts for that logic.
 *
 * Structure preserved from the source: 4 sections, 5 numbered items per
 * section, 2 prompts per item (a "challenge" prompt and a "current
 * resources/tools" prompt) = 40 prompts total, 5 options each.
 */
export const auditSections: AuditSection[] = [
  {
    id: "engagement",
    letter: "A",
    title: "Student Engagement & Learning Outcomes",
    description: "How students engage with lessons, pace, practical learning, and assessment.",
    items: [
      {
        number: 1,
        title: "Current Student Engagement Challenges",
        prompts: [
          {
            id: "s1-q1-challenge",
            label: "What best describes your biggest challenge with student engagement?",
            options: [
              { letter: "A", text: "Students lose interest quickly in traditional lectures" },
              { letter: "B", text: "Difficulty making abstract concepts relatable" },
              { letter: "C", text: "Limited hands-on learning opportunities" },
              { letter: "D", text: "Students are easily distracted during lessons" },
              { letter: "E", text: "Mixed engagement levels across different subjects" }
            ]
          },
          {
            id: "s1-q1-current",
            label: "What tools do you currently use to engage students?",
            options: [
              { letter: "A", text: "Textbooks and whiteboard only" },
              { letter: "B", text: "Projector/basic display system" },
              { letter: "C", text: "Interactive whiteboard/smartboard" },
              { letter: "D", text: "Student tablets/laptops (limited)" },
              { letter: "E", text: "Comprehensive digital learning tools" }
            ]
          }
        ]
      },
      {
        number: 2,
        title: "Learning Pace & Differentiation",
        prompts: [
          {
            id: "s1-q2-challenge",
            label: "What describes your biggest challenge with different learning speeds?",
            options: [
              { letter: "A", text: "Advanced students finish early and get bored" },
              { letter: "B", text: "Struggling students fall behind and lose confidence" },
              { letter: "C", text: "Cannot provide personalized attention to all students" },
              { letter: "D", text: "Limited resources to support different learning styles" },
              { letter: "E", text: "Difficult to track individual progress effectively" }
            ]
          },
          {
            id: "s1-q2-current",
            label: "How do you currently track student progress?",
            options: [
              { letter: "A", text: "Traditional paper tests and manual grading" },
              { letter: "B", text: "Basic digital gradebook" },
              { letter: "C", text: "Learning management system with basic analytics" },
              { letter: "D", text: "Interactive assessment tools with immediate feedback" },
              { letter: "E", text: "Comprehensive learning analytics platform" }
            ]
          }
        ]
      },
      {
        number: 3,
        title: "Real-World Application & Practical Learning",
        prompts: [
          {
            id: "s1-q3-challenge",
            label: "Which subjects need more hands-on, practical demonstrations?",
            options: [
              { letter: "A", text: "Mathematics (calculations and problem-solving)" },
              { letter: "B", text: "Sciences (experiments and lab work)" },
              { letter: "C", text: "Technology/Computer studies" },
              { letter: "D", text: "Languages (interactive communication)" },
              { letter: "E", text: "Multiple subjects need practical enhancement" }
            ]
          },
          {
            id: "s1-q3-current",
            label: "What practical learning resources do you have?",
            options: [
              { letter: "A", text: "No dedicated lab or practical learning space" },
              { letter: "B", text: "Basic science lab with limited equipment" },
              { letter: "C", text: "Computer lab with older systems" },
              { letter: "D", text: "Well-equipped labs but limited technology integration" },
              { letter: "E", text: "Modern labs with digital learning integration" }
            ]
          }
        ]
      },
      {
        number: 4,
        title: "21st Century Skills Development",
        prompts: [
          {
            id: "s1-q4-challenge",
            label: "What future-readiness skills are you most concerned about developing?",
            options: [
              { letter: "A", text: "Digital literacy and technology skills" },
              { letter: "B", text: "Critical thinking and problem-solving" },
              { letter: "C", text: "Collaboration and communication" },
              { letter: "D", text: "Creativity and innovation" },
              { letter: "E", text: "All of the above — comprehensive skill development" }
            ]
          },
          {
            id: "s1-q4-current",
            label: "What technology do students regularly use for learning?",
            options: [
              { letter: "A", text: "No regular access to learning technology" },
              { letter: "B", text: "Shared computers (limited time per student)" },
              { letter: "C", text: "One-to-one device access during specific classes" },
              { letter: "D", text: "Personal devices (BYOD) with some educational apps" },
              { letter: "E", text: "Comprehensive learning technology ecosystem" }
            ]
          }
        ]
      },
      {
        number: 5,
        title: "Assessment & Feedback Effectiveness",
        prompts: [
          {
            id: "s1-q5-challenge",
            label: "What's your biggest challenge with student assessment and feedback?",
            options: [
              { letter: "A", text: "Time-consuming manual grading delays feedback" },
              { letter: "B", text: "Difficult to identify specific learning gaps quickly" },
              { letter: "C", text: "Limited variety in assessment methods" },
              { letter: "D", text: "Cannot provide personalized feedback efficiently" },
              { letter: "E", text: "Students don't engage well with current assessment formats" }
            ]
          },
          {
            id: "s1-q5-current",
            label: "What systems support your assessment process?",
            options: [
              { letter: "A", text: "Paper-based testing and manual record keeping" },
              { letter: "B", text: "Basic digital gradebook or spreadsheet" },
              { letter: "C", text: "School management system with grade tracking" },
              { letter: "D", text: "Online testing platform with basic analytics" },
              { letter: "E", text: "Integrated assessment system with detailed insights" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "teaching",
    letter: "B",
    title: "Teaching Effectiveness & Professional Development",
    description: "Lesson prep, teacher confidence with tech, collaboration, and admin load.",
    items: [
      {
        number: 6,
        title: "Lesson Preparation & Resource Availability",
        prompts: [
          {
            id: "s2-q6-challenge",
            label: "What consumes most of your lesson preparation time?",
            options: [
              { letter: "A", text: "Searching for relevant, quality teaching materials" },
              { letter: "B", text: "Creating visual aids and interactive content" },
              { letter: "C", text: "Adapting content for different learning levels" },
              { letter: "D", text: "Planning activities that engage all students" },
              { letter: "E", text: "Technical setup and troubleshooting" }
            ]
          },
          {
            id: "s2-q6-current",
            label: "What teaching resources do you primarily use?",
            options: [
              { letter: "A", text: "Textbooks and printed materials only" },
              { letter: "B", text: "Internet search for supplementary materials" },
              { letter: "C", text: "Limited digital content library" },
              { letter: "D", text: "Good digital resources but time-consuming to access" },
              { letter: "E", text: "Comprehensive, easily accessible digital content library" }
            ]
          }
        ]
      },
      {
        number: 7,
        title: "Professional Development & Technology Confidence",
        prompts: [
          {
            id: "s2-q7-challenge",
            label: "What best describes your relationship with educational technology?",
            options: [
              { letter: "A", text: "Interested but lack confidence to implement new tools" },
              { letter: "B", text: "Comfortable with basics but want to learn advanced features" },
              { letter: "C", text: "Eager to innovate but need structured training support" },
              { letter: "D", text: "Confident user seeking cutting-edge solutions" },
              { letter: "E", text: "Technology integration feels overwhelming" }
            ]
          },
          {
            id: "s2-q7-current",
            label: "What professional development support do you receive?",
            options: [
              { letter: "A", text: "Minimal or no technology training provided" },
              { letter: "B", text: "Occasional workshops or seminars" },
              { letter: "C", text: "Online tutorials and self-directed learning" },
              { letter: "D", text: "Regular training sessions but limited follow-up support" },
              { letter: "E", text: "Comprehensive, ongoing professional development program" }
            ]
          }
        ]
      },
      {
        number: 8,
        title: "Collaboration & Knowledge Sharing",
        prompts: [
          {
            id: "s2-q8-challenge",
            label: "What limits effective collaboration among teachers?",
            options: [
              { letter: "A", text: "No platform for sharing resources and strategies" },
              { letter: "B", text: "Time constraints prevent collaborative planning" },
              { letter: "C", text: "Limited communication tools between colleagues" },
              { letter: "D", text: "Inconsistent teaching approaches across classes" },
              { letter: "E", text: "Lack of structured collaboration processes" }
            ]
          },
          {
            id: "s2-q8-current",
            label: "How do teachers currently collaborate and communicate?",
            options: [
              { letter: "A", text: "In-person meetings and paper-based sharing" },
              { letter: "B", text: "Email and basic messaging" },
              { letter: "C", text: "Shared drives with some digital collaboration" },
              { letter: "D", text: "Collaboration platform with file sharing" },
              { letter: "E", text: "Integrated communication and collaboration ecosystem" }
            ]
          }
        ]
      },
      {
        number: 9,
        title: "Differentiated Instruction Capabilities",
        prompts: [
          {
            id: "s2-q9-challenge",
            label: "What's your biggest challenge in reaching different types of learners?",
            options: [
              { letter: "A", text: "Cannot provide visual, auditory, and kinesthetic options simultaneously" },
              { letter: "B", text: "Limited resources to adapt content for different abilities" },
              { letter: "C", text: "Difficult to manage multiple learning activities in one classroom" },
              { letter: "D", text: "No tools to identify individual learning preferences" },
              { letter: "E", text: "Time constraints prevent personalized instruction" }
            ]
          },
          {
            id: "s2-q9-current",
            label: "What helps you cater to different learning styles?",
            options: [
              { letter: "A", text: "Traditional teaching methods only" },
              { letter: "B", text: "Basic multimedia (videos, audio) occasionally" },
              { letter: "C", text: "Some interactive tools and varied activities" },
              { letter: "D", text: "Good variety but lacks systematic approach" },
              { letter: "E", text: "Comprehensive adaptive learning platform" }
            ]
          }
        ]
      },
      {
        number: 10,
        title: "Administrative Efficiency",
        prompts: [
          {
            id: "s2-q10-challenge",
            label: "Which administrative tasks consume too much of your teaching time?",
            options: [
              { letter: "A", text: "Manual attendance tracking and reporting" },
              { letter: "B", text: "Grading and progress report generation" },
              { letter: "C", text: "Parent communication and update management" },
              { letter: "D", text: "Lesson planning and resource organization" },
              { letter: "E", text: "All administrative tasks need streamlining" }
            ]
          },
          {
            id: "s2-q10-current",
            label: "What systems handle your administrative tasks?",
            options: [
              { letter: "A", text: "Manual, paper-based processes" },
              { letter: "B", text: "Basic spreadsheets and documents" },
              { letter: "C", text: "School management system (limited features)" },
              { letter: "D", text: "Digital tools but not integrated" },
              { letter: "E", text: "Comprehensive, integrated administrative platform" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "infrastructure",
    letter: "C",
    title: "Infrastructure & Learning Environment",
    description: "Connectivity, classroom tech, device access, content access, and security.",
    items: [
      {
        number: 11,
        title: "Internet Connectivity & Network Infrastructure",
        prompts: [
          {
            id: "s3-q11-challenge",
            label: "How does internet connectivity affect your teaching?",
            options: [
              { letter: "A", text: "No reliable internet access for educational use" },
              { letter: "B", text: "Limited connectivity that often disrupts lessons" },
              { letter: "C", text: "Adequate for basic use but slow for multimedia content" },
              { letter: "D", text: "Good connectivity but limited device capacity" },
              { letter: "E", text: "Excellent connectivity supporting all educational needs" }
            ]
          },
          {
            id: "s3-q11-current",
            label: "What describes your school's internet infrastructure?",
            options: [
              { letter: "A", text: "No dedicated educational internet connection" },
              { letter: "B", text: "Basic internet with limited bandwidth" },
              { letter: "C", text: "Adequate connection for essential functions" },
              { letter: "D", text: "Good connectivity but needs network management" },
              { letter: "E", text: "Robust, managed network infrastructure" }
            ]
          }
        ]
      },
      {
        number: 12,
        title: "Learning Space & Physical Environment",
        prompts: [
          {
            id: "s3-q12-challenge",
            label: "What physical limitations affect your teaching effectiveness?",
            options: [
              { letter: "A", text: "Classroom layout doesn't support interactive learning" },
              { letter: "B", text: "Limited display options for multimedia content" },
              { letter: "C", text: "No flexibility to rearrange for different activities" },
              { letter: "D", text: "Insufficient power outlets for device charging" },
              { letter: "E", text: "Outdated furniture and learning environment setup" }
            ]
          },
          {
            id: "s3-q12-current",
            label: "What technology is installed in your classrooms?",
            options: [
              { letter: "A", text: "Traditional blackboard/whiteboard only" },
              { letter: "B", text: "Basic projector or TV display" },
              { letter: "C", text: "Interactive whiteboard or smart display" },
              { letter: "D", text: "Good display technology but limited integration" },
              { letter: "E", text: "Comprehensive smart classroom setup" }
            ]
          }
        ]
      },
      {
        number: 13,
        title: "Device Access & Management",
        prompts: [
          {
            id: "s3-q13-challenge",
            label: "What describes student access to learning devices?",
            options: [
              { letter: "A", text: "Students have no regular access to digital devices" },
              { letter: "B", text: "Shared devices with very limited time per student" },
              { letter: "C", text: "Computer lab access for scheduled sessions only" },
              { letter: "D", text: "Some one-to-one access but inconsistent" },
              { letter: "E", text: "Comprehensive one-to-one device program" }
            ]
          },
          {
            id: "s3-q13-current",
            label: "How are educational devices currently managed?",
            options: [
              { letter: "A", text: "No systematic device management" },
              { letter: "B", text: "Basic inventory tracking" },
              { letter: "C", text: "Manual device setup and maintenance" },
              { letter: "D", text: "Some automated management but needs improvement" },
              { letter: "E", text: "Comprehensive device management and security system" }
            ]
          }
        ]
      },
      {
        number: 14,
        title: "Content Access & Digital Library",
        prompts: [
          {
            id: "s3-q14-challenge",
            label: "How do students access research materials and educational content?",
            options: [
              { letter: "A", text: "Limited to physical library and textbooks" },
              { letter: "B", text: "Basic internet access for general research" },
              { letter: "C", text: "Some digital educational resources available" },
              { letter: "D", text: "Good content access but needs better organization" },
              { letter: "E", text: "Comprehensive digital library and learning resources" }
            ]
          },
          {
            id: "s3-q14-current",
            label: "What systems organize and deliver educational content?",
            options: [
              { letter: "A", text: "Physical materials and basic file storage" },
              { letter: "B", text: "Simple shared folders or drives" },
              { letter: "C", text: "Learning management system with basic features" },
              { letter: "D", text: "Good content platform but limited integration" },
              { letter: "E", text: "Comprehensive content management and delivery system" }
            ]
          }
        ]
      },
      {
        number: 15,
        title: "Security & Safety Infrastructure",
        prompts: [
          {
            id: "s3-q15-challenge",
            label: "What concerns do you have about student safety and digital security?",
            options: [
              { letter: "A", text: "No content filtering or online safety measures" },
              { letter: "B", text: "Basic security but concerns about inappropriate content" },
              { letter: "C", text: "Adequate safety measures but limited monitoring" },
              { letter: "D", text: "Good security but needs better management tools" },
              { letter: "E", text: "Comprehensive safety and security infrastructure" }
            ]
          },
          {
            id: "s3-q15-current",
            label: "What security and safety systems are in place?",
            options: [
              { letter: "A", text: "No systematic digital safety measures" },
              { letter: "B", text: "Basic antivirus and minimal filtering" },
              { letter: "C", text: "Standard security software and some filtering" },
              { letter: "D", text: "Good security tools but need better integration" },
              { letter: "E", text: "Comprehensive security and monitoring system" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "strategy",
    letter: "D",
    title: "Strategic Vision & ROI Focus",
    description: "STEM priorities, competitiveness, budget, change management, and long-term planning.",
    items: [
      {
        number: 16,
        title: "STEM & Innovation Readiness",
        prompts: [
          {
            id: "s4-q16-challenge",
            label: "What's your priority for improving STEM education outcomes?",
            options: [
              { letter: "A", text: "Making mathematics more engaging and practical" },
              { letter: "B", text: "Providing hands-on science learning experiences" },
              { letter: "C", text: "Introducing coding and technology skills" },
              { letter: "D", text: "Developing engineering and design thinking" },
              { letter: "E", text: "Comprehensive STEM integration across subjects" }
            ]
          },
          {
            id: "s4-q16-current",
            label: "What supports your STEM teaching currently?",
            options: [
              { letter: "A", text: "Traditional textbooks and basic materials" },
              { letter: "B", text: "Some digital STEM content and tools" },
              { letter: "C", text: "Basic lab equipment and software" },
              { letter: "D", text: "Good STEM resources but limited integration" },
              { letter: "E", text: "Comprehensive STEM learning ecosystem" }
            ]
          }
        ]
      },
      {
        number: 17,
        title: "School Competitiveness & Achievement Goals",
        prompts: [
          {
            id: "s4-q17-challenge",
            label: "What improvement would most enhance your school's reputation and results?",
            options: [
              { letter: "A", text: "Higher standardized test scores and academic achievement" },
              { letter: "B", text: "Better student engagement and reduced dropout rates" },
              { letter: "C", text: "Enhanced technology integration and 21st-century readiness" },
              { letter: "D", text: "Improved teacher effectiveness and innovation" },
              { letter: "E", text: "Comprehensive school transformation and excellence" }
            ]
          },
          {
            id: "s4-q17-current",
            label: "How do you monitor and improve school performance?",
            options: [
              { letter: "A", text: "Basic academic records and test scores" },
              { letter: "B", text: "Standard reporting with limited analytics" },
              { letter: "C", text: "Some data analysis but manual processes" },
              { letter: "D", text: "Good data collection but needs better insights" },
              { letter: "E", text: "Comprehensive performance analytics and improvement tracking" }
            ]
          }
        ]
      },
      {
        number: 18,
        title: "Budget & Resource Optimization",
        prompts: [
          {
            id: "s4-q18-challenge",
            label: "What's your biggest concern about technology investment and sustainability?",
            options: [
              { letter: "A", text: "Limited budget requires maximum impact solutions" },
              { letter: "B", text: "Need proof of improved learning outcomes" },
              { letter: "C", text: "Concern about ongoing maintenance and support costs" },
              { letter: "D", text: "Want scalable solutions that grow with the school" },
              { letter: "E", text: "Need comprehensive ROI analysis and planning" }
            ]
          },
          {
            id: "s4-q18-current",
            label: "How do you currently manage technology investments?",
            options: [
              { letter: "A", text: "Minimal technology budget allocation" },
              { letter: "B", text: "Basic technology expenses in annual budget" },
              { letter: "C", text: "Dedicated technology budget but limited planning" },
              { letter: "D", text: "Strategic technology planning but needs optimization" },
              { letter: "E", text: "Comprehensive technology investment and ROI tracking" }
            ]
          }
        ]
      },
      {
        number: 19,
        title: "Implementation Timeline & Change Management",
        prompts: [
          {
            id: "s4-q19-challenge",
            label: "What's your preferred approach to implementing new educational technology?",
            options: [
              { letter: "A", text: "Gradual pilot programs with careful evaluation" },
              { letter: "B", text: "Phase-by-phase implementation across grade levels" },
              { letter: "C", text: "Comprehensive transformation with full support" },
              { letter: "D", text: "Subject-specific implementation based on priority needs" },
              { letter: "E", text: "Flexible approach based on school readiness and resources" }
            ]
          },
          {
            id: "s4-q19-current",
            label: "How does your school typically handle new initiatives?",
            options: [
              { letter: "A", text: "Limited experience with major technology changes" },
              { letter: "B", text: "Basic implementation with minimal support structure" },
              { letter: "C", text: "Standard change processes but need improvement" },
              { letter: "D", text: "Good change management but needs technology focus" },
              { letter: "E", text: "Comprehensive change management and support systems" }
            ]
          }
        ]
      },
      {
        number: 20,
        title: "Long-term Vision & Sustainability",
        prompts: [
          {
            id: "s4-q20-challenge",
            label: "Where do you want your school to be in 3-5 years regarding educational technology?",
            options: [
              { letter: "A", text: "Basic technology integration meeting minimum standards" },
              { letter: "B", text: "Solid technology foundation supporting improved learning" },
              { letter: "C", text: "Advanced technology integration enhancing all subjects" },
              { letter: "D", text: "Innovation leader and model for other schools" },
              { letter: "E", text: "Comprehensive digital transformation with measurable excellence" }
            ]
          },
          {
            id: "s4-q20-current",
            label: "How do you plan for long-term educational technology development?",
            options: [
              { letter: "A", text: "No formal long-term technology planning" },
              { letter: "B", text: "Basic planning with annual technology considerations" },
              { letter: "C", text: "Strategic planning but limited technology integration" },
              { letter: "D", text: "Good strategic planning but needs implementation support" },
              { letter: "E", text: "Comprehensive strategic planning with technology roadmap" }
            ]
          }
        ]
      }
    ]
  }
];

/** Flat list of every prompt across all sections, in document order. */
export const allPrompts: AuditPrompt[] = auditSections.flatMap((section) =>
  section.items.flatMap((item) => item.prompts)
);

export const totalPromptCount = allPrompts.length; // 40
