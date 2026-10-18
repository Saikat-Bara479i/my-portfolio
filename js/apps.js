/**
 * Windows XP Built-in Portfolio Applications
 * Includes Explorer (Projects Folder), AI Assistant Companion,
 * WordPad Resume, System Properties, CMD Terminal, and Minesweeper.
 */

class XpApps {
  constructor() {
    this.selectedProject = null;
    this.currentViewMode = 'icons'; // 'icons' or 'details'
  }

  init() {
    this.initProjectsFolder();
    this.initAssistantApp();
    this.initResumeApp();
    this.initSystemProperties();
    this.initCmdApp();
    this.initMinesweeper();
    this.initContactApp();
  }

  /* -------------------------------------------------------------
   * 1. MY PROJECTS EXPLORER
   * ------------------------------------------------------------- */
  initProjectsFolder() {
    const container = document.getElementById('projects-explorer-content');
    if (!container) return;

    this.renderProjects(container);

    // Explorer view buttons
    const viewButtons = document.querySelectorAll('.explorer-view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.view || 'icons';
        this.currentViewMode = mode;
        container.className = `explorer-content view-${mode}`;
      });
    });
  }

  renderProjects(container) {
    container.innerHTML = '';
    const projects = SAIKAT_DATA.projects;

    if (this.currentViewMode === 'details') {
      const table = document.createElement('table');
      table.className = 'explorer-details-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th width="40%">Name</th>
            <th width="20%">Type</th>
            <th width="15%">Size</th>
            <th width="25%">Date Modified</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector('tbody');

      projects.forEach(p => {
        const tr = document.createElement('tr');
        tr.className = 'explorer-row';
        tr.innerHTML = `
          <td><span class="file-icon icon-${p.icon}"></span> <span class="file-name">${p.title}</span></td>
          <td>${p.fileType}</td>
          <td>${p.size}</td>
          <td>${p.dateModified}</td>
        `;
        tr.addEventListener('click', () => this.selectProject(p, tr));
        tr.addEventListener('dblclick', () => this.openProjectInspector(p));
        tbody.appendChild(tr);
      });
      container.appendChild(table);
    } else {
      // Icons view
      projects.forEach(p => {
        const item = document.createElement('div');
        item.className = 'explorer-file-item';
        item.innerHTML = `
          <div class="file-icon-large icon-${p.icon}"></div>
          <div class="file-label">${p.title}</div>
        `;
        item.addEventListener('click', () => this.selectProject(p, item));
        item.addEventListener('dblclick', () => this.openProjectInspector(p));
        container.appendChild(item);
      });
    }

    // Default selection
    if (projects.length > 0) {
      this.updateFolderDetails(projects[0]);
    }
  }

  selectProject(project, element) {
    this.selectedProject = project;
    document.querySelectorAll('.explorer-file-item, .explorer-row').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    this.updateFolderDetails(project);
    window.xpAudio?.playClick();
  }

  updateFolderDetails(project) {
    const detailsContainer = document.getElementById('explorer-sidebar-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
      <div class="sidebar-project-header">
        <span class="file-icon icon-${project.icon}"></span>
        <strong>${project.title}</strong>
      </div>
      <p class="sidebar-project-category">${project.category}</p>
      <p class="sidebar-project-desc">${project.summary}</p>
      <div class="sidebar-tech-tags">
        ${project.techStack.map(t => `<span class="tag-badge">${t}</span>`).join('')}
      </div>
      <button class="xp-btn xp-btn-primary mt-2" onclick="xpApps.openProjectInspectorById('${project.id}')">
        🚀 Run / Inspect Project
      </button>
    `;
  }

  openProjectInspectorById(id) {
    const project = SAIKAT_DATA.projects.find(p => p.id === id);
    if (project) this.openProjectInspector(project);
  }

  openProjectInspector(project) {
    const win = document.getElementById('window-project-details');
    if (!win) return;

    document.getElementById('project-detail-title').innerText = `${project.title} - Details`;
    document.getElementById('project-detail-content').innerHTML = `
      <div class="project-modal-header">
        <div class="file-icon-xl icon-${project.icon}"></div>
        <div class="project-modal-heading">
          <h2>${project.title}</h2>
          <span class="badge-category">${project.category}</span>
          <p class="project-subtitle">${project.summary}</p>
        </div>
      </div>

      <fieldset class="xp-fieldset">
        <legend>Key Technical Highlights & Implementation</legend>
        <ul class="xp-bullet-list">
          ${project.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </fieldset>

      <fieldset class="xp-fieldset">
        <legend>Technology Stack & Algorithms</legend>
        <div class="tech-pills-row">
          ${project.techStack.map(t => `<span class="xp-pill">${t}</span>`).join('')}
        </div>
      </fieldset>

      <div class="project-actions-row">
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="xp-btn xp-btn-action">
          🐙 View GitHub Repository
        </a>
        <button class="xp-btn" onclick="xpAssistant.ask('tell me about ${project.title}'); windowManager.open('window-assistant');">
          💬 Ask AI Companion About This
        </button>
      </div>
    `;

    windowManager.open('window-project-details');
  }

  /* -------------------------------------------------------------
   * 2. AI ASSISTANT SEARCH COMPANION
   * ------------------------------------------------------------- */
  initAssistantApp() {
    const chatContainer = document.getElementById('assistant-chat-messages');
    const input = document.getElementById('assistant-user-input');
    const sendBtn = document.getElementById('assistant-send-btn');
    const chipsContainer = document.getElementById('assistant-preset-chips');

    if (!chatContainer || !input) return;

    // Render quick prompt suggestion chips
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      AI_PRESET_QUESTIONS.forEach(q => {
        const chip = document.createElement('button');
        chip.className = 'preset-chip-btn';
        chip.innerText = q;
        chip.addEventListener('click', () => {
          input.value = q;
          this.handleAssistantSubmit();
        });
        chipsContainer.appendChild(chip);
      });
    }

    const onSubmit = () => this.handleAssistantSubmit();

    if (sendBtn) sendBtn.addEventListener('click', onSubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    });

    // Floating assistant mascot click opens assistant window
    const roverWidget = document.getElementById('xp-rover-widget');
    if (roverWidget) {
      roverWidget.addEventListener('click', () => {
        windowManager.open('window-assistant');
        window.xpAudio?.playDing();
      });
    }
  }

  handleAssistantSubmit() {
    const input = document.getElementById('assistant-user-input');
    const q = input.value.trim();
    if (!q) return;

    input.value = '';
    this.addChatMessage('user', q);

    // Set Rover mascot state to thinking
    this.setRoverState('thinking');
    window.xpAudio?.playClick();

    setTimeout(() => {
      const response = xpAssistant.ask(q);
      if (response) {
        this.addChatMessage('bot', response.text, () => {
          this.setRoverState('happy');
          window.xpAudio?.playDing();

          // Handle action triggers (e.g. automatically opening windows!)
          if (response.action) {
            this.handleActionTrigger(response.action);
          }
        });
      }
    }, 400);
  }

  handleActionTrigger(action) {
    setTimeout(() => {
      switch (action) {
        case 'open_projects':
          windowManager.open('window-projects');
          break;
        case 'open_resume':
          windowManager.open('window-resume');
          break;
        case 'open_system':
          windowManager.open('window-system');
          break;
        case 'open_skills':
          windowManager.open('window-system');
          // Switch to skills tab
          document.querySelector('[data-tab="tab-skills"]')?.click();
          break;
        case 'open_experience':
          windowManager.open('window-system');
          document.querySelector('[data-tab="tab-experience"]')?.click();
          break;
        case 'open_contact':
          windowManager.open('window-contact');
          break;
      }
    }, 600);
  }

  addChatMessage(sender, text, onComplete) {
    const chat = document.getElementById('assistant-chat-messages');
    if (!chat) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-message msg-${sender}`;

    if (sender === 'user') {
      msgEl.innerHTML = `
        <div class="msg-bubble">${this.escapeHtml(text)}</div>
      `;
      chat.appendChild(msgEl);
      chat.scrollTop = chat.scrollHeight;
      if (onComplete) onComplete();
    } else {
      // Stream bot message like vintage typewriter
      msgEl.innerHTML = `
        <div class="msg-sender"><span class="rover-avatar-small"></span> Rover (AI Assistant)</div>
        <div class="msg-bubble markdown-body"></div>
      `;
      chat.appendChild(msgEl);
      chat.scrollTop = chat.scrollHeight;

      const bubble = msgEl.querySelector('.msg-bubble');
      this.streamTypewriter(bubble, text, chat, onComplete);
    }
  }

  streamTypewriter(targetEl, fullMarkdown, scrollContainer, onComplete) {
    // Convert markdown basics into formatted HTML
    const formattedHtml = this.parseSimpleMarkdown(fullMarkdown);
    
    // Smooth reveal
    let currentIdx = 0;
    const step = 4;
    const interval = setInterval(() => {
      currentIdx += step;
      if (currentIdx >= formattedHtml.length) {
        targetEl.innerHTML = formattedHtml;
        clearInterval(interval);
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        if (onComplete) onComplete();
      } else {
        targetEl.innerHTML = formattedHtml.slice(0, currentIdx) + '<span class="xp-cursor"></span>';
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 12);
  }

  parseSimpleMarkdown(md) {
    let html = md
      .replace(/### (.*?)\n/g, '<h4 class="md-h4">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="xp-link">$1</a>')
      .replace(/\n\* (.*?)(?=\n|$)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul class="md-list">$1</ul>')
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br/>');
    return html;
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  setRoverState(state) {
    const roverEls = document.querySelectorAll('.rover-mascot');
    roverEls.forEach(el => {
      el.className = `rover-mascot state-${state}`;
    });
  }

  /* -------------------------------------------------------------
   * 3. WORDPAD RESUME VIEWER
   * ------------------------------------------------------------- */
  initResumeApp() {
    const content = document.getElementById('wordpad-resume-content');
    if (!content) return;

    const { profile, education, experience, projects, skills, achievements } = SAIKAT_DATA;

    content.innerHTML = `
      <div class="wordpad-page">
        <div class="resume-header text-center">
          <h1 class="resume-name">${profile.name}</h1>
          <div class="resume-contact-bar">
            <span>📞 ${profile.phone}</span> • 
            <span>📧 <a href="mailto:${profile.email}">${profile.email}</a></span> • 
            <span>🐙 <a href="${profile.socials.github}" target="_blank">GitHub</a></span> • 
            <span>💼 <a href="${profile.socials.linkedin}" target="_blank">LinkedIn</a></span> • 
            <span>⚡ <a href="${profile.socials.leetcode}" target="_blank">LeetCode</a></span>
          </div>
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">EDUCATION</h2>
          ${education.map(e => `
            <div class="resume-entry">
              <div class="entry-header">
                <strong>${e.institution}</strong>
                <span class="entry-date">${e.period}</span>
              </div>
              <div class="entry-sub">
                <span>${e.degree}</span>
                <span class="entry-score"><strong>${e.score}</strong></span>
              </div>
              <p class="entry-desc">${e.details}</p>
            </div>
          `).join('')}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">TECHNICAL SKILLS</h2>
          <table class="resume-skills-table">
            <tr>
              <td width="25%"><strong>Languages:</strong></td>
              <td>${skills.languages.join(', ')}</td>
            </tr>
            <tr>
              <td><strong>Database:</strong></td>
              <td>${skills.databases.join(', ')}</td>
            </tr>
            <tr>
              <td><strong>AI / LLM:</strong></td>
              <td>${skills.ai_llm.join(', ')}</td>
            </tr>
            <tr>
              <td><strong>Tools:</strong></td>
              <td>${skills.tools.join(', ')}</td>
            </tr>
            <tr>
              <td><strong>Coursework:</strong></td>
              <td>${skills.coursework.join(', ')}</td>
            </tr>
          </table>
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">EXPERIENCE</h2>
          ${experience.map(exp => `
            <div class="resume-entry">
              <div class="entry-header">
                <strong>${exp.role} – ${exp.organization}</strong>
                <span class="entry-date">${exp.period}</span>
              </div>
              <div class="entry-sub">
                <em>${exp.department}</em>
              </div>
              <ul class="resume-bullets">
                ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">PROJECTS</h2>
          ${projects.map(p => `
            <div class="resume-entry">
              <div class="entry-header">
                <strong>${p.title}</strong>
                <a href="${p.github}" target="_blank" class="entry-link">GitHub</a>
              </div>
              <ul class="resume-bullets">
                ${p.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">ACHIEVEMENTS</h2>
          <ul class="resume-bullets">
            ${achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="resume-section">
          <h2 class="resume-sec-title">SOFT SKILLS</h2>
          <p class="soft-skills-line">${skills.soft_skills.join('  •  ')}</p>
        </div>
      </div>
    `;

    // WordPad print / export button
    const printBtn = document.getElementById('wordpad-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* -------------------------------------------------------------
   * 4. SYSTEM PROPERTIES
   * ------------------------------------------------------------- */
  initSystemProperties() {
    // Tabs switching
    const tabs = document.querySelectorAll('.xp-tab-header');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.xp-tab-page').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPage = document.getElementById(tab.dataset.tab);
        if (targetPage) targetPage.classList.add('active');
        window.xpAudio?.playClick();
      });
    });
  }

  /* -------------------------------------------------------------
   * 5. COMMAND PROMPT (CMD.EXE)
   * ------------------------------------------------------------- */
  initCmdApp() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('cmd-output');
    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        input.value = '';
        this.executeCmd(val, output);
      }
    });

    const cmdBody = document.getElementById('window-cmd');
    if (cmdBody) {
      cmdBody.addEventListener('click', () => input.focus());
    }
  }

  executeCmd(cmdLine, output) {
    const p = document.createElement('div');
    p.className = 'cmd-line-entry';
    p.innerHTML = `<span class="cmd-prompt">C:\\Documents and Settings\\Saikat&gt;</span> ${this.escapeHtml(cmdLine)}`;
    output.appendChild(p);

    const parts = cmdLine.toLowerCase().split(' ');
    const command = parts[0];

    const res = document.createElement('div');
    res.className = 'cmd-response';

    switch (command) {
      case 'help':
        res.innerHTML = `
Supported commands:
  ABOUT       Displays Saikat Barai's profile
  PROJECTS    Lists all engineering projects
  SKILLS      Lists programming languages, databases & AI stacks
  EXPERIENCE  Shows NIT Jamshedpur research information
  CONTACT     Displays email, phone and social profiles
  ROVER &lt;q&gt;  Ask the AI Assistant directly from terminal
  MATRIX      Toggle retro matrix rain in console
  CLS         Clear the screen
  COLOR       Change terminal text color (e.g., color 0a)
  VER         Print Windows XP OS version
  CRASH       Triggers Blue Screen of Death (BSOD) Easter egg!
  EXIT        Close command prompt`;
        break;

      case 'about':
        res.innerHTML = `
Saikat Barai | Software & AI Engineer
B.Tech in Information Technology @ Jalpaiguri Government Engineering College (CGPA: 8.11)
Specializing in C++ Vector Databases, Groq LLM pipelines, and Full-Stack development.`;
        break;

      case 'projects':
        res.innerHTML = `
[1] Own Vector Database (C++, HNSW, KNN, Ollama Embeddings)
[2] AI Resume Screening System (Groq, Llama 3.3 70B, Pydantic)
[3] LeetCode-Style Coding Platform (Node.js, Express, PostgreSQL, Prisma)
[4] Smart India Hackathon (Team Leader of Bottleneck)
Type 'start projects' or open the desktop folder for full inspection.`;
        break;

      case 'skills':
        res.innerHTML = `
Languages:   ${SAIKAT_DATA.skills.languages.join(', ')}
Databases:   ${SAIKAT_DATA.skills.databases.join(', ')}
AI / LLM:    ${SAIKAT_DATA.skills.ai_llm.join(', ')}
Tools:       ${SAIKAT_DATA.skills.tools.join(', ')}
Coursework:  ${SAIKAT_DATA.skills.coursework.join(', ')}`;
        break;

      case 'contact':
        res.innerHTML = `
Email:     ${SAIKAT_DATA.profile.email}
Phone:     ${SAIKAT_DATA.profile.phone}
GitHub:    ${SAIKAT_DATA.profile.socials.github}
LinkedIn:  ${SAIKAT_DATA.profile.socials.linkedin}
LeetCode:  ${SAIKAT_DATA.profile.socials.leetcode}`;
        break;

      case 'cls':
      case 'clear':
        output.innerHTML = '';
        return;

      case 'ver':
        res.innerText = 'Microsoft Windows XP [Version 5.1.2600] Service Pack 3';
        break;

      case 'crash':
      case 'bsod':
        this.triggerBsod();
        return;

      case 'rover':
      case 'ask':
        const query = parts.slice(1).join(' ');
        if (!query) {
          res.innerText = 'Usage: rover <question about Saikat>';
        } else {
          const aiRes = xpAssistant.ask(query);
          res.innerHTML = this.parseSimpleMarkdown(aiRes.text);
          if (aiRes.action) this.handleActionTrigger(aiRes.action);
        }
        break;

      case 'matrix':
        res.innerHTML = `<span style="color:#00ff66;">Initializing Matrix mode... Welcome to the real world, Neo.</span>`;
        output.classList.toggle('matrix-mode');
        break;

      case 'exit':
        windowManager.close('window-cmd');
        return;

      case '':
        break;

      default:
        res.innerText = `'${command}' is not recognized as an internal or external command, operable program or batch file. Type 'help' for assistance.`;
    }

    if (cmdLine.trim() !== '') {
      output.appendChild(res);
    }

    const termWindow = document.getElementById('cmd-scroll-area');
    if (termWindow) {
      termWindow.scrollTop = termWindow.scrollHeight;
    }
  }

  triggerBsod() {
    window.xpAudio?.playError();
    const bsod = document.getElementById('xp-bsod-screen');
    if (bsod) {
      bsod.classList.remove('hidden');
      const onKey = () => {
        bsod.classList.add('hidden');
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('click', onKey);
      };
      window.addEventListener('keydown', onKey);
      window.addEventListener('click', onKey);
    }
  }

  /* -------------------------------------------------------------
   * 6. MINESWEEPER
   * ------------------------------------------------------------- */
  initMinesweeper() {
    const board = document.getElementById('minesweeper-board');
    const face = document.getElementById('minesweeper-face');
    const mineCountEl = document.getElementById('minesweeper-mines');
    const timerEl = document.getElementById('minesweeper-timer');
    if (!board || !face) return;

    const rows = 9;
    const cols = 9;
    const mines = 10;
    let grid = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;
    let gameWon = false;
    let timer = 0;
    let timerInterval = null;
    let firstClick = true;

    const resetGame = () => {
      clearInterval(timerInterval);
      timer = 0;
      timerInterval = null;
      firstClick = true;
      gameOver = false;
      gameWon = false;
      timerEl.innerText = '000';
      mineCountEl.innerText = '010';
      face.className = 'ms-face face-smile';
      grid = Array(rows).fill(null).map(() => Array(cols).fill(0));
      revealed = Array(rows).fill(null).map(() => Array(cols).fill(false));
      flagged = Array(rows).fill(null).map(() => Array(cols).fill(false));
      renderBoard();
    };

    const plantMines = (safeR, safeC) => {
      let placed = 0;
      while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (grid[r][c] !== -1 && !(r === safeR && c === safeC)) {
          grid[r][c] = -1;
          placed++;
        }
      }

      // Compute adjacent numbers
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === -1) continue;
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === -1) {
                count++;
              }
            }
          }
          grid[r][c] = count;
        }
      }
    };

    const renderBoard = () => {
      board.innerHTML = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.className = 'ms-cell';
          cell.dataset.r = r;
          cell.dataset.c = c;

          if (revealed[r][c]) {
            cell.classList.add('revealed');
            const val = grid[r][c];
            if (val === -1) {
              cell.classList.add('mine');
              cell.innerHTML = '💣';
            } else if (val > 0) {
              cell.classList.add(`c-${val}`);
              cell.innerText = val;
            }
          } else if (flagged[r][c]) {
            cell.classList.add('flagged');
            cell.innerHTML = '🚩';
          }

          cell.addEventListener('mousedown', (e) => {
            if (gameOver || gameWon) return;
            if (e.button === 0 && !flagged[r][c]) {
              face.className = 'ms-face face-worried';
            }
          });

          cell.addEventListener('mouseup', () => {
            if (!gameOver && !gameWon) face.className = 'ms-face face-smile';
          });

          cell.addEventListener('click', () => {
            if (gameOver || gameWon || flagged[r][c]) return;
            if (firstClick) {
              firstClick = false;
              plantMines(r, c);
              timerInterval = setInterval(() => {
                timer = Math.min(999, timer + 1);
                timerEl.innerText = String(timer).padStart(3, '0');
              }, 1000);
            }
            reveal(r, c);
            renderBoard();
          });

          cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (gameOver || gameWon || revealed[r][c]) return;
            flagged[r][c] = !flagged[r][c];
            const flagsLeft = mines - flagged.flat().filter(Boolean).length;
            mineCountEl.innerText = String(flagsLeft).padStart(3, '0');
            renderBoard();
          });

          board.appendChild(cell);
        }
      }
    };

    const reveal = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || revealed[r][c] || flagged[r][c]) return;
      revealed[r][c] = true;

      if (grid[r][c] === -1) {
        // Boom!
        gameOver = true;
        clearInterval(timerInterval);
        face.className = 'ms-face face-dead';
        window.xpAudio?.playError();
        // Reveal all mines
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (grid[i][j] === -1) revealed[i][j] = true;
          }
        }
        return;
      }

      window.xpAudio?.playClick();

      if (grid[r][c] === 0) {
        // Flood fill empty
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }

      // Check win condition
      checkWin();
    };

    const checkWin = () => {
      let unrevealedSafe = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] !== -1 && !revealed[r][c]) unrevealedSafe++;
        }
      }

      if (unrevealedSafe === 0) {
        gameWon = true;
        clearInterval(timerInterval);
        face.className = 'ms-face face-cool';
        window.xpAudio?.playStartup();
      }
    };

    face.addEventListener('click', resetGame);
    resetGame();
  }

  /* -------------------------------------------------------------
   * 7. CONTACT & MESSAGE DIALOG
   * ------------------------------------------------------------- */
  initContactApp() {
    const form = document.getElementById('xp-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      const mailtoUrl = `mailto:${SAIKAT_DATA.profile.email}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(name)}%20(${encodeURIComponent(email)})`;
      
      window.location.href = mailtoUrl;

      const status = document.getElementById('contact-status-msg');
      if (status) {
        status.innerHTML = `<span style="color:green;">✓ Opening your email client to message Saikat Barai!</span>`;
      }
      window.xpAudio?.playBalloon();
    });
  }
}

window.xpApps = new XpApps();
