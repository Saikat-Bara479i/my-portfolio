/**
 * Saikat Barai - Windows XP Portfolio Data
 * Information extracted from official resume & academic records
 */

const SAIKAT_DATA = {
  profile: {
    name: "Saikat Barai",
    title: "Software Engineer & AI / Systems Enthusiast",
    tagline: "B.Tech IT Student @ Jalpaiguri Government Engineering College",
    email: "brucewyane699@gmail.com",
    phone: "+91-8597277733",
    location: "West Bengal, India",
    status: "Seeking SDE / AI Engineer Internships & New Grad Roles",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      leetcode: "https://leetcode.com",
      email: "mailto:brucewyane699@gmail.com"
    },
    bio: "Passionate Software & AI Engineer with hands-on experience building custom Vector Databases in C++, AI-powered resume screening systems leveraging Llama 3.3 70B & Groq, full-stack platforms with PostgreSQL & Prisma, and ensemble machine learning feature selection at NIT Jamshedpur."
  },

  education: [
    {
      institution: "Jalpaiguri Government Engineering College",
      degree: "Bachelor of Technology in Information Technology",
      period: "2023 – 2027",
      score: "CGPA: 8.11",
      details: "Key coursework in DBMS, Computer Networks, Object-Oriented Programming (OOP), and Operating Systems (OS)."
    },
    {
      institution: "Islampur High School",
      degree: "Higher Secondary Examination (12th)",
      period: "Completed",
      score: "Score: 88%",
      details: "Strong foundation in Mathematics and Sciences."
    }
  ],

  experience: [
    {
      role: "Summer Research Intern",
      organization: "National Institute of Technology Jamshedpur",
      department: "Department of Computer Science and Engineering",
      period: "Jun 2026 – Aug 2026",
      highlights: [
        "Completed a summer internship on Ensemble Feature Selection Techniques for ADHD Detection under the Department of Computer Science and Engineering.",
        "Worked on feature selection and machine learning techniques for identifying relevant features in ADHD detection datasets.",
        "Evaluated classification pipelines to maximize prediction accuracy and reduce dimensionality."
      ]
    }
  ],

  projects: [
    {
      id: "vectordb",
      title: "Own Vector Database",
      icon: "database",
      fileType: "C++ Application (.exe)",
      size: "4.2 MB",
      dateModified: "2026-03-15",
      github: "https://github.com",
      category: "Systems & AI Engine",
      summary: "Custom high-performance vector database built from scratch in C++ for storing and searching high-dimensional embeddings.",
      bullets: [
        "Built a vector database in C++ for storing and searching high-dimensional embedding vectors.",
        "Implemented vector similarity search using Euclidean distance, Manhattan distance, and Cosine Similarity with KNN-based retrieval.",
        "Implemented HNSW (Hierarchical Navigable Small World) based approximate nearest neighbor search.",
        "Integrated Ollama embedding models for converting arbitrary text into vector representations in real-time."
      ],
      techStack: ["C++", "HNSW", "KNN", "Ollama", "Embeddings", "Cosine Similarity", "Vector Math"]
    },
    {
      id: "resume-ai",
      title: "AI Resume Screening System",
      icon: "ai-doc",
      fileType: "Python/AI Application (.py)",
      size: "1.8 MB",
      dateModified: "2026-02-10",
      github: "https://github.com",
      category: "LLM & Generative AI",
      summary: "Intelligent recruitment screening pipeline leveraging Groq Llama 3.3 70B & Pydantic for structured resume intelligence.",
      bullets: [
        "Built an AI-powered system that extracts structured candidate information from PDF resumes and evaluates candidates against job descriptions.",
        "Integrated Groq's Llama 3.3 70B Versatile with Pydantic to structure resume and job-description data and generate candidate match scores.",
        "Implemented skill matching, missing-skill detection, experience evaluation, and automated candidate ranking for batch resume screening."
      ],
      techStack: ["Python", "Groq API", "Llama 3.3 70B", "Pydantic", "Prompt Engineering", "PDF Extraction"]
    },
    {
      id: "leetcode-platform",
      title: "LeetCode-Style Coding Platform",
      icon: "code",
      fileType: "Fullstack Web App (.js)",
      size: "8.6 MB",
      dateModified: "Ongoing",
      github: "https://github.com",
      category: "Full Stack Web System",
      summary: "Full-stack algorithmic problem solving platform with real-time code submission and automated grading.",
      bullets: [
        "Built a full-stack coding platform using Node.js, Express, PostgreSQL, and Prisma, allowing users to solve problems and submit solutions.",
        "Designed relational database schemas and high-throughput REST APIs for users, problems, test cases, submissions, and code evaluation workflows.",
        "Engineered secure code runner submission pipeline and test suite validation."
      ],
      techStack: ["Node.js", "Express", "PostgreSQL", "Prisma ORM", "REST APIs", "Docker"]
    },
    {
      id: "sih-bottleneck",
      title: "Smart India Hackathon (SIH) - Bottleneck",
      icon: "trophy",
      fileType: "Hackathon Project (.sln)",
      size: "5.1 MB",
      dateModified: "2025-11-20",
      github: "https://github.com",
      category: "Hackathon Award",
      summary: "Led Team 'Bottleneck' at Smart India Hackathon solving real-world technological challenges.",
      bullets: [
        "Served as Team Leader of Bottleneck in Smart India Hackathon (SIH).",
        "Orchestrated system architecture, sprint milestones, and team collaboration across frontend, backend, and AI modules.",
        "Pitched the final product prototype to judging panel."
      ],
      techStack: ["Team Leadership", "System Architecture", "Hackathon", "Problem Solving"]
    }
  ],

  skills: {
    languages: ["C/C++", "Python", "JavaScript", "SQL"],
    databases: ["MongoDB", "Mongoose", "MySQL", "PostgreSQL", "Prisma"],
    ai_llm: ["Groq API", "Llama 3.3 70B Versatile", "Pydantic", "Prompt Engineering", "Ollama", "Embeddings", "HNSW"],
    tools: ["Git", "GitHub", "Docker", "Postman", "Linux", "VS Code"],
    coursework: ["Database Management Systems (DBMS)", "Computer Networks", "Object-Oriented Programming (OOP)", "Operating Systems (OS)"],
    soft_skills: ["Problem Solving", "Analytical Thinking", "Team Collaboration", "Continuous Learning", "Team Leadership"]
  },

  achievements: [
    "Team Leader of Bottleneck in Smart India Hackathon (SIH).",
    "B.Tech Information Technology student at JGEC maintaining 8.11 CGPA.",
    "Summer Research Internship in CSE at NIT Jamshedpur on ADHD detection machine learning.",
    "Engineered custom Vector DB from scratch in modern C++ with HNSW indexing."
  ]
};

// Preset prompts for AI Assistant quick chips
const AI_PRESET_QUESTIONS = [
  "Who is Saikat Barai?",
  "Tell me about his C++ Vector Database",
  "How does the AI Resume Screener work?",
  "What was his research at NIT Jamshedpur?",
  "What is his full tech stack?",
  "How can I contact or hire Saikat?"
];
