/**
 * Saikat's Windows XP AI Assistant ("Search Companion / Rover")
 * Handles knowledge query processing, conversational responses, action triggers,
 * and retro typewriter animation effects.
 */

class XpAssistant {
  constructor() {
    this.history = [];
    this.isTyping = false;
    this.customApiKey = localStorage.getItem('saikat_xp_ai_key') || '';
    this.setupKnowledgeEngine();
  }

  setupKnowledgeEngine() {
    // Knowledge definitions for comprehensive responses
    this.knowledge = [
      {
        patterns: [/\b(who is|about|tell me about|introduce|bio|background|summary|profile|saikat)\b/i],
        reply: () => `**Saikat Barai** is an ambitious Software Engineer and AI enthusiast currently pursuing his Bachelor of Technology (B.Tech) in **Information Technology** at **Jalpaiguri Government Engineering College (JGEC)** (2023–2027) with an impressive **CGPA of 8.11**.\n\nHe has a strong foundation in systems programming and artificial intelligence. Notably, he has built an entire **high-dimensional Vector Database from scratch in C++** with HNSW indexing, an **AI Resume Screening System** powered by Groq's Llama 3.3 70B, and served as **Team Leader of Bottleneck in Smart India Hackathon (SIH)**. During Summer 2026, he completed a research internship at **NIT Jamshedpur** working on ensemble feature selection for ADHD detection.`,
        action: 'open_about'
      },
      {
        patterns: [/\b(vector\s*db|vector\s*database|hnsw|knn|c\+\+|embeddings|ollama)\b/i],
        reply: () => `### 🚀 Own Vector Database (Built in C++)\n\nSaikat engineered a high-performance vector database completely from scratch in modern **C++**:\n\n* **Storage & Indexing:** Stores and indexes high-dimensional embedding vectors for fast retrieval.\n* **Similarity Metrics:** Implemented Euclidean distance, Manhattan distance, and Cosine Similarity with **KNN-based retrieval**.\n* **HNSW Algorithm:** Implemented **Hierarchical Navigable Small World (HNSW)** graph indexing for lightning-fast approximate nearest neighbor (ANN) searches.\n* **Ollama Integration:** Integrated local Ollama embedding models to transform arbitrary textual queries into dense vector representations on the fly.\n\nWould you like me to open the **My Projects** folder to inspect the source files?`,
        action: 'open_projects'
      },
      {
        patterns: [/\b(resume\s*screen|ai\s*resume|screener|groq|llama|pydantic|hr|recruiting)\b/i],
        reply: () => `### 🤖 AI Resume Screening System\n\nSaikat developed an enterprise-grade AI candidate evaluation pipeline:\n\n* **PDF Extraction & Structure:** Automatically parses unstructured resumes in PDF format into structured schemas using **Pydantic**.\n* **LLM Intelligence:** Powered by **Groq's Llama 3.3 70B Versatile** to evaluate candidate suitability against complex job descriptions in milliseconds.\n* **Automated Scoring:** Computes deep semantic match scores, highlights missing skills, audits work experience, and automatically ranks candidate pools for batch recruitment.`,
        action: 'open_projects'
      },
      {
        patterns: [/\b(leetcode|coding platform|node|express|postgres|prisma|fullstack)\b/i],
        reply: () => `### 💻 LeetCode-Style Coding Platform\n\nSaikat is actively building a robust full-stack algorithmic challenge platform:\n\n* **Tech Stack:** Node.js, Express.js, PostgreSQL, and Prisma ORM.\n* **Core Capabilities:** Real-time problem browsing, code editor integration, testcase runners, and automated grading pipelines.\n* **Architecture:** Designed normalized relational schemas and high-throughput REST APIs handling user authentication, submission queues, and problem catalogs.`,
        action: 'open_projects'
      },
      {
        patterns: [/\b(nit|jamshedpur|intern|internship|adhd|research|feature selection)\b/i],
        reply: () => `### 🔬 Summer Research Internship @ NIT Jamshedpur\n\n* **Role:** Summer Research Intern (Jun 2026 – Aug 2026)\n* **Department:** Department of Computer Science & Engineering, National Institute of Technology Jamshedpur\n* **Research Focus:** *Ensemble Feature Selection Techniques for ADHD Detection*.\n* **Contribution:** Investigated dimensionality reduction and machine learning ensemble methods to isolate biomarker features in high-dimensional ADHD clinical datasets, improving classification sensitivity and accuracy.`,
        action: 'open_experience'
      },
      {
        patterns: [/\b(education|college|school|jgec|islampur|cgpa|marks|degree)\b/i],
        reply: () => `### 🎓 Academic Education\n\n1. **Jalpaiguri Government Engineering College (JGEC)**\n   * Degree: Bachelor of Technology (B.Tech) in Information Technology\n   * Duration: 2023 – 2027\n   * **CGPA: 8.11 / 10**\n   * Coursework: Database Management Systems (DBMS), Operating Systems (OS), Object-Oriented Programming (OOP), Computer Networks.\n\n2. **Islampur High School**\n   * Higher Secondary (12th Examination)\n   * Score: **88%**`,
        action: 'open_system'
      },
      {
        patterns: [/\b(skills|tech stack|technologies|languages|database|tools|frameworks)\b/i],
        reply: () => `### 🛠️ Saikat's Technical Arsenal\n\n* **Programming Languages:** C / C++, Python, JavaScript, SQL\n* **Databases & ORMs:** PostgreSQL, MongoDB, Mongoose, MySQL, Prisma\n* **AI & LLM:** Groq API, Llama 3.3 70B, Ollama, Pydantic, Prompt Engineering, Vector Search, HNSW\n* **Developer Tools:** Git, GitHub, Docker, Postman, Linux / Bash, VS Code\n* **Core CS Fundamentals:** DBMS, Operating Systems, Computer Networks, OOP, Data Structures & Algorithms`,
        action: 'open_skills'
      },
      {
        patterns: [/\b(hackathon|sih|smart india|bottleneck|leader|leadership|achievement)\b/i],
        reply: () => `### 🏆 Hackathon & Achievements\n\n* **Smart India Hackathon (SIH):** Served as the **Team Leader of team 'Bottleneck'**, spearheading development, task delegation, and technical presentation to the jury.\n* **Academic Excellence:** Maintained **8.11 CGPA** in Information Technology at JGEC.\n* **Competitive Systems Engineering:** Built a functional C++ vector database and production-ready LLM pipelines.\n* **Soft Skills:** Outstanding problem-solving aptitude, analytical thinking, continuous learner, and inspiring team collaborator.`,
        action: 'open_projects'
      },
      {
        patterns: [/\b(contact|email|phone|hire|reach|linkedin|github|interview|call)\b/i],
        reply: () => `### 📬 Get In Touch with Saikat\n\nSaikat is actively looking for **Software Engineering & AI Engineering opportunities**:\n\n* 📧 **Email:** [brucewyane699@gmail.com](mailto:brucewyane699@gmail.com)\n* 📞 **Phone:** [+91-8597277733](tel:+918597277733)\n* 🐙 **GitHub:** [github.com/saikat-barai](https://github.com)\n* 💼 **LinkedIn:** [linkedin.com/in/saikat-barai](https://linkedin.com)\n* ⚡ **LeetCode:** [leetcode.com/saikat-barai](https://leetcode.com)\n\nYou can also click the **Resume** shortcut on the desktop or use the Contact icon in the Start Menu!`,
        action: 'open_contact'
      },
      {
        patterns: [/\b(projects?|what did he make|portfolio|built|creations)\b/i],
        reply: () => `### 📁 Key Projects Overview\n\n1. **Own Vector Database (C++):** High-dimensional vector database from scratch with HNSW & KNN indexing and Ollama model embeddings.\n2. **AI Resume Screening System (Python & Groq):** LLM-based recruiter engine using Llama 3.3 70B and Pydantic for structured match scoring.\n3. **LeetCode-Style Platform (Node.js & Postgres):** Full-stack problem solving platform with testcase execution.\n4. **Smart India Hackathon:** Team Leader of 'Bottleneck' creating impactful tech solutions.\n\nOpening the **My Projects** folder for you right now!`,
        action: 'open_projects'
      },
      {
        patterns: [/\b(hi|hello|hey|greetings|hola|good morning|good evening)\b/i],
        reply: () => `Hello there! I'm **Rover**, Saikat Barai's vintage Windows XP AI Assistant! 🐕💾\n\nI can tell you everything about Saikat's background, his C++ Vector Database, AI resume screening engine, NIT Jamshedpur research, and how to hire him. How can I help you today?`,
        action: null
      },
      {
        patterns: [/\b(xp|windows|nostalgia|clippy|rover|retro|easter egg)\b/i],
        reply: () => `Welcome to the Windows XP experience! 🪟 In 2001, computing felt magical with the rolling green hills of Bliss, Luna Blue taskbars, and playful companions like me! Feel free to open My Computer, play Minesweeper, launch CMD, or explore Saikat's projects folder!`,
        action: null
      }
    ];
  }

  ask(query) {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // Check knowledge matches
    for (const item of this.knowledge) {
      for (const pattern of item.patterns) {
        if (pattern.test(q)) {
          return {
            text: item.reply(),
            action: item.action
          };
        }
      }
    }

    // Default intelligent fallback synthesis
    return {
      text: `That's a great question about Saikat! While I'm focused on his core credentials, here is what is most relevant:\n\nSaikat Barai is an Information Technology engineer from **Jalpaiguri Government Engineering College (8.11 CGPA)** specializing in **C++ systems (Vector Database with HNSW)**, **AI/LLM pipelines (Groq Llama 3.3 70B & Pydantic)**, and fullstack platforms (PostgreSQL & Node.js). He was also **Team Leader at Smart India Hackathon** and interned at **NIT Jamshedpur**.\n\nTry clicking one of the suggested buttons below to learn about specific projects or his contact details!`,
      action: null
    };
  }
}

window.xpAssistant = new XpAssistant();
