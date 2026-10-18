/**
 * Windows XP Window Manager
 * Provides dragging, resizing, z-indexing, minimize/maximize animations,
 * and taskbar synchronization.
 */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindowId = null;
    this.topZIndex = 100;
    this.taskbarContainer = document.getElementById('taskbar-windows');
    this.initEventListeners();
  }

  registerWindow(id, options = {}) {
    const el = document.getElementById(id);
    if (!el) return null;

    const winData = {
      id,
      el,
      title: options.title || el.querySelector('.xp-window-title span')?.innerText || 'Window',
      icon: options.icon || 'folder',
      minimized: false,
      maximized: false,
      prevBounds: null,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null
    };

    this.windows.set(id, winData);
    this.setupWindowEvents(winData);
    return winData;
  }

  setupWindowEvents(win) {
    const header = win.el.querySelector('.xp-window-header');
    const btnMin = win.el.querySelector('.btn-minimize');
    const btnMax = win.el.querySelector('.btn-maximize');
    const btnClose = win.el.querySelector('.btn-close');

    // Dragging
    if (header) {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.xp-window-controls')) return;
        if (win.maximized) return;

        isDragging = true;
        this.bringToFront(win.id);
        
        startX = e.clientX;
        startY = e.clientY;
        const rect = win.el.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        const onMouseMove = (ev) => {
          if (!isDragging) return;
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;

          const newX = Math.max(0, Math.min(window.innerWidth - 60, initialLeft + dx));
          const newY = Math.max(0, Math.min(window.innerHeight - 70, initialTop + dy));

          win.el.style.left = `${newX}px`;
          win.el.style.top = `${newY}px`;
          win.el.style.transform = 'none';
        };

        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Double click header to maximize/restore
      header.addEventListener('dblclick', (e) => {
        if (e.target.closest('.xp-window-controls')) return;
        this.toggleMaximize(win.id);
      });
    }

    // Window controls
    if (btnMin) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        window.xpAudio?.playClick();
        this.minimize(win.id);
      });
    }

    if (btnMax) {
      btnMax.addEventListener('click', (e) => {
        e.stopPropagation();
        window.xpAudio?.playClick();
        this.toggleMaximize(win.id);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        window.xpAudio?.playClick();
        this.close(win.id);
      });
    }

    // Clicking anywhere in window activates it
    win.el.addEventListener('mousedown', () => {
      this.bringToFront(win.id);
    });
  }

  open(id, focus = true) {
    let win = this.windows.get(id);
    if (!win) {
      win = this.registerWindow(id);
    }
    if (!win) return;

    win.el.classList.remove('hidden', 'anim-minimize', 'is-minimized');
    win.el.classList.add('anim-open');
    setTimeout(() => win.el.classList.remove('anim-open'), 300);

    win.minimized = false;
    this.updateTaskbar();

    if (focus) {
      this.bringToFront(id);
    }

    if (typeof win.onOpen === 'function') {
      win.onOpen();
    }
    window.xpAudio?.playClick();
  }

  close(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.el.classList.add('anim-close');
    setTimeout(() => {
      win.el.classList.remove('anim-close');
      win.el.classList.add('hidden');
    }, 180);

    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }

    this.updateTaskbar();

    if (typeof win.onClose === 'function') {
      win.onClose();
    }
  }

  minimize(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.el.classList.add('anim-minimize');
    setTimeout(() => {
      win.el.classList.add('hidden', 'is-minimized');
      win.el.classList.remove('anim-minimize');
      win.minimized = true;
      if (this.activeWindowId === id) {
        this.activeWindowId = null;
        // Focus top visible window
        this.focusTopVisibleWindow();
      }
      this.updateTaskbar();
    }, 200);
  }

  restore(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.el.classList.remove('hidden', 'is-minimized');
    win.el.classList.add('anim-open');
    setTimeout(() => win.el.classList.remove('anim-open'), 250);

    win.minimized = false;
    this.bringToFront(id);
    this.updateTaskbar();
  }

  toggleMaximize(id) {
    const win = this.windows.get(id);
    if (!win) return;

    if (!win.maximized) {
      // Maximize
      const rect = win.el.getBoundingClientRect();
      win.prevBounds = {
        left: win.el.style.left || `${rect.left}px`,
        top: win.el.style.top || `${rect.top}px`,
        width: win.el.style.width || `${rect.width}px`,
        height: win.el.style.height || `${rect.height}px`,
        transform: win.el.style.transform
      };

      win.el.classList.add('is-maximized');
      win.maximized = true;
    } else {
      // Restore
      win.el.classList.remove('is-maximized');
      if (win.prevBounds) {
        win.el.style.left = win.prevBounds.left;
        win.el.style.top = win.prevBounds.top;
        win.el.style.width = win.prevBounds.width;
        win.el.style.height = win.prevBounds.height;
        win.el.style.transform = win.prevBounds.transform;
      }
      win.maximized = false;
    }
  }

  bringToFront(id) {
    const win = this.windows.get(id);
    if (!win) return;

    this.topZIndex++;
    win.el.style.zIndex = this.topZIndex;

    // Remove active state from all
    this.windows.forEach(w => {
      w.el.classList.remove('is-active');
    });

    win.el.classList.add('is-active');
    this.activeWindowId = id;
    this.updateTaskbar();
  }

  focusTopVisibleWindow() {
    let topWin = null;
    let maxZ = -1;

    this.windows.forEach(w => {
      if (!w.minimized && !w.el.classList.contains('hidden')) {
        const z = parseInt(w.el.style.zIndex || '0', 10);
        if (z > maxZ) {
          maxZ = z;
          topWin = w;
        }
      }
    });

    if (topWin) {
      this.bringToFront(topWin.id);
    }
  }

  updateTaskbar() {
    if (!this.taskbarContainer) {
      this.taskbarContainer = document.getElementById('taskbar-windows');
      if (!this.taskbarContainer) return;
    }

    this.taskbarContainer.innerHTML = '';

    this.windows.forEach(win => {
      const isVisibleOrMin = !win.el.classList.contains('hidden') || win.minimized;
      if (!isVisibleOrMin) return;

      const btn = document.createElement('div');
      btn.className = `xp-taskbar-tab ${this.activeWindowId === win.id && !win.minimized ? 'active' : ''} ${win.minimized ? 'minimized' : ''}`;
      
      const iconClass = win.icon || 'folder';
      btn.innerHTML = `
        <span class="tab-icon icon-${iconClass}"></span>
        <span class="tab-title">${win.title}</span>
      `;

      btn.addEventListener('click', () => {
        window.xpAudio?.playClick();
        if (win.minimized) {
          this.restore(win.id);
        } else if (this.activeWindowId === win.id) {
          this.minimize(win.id);
        } else {
          this.bringToFront(win.id);
        }
      });

      this.taskbarContainer.appendChild(btn);
    });
  }

  initEventListeners() {
    // Escape key closes active window if dialog
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeWindowId) {
        const win = this.windows.get(this.activeWindowId);
        if (win && win.el.classList.contains('xp-dialog')) {
          this.close(this.activeWindowId);
        }
      }
    });
  }
}

window.windowManager = new WindowManager();
