/**
 * Main Windows XP Shell Controller
 * Manages Desktop, Start Menu, System Tray, Selection Marquee,
 * Sounds, Boot Sequence, and Turn Off Computer modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Applications
  window.xpApps.init();

  // Register all primary windows with WindowManager
  windowManager.registerWindow('window-projects', { title: 'My Projects', icon: 'folder' });
  windowManager.registerWindow('window-project-details', { title: 'Project Properties', icon: 'file' });
  windowManager.registerWindow('window-assistant', { title: 'Search Companion - Saikat AI Assistant', icon: 'rover' });
  windowManager.registerWindow('window-resume', { title: 'Saikat_Barai_Resume.doc - WordPad', icon: 'wordpad' });
  windowManager.registerWindow('window-system', { title: 'System Properties', icon: 'system' });
  windowManager.registerWindow('window-cmd', { title: 'Command Prompt - cmd.exe', icon: 'cmd' });
  windowManager.registerWindow('window-minesweeper', { title: 'Minesweeper', icon: 'mine' });
  windowManager.registerWindow('window-contact', { title: 'Send Message to Saikat Barai', icon: 'mail' });

  initDesktopIcons();
  initStartMenu();
  initSystemTray();
  initDesktopSelectionMarquee();
  initTurnOffModal();
  initBootSequence();
});

/* -------------------------------------------------------------
 * Desktop Icons Interaction (Single click select, Dblclick open)
 * ------------------------------------------------------------- */
function initDesktopIcons() {
  const desktop = document.getElementById('xp-desktop');
  const icons = document.querySelectorAll('.desktop-icon');

  icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      window.xpAudio?.playClick();
    });

    icon.addEventListener('dblclick', () => {
      const targetWin = icon.dataset.window;
      const targetUrl = icon.dataset.url;

      if (targetWin) {
        windowManager.open(targetWin);
      } else if (targetUrl) {
        window.open(targetUrl, '_blank');
      }
    });
  });

  // Clicking empty desktop clears icon selections and closes start menu
  desktop.addEventListener('click', (e) => {
    if (e.target === desktop || e.target.id === 'desktop-icons-container') {
      icons.forEach(i => i.classList.remove('selected'));
      closeStartMenu();
    }
  });
}

/* -------------------------------------------------------------
 * Start Menu
 * ------------------------------------------------------------- */
function initStartMenu() {
  const startBtn = document.getElementById('xp-start-button');
  const startMenu = document.getElementById('xp-start-menu');

  if (!startBtn || !startMenu) return;

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.xpAudio?.playClick();
    toggleStartMenu();
  });

  // Start menu items
  const menuItems = startMenu.querySelectorAll('[data-action]');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const url = item.dataset.url;
      closeStartMenu();

      if (action.startsWith('open:')) {
        const winId = action.replace('open:', '');
        windowManager.open(winId);
      } else if (action === 'turnoff') {
        openTurnOffModal();
      } else if (url) {
        window.open(url, '_blank');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
      closeStartMenu();
    }
  });
}

function toggleStartMenu() {
  const startBtn = document.getElementById('xp-start-button');
  const startMenu = document.getElementById('xp-start-menu');
  if (startMenu.classList.contains('hidden')) {
    startMenu.classList.remove('hidden');
    startBtn.classList.add('active');
  } else {
    closeStartMenu();
  }
}

function closeStartMenu() {
  const startBtn = document.getElementById('xp-start-button');
  const startMenu = document.getElementById('xp-start-menu');
  if (startMenu) startMenu.classList.add('hidden');
  if (startBtn) startBtn.classList.remove('active');
}

/* -------------------------------------------------------------
 * System Tray & Clock
 * ------------------------------------------------------------- */
function initSystemTray() {
  const clockEl = document.getElementById('tray-clock');
  const soundToggle = document.getElementById('tray-sound-toggle');
  const crtToggle = document.getElementById('tray-crt-toggle');

  // Realtime clock
  const updateClock = () => {
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    clockEl.innerText = `${hours}:${minutes} ${ampm}`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // Sound toggle in tray
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const enabled = window.xpAudio?.toggleSound();
      soundToggle.classList.toggle('muted', !enabled);
      soundToggle.title = enabled ? 'Sound: Enabled' : 'Sound: Muted';
    });
  }

  // Retro CRT Scanlines toggle
  if (crtToggle) {
    crtToggle.addEventListener('click', () => {
      document.body.classList.toggle('crt-filter-active');
      crtToggle.classList.toggle('active');
      window.xpAudio?.playClick();
    });
  }
}

/* -------------------------------------------------------------
 * Desktop Selection Marquee (Blue translucent dragging box)
 * ------------------------------------------------------------- */
function initDesktopSelectionMarquee() {
  const desktop = document.getElementById('xp-desktop');
  const marquee = document.getElementById('xp-selection-marquee');
  if (!desktop || !marquee) return;

  let isSelecting = false;
  let startX = 0, startY = 0;

  desktop.addEventListener('mousedown', (e) => {
    // Only drag marquee if clicking directly on desktop background
    if (e.target !== desktop && e.target.id !== 'desktop-icons-container') return;
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;

    marquee.style.left = `${startX}px`;
    marquee.style.top = `${startY}px`;
    marquee.style.width = '0px';
    marquee.style.height = '0px';
    marquee.classList.remove('hidden');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;
    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    marquee.style.left = `${left}px`;
    marquee.style.top = `${top}px`;
    marquee.style.width = `${width}px`;
    marquee.style.height = `${height}px`;

    // Highlight overlapping desktop icons
    const marqueeRect = { left, top, right: left + width, bottom: top + height };
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      const rect = icon.getBoundingClientRect();
      const overlap = !(rect.right < marqueeRect.left || 
                        rect.left > marqueeRect.right || 
                        rect.bottom < marqueeRect.top || 
                        rect.top > marqueeRect.bottom);
      icon.classList.toggle('selected', overlap);
    });
  });

  window.addEventListener('mouseup', () => {
    if (isSelecting) {
      isSelecting = false;
      marquee.classList.add('hidden');
    }
  });
}

/* -------------------------------------------------------------
 * Turn Off Computer Modal
 * ------------------------------------------------------------- */
function initTurnOffModal() {
  const modal = document.getElementById('xp-turnoff-modal');
  const btnCancel = document.getElementById('turnoff-cancel-btn');
  const btnShutdown = document.getElementById('turnoff-shutdown-btn');
  const btnRestart = document.getElementById('turnoff-restart-btn');
  const btnStandby = document.getElementById('turnoff-standby-btn');

  if (!modal) return;

  if (btnCancel) {
    btnCancel.addEventListener('click', closeTurnOffModal);
  }

  if (btnShutdown) {
    btnShutdown.addEventListener('click', () => {
      window.xpAudio?.playShutdown();
      modal.classList.add('hidden');
      document.body.classList.add('screen-shutdown');
      setTimeout(() => {
        const shutdownScreen = document.getElementById('xp-shutdown-screen');
        if (shutdownScreen) {
          shutdownScreen.classList.remove('hidden');
        }
      }, 1200);
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      window.xpAudio?.playShutdown();
      modal.classList.add('hidden');
      document.body.classList.add('screen-shutdown');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

  if (btnStandby) {
    btnStandby.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.classList.add('screen-standby');
      const wakeUp = () => {
        document.body.classList.remove('screen-standby');
        window.removeEventListener('keydown', wakeUp);
        window.removeEventListener('click', wakeUp);
      };
      setTimeout(() => {
        window.addEventListener('keydown', wakeUp);
        window.addEventListener('click', wakeUp);
      }, 500);
    });
  }
}

function openTurnOffModal() {
  window.xpAudio?.playDing();
  const modal = document.getElementById('xp-turnoff-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('screen-dimmed');
  }
}

function closeTurnOffModal() {
  const modal = document.getElementById('xp-turnoff-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('screen-dimmed');
  }
}

/* -------------------------------------------------------------
 * Boot Sequence & Auto-Open
 * ------------------------------------------------------------- */
function initBootSequence() {
  // First user interaction starts startup audio (due to browser autoplay policies)
  const startAudioOnFirstUserTouch = () => {
    window.xpAudio?.playStartup();
    window.removeEventListener('click', startAudioOnFirstUserTouch);
    window.removeEventListener('keydown', startAudioOnFirstUserTouch);
  };
  window.addEventListener('click', startAudioOnFirstUserTouch);
  window.addEventListener('keydown', startAudioOnFirstUserTouch);

  // Automatically open the Projects Explorer and AI Assistant welcoming message
  setTimeout(() => {
    windowManager.open('window-projects');
  }, 400);

  // Show Rover balloon notification after 1.5s
  setTimeout(() => {
    const balloon = document.getElementById('rover-welcome-balloon');
    if (balloon) {
      balloon.classList.remove('hidden');
      window.xpAudio?.playBalloon();
      setTimeout(() => {
        balloon.classList.add('fade-out');
        setTimeout(() => balloon.classList.add('hidden'), 500);
      }, 8000);
    }
  }, 1600);
}
