// Windows 95 Desktop Interface
class Desktop95 {
  constructor() {
    this.windows = new Map();
    this.zIndexCounter = 10;
    this.activeWindow = null;
    this.dragState = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }
  
  setupEventListeners() {
    // Start button
    const startBtn = document.querySelector('.start-button');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStartMenu();
      });
    }
    
    // Close start menu when clicking outside
    document.addEventListener('click', () => {
      const startMenu = document.querySelector('.start-menu');
      const startBtn = document.querySelector('.start-button');
      if (startMenu && startMenu.classList.contains('show')) {
        startMenu.classList.remove('show');
        startBtn.classList.remove('active');
      }
    });
    
    // Prevent start menu from closing when clicking inside it
    const startMenu = document.querySelector('.start-menu');
    if (startMenu) {
      startMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const windowId = icon.dataset.window;
        this.openWindow(windowId);
      });
      
      icon.addEventListener('dblclick', () => {
        const windowId = icon.dataset.window;
        this.openWindow(windowId);
      });
    });
    
    // Start menu items
    document.querySelectorAll('.start-menu-item').forEach(item => {
      if (!item.classList.contains('has-submenu')) {
        item.addEventListener('click', () => {
          const windowId = item.dataset.window;
          if (windowId) {
            this.openWindow(windowId);
            this.toggleStartMenu();
          }
        });
      }
    });
    
    // Setup all windows
    document.querySelectorAll('.window').forEach(win => {
      this.setupWindow(win);
    });
  }
  
  setupWindow(windowEl) {
    const windowId = windowEl.id;
    const titleBar = windowEl.querySelector('.title-bar');
    const closeBtn = windowEl.querySelector('.close-btn');
    const minimizeBtn = windowEl.querySelector('.minimize-btn');
    const maximizeBtn = windowEl.querySelector('.maximize-btn');
    
    // Store window state
    this.windows.set(windowId, {
      element: windowEl,
      isMaximized: false,
      isMinimized: false,
      prevPosition: null,
      prevSize: null
    });
    
    // Make draggable
    if (titleBar) {
      titleBar.addEventListener('mousedown', (e) => this.startDrag(e, windowEl));
    }
    
    // Window controls
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeWindow(windowId));
    }
    
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
    }
    
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowId));
    }
    
    // Focus on click
    windowEl.addEventListener('mousedown', () => this.focusWindow(windowId));
  }
  
  openWindow(windowId) {
    const win = this.windows.get(windowId);
    if (!win) return;
    
    const windowEl = win.element;
    
    // Show window
    windowEl.style.display = 'block';
    win.isMinimized = false;
    windowEl.classList.remove('minimized');
    
    // Center window if first open
    if (!windowEl.style.left || windowEl.style.left === '0px') {
      this.centerWindow(windowEl);
    }
    
    // Focus window
    this.focusWindow(windowId);
    
    // Add to taskbar
    this.addTaskbarButton(windowId);
  }
  
  closeWindow(windowId) {
    const win = this.windows.get(windowId);
    if (!win) return;
    
    win.element.style.display = 'none';
    win.isMinimized = false;
    win.isMaximized = false;
    win.element.classList.remove('minimized', 'maximized', 'active');
    
    // Remove from taskbar
    this.removeTaskbarButton(windowId);
    
    // Focus another window if this was active
    if (this.activeWindow === windowId) {
      this.activeWindow = null;
    }
  }
  
  minimizeWindow(windowId) {
    const win = this.windows.get(windowId);
    if (!win) return;
    
    win.isMinimized = true;
    win.element.classList.add('minimized');
    win.element.classList.remove('active');
    
    // Update taskbar button
    const taskBtn = document.querySelector(`[data-window="${windowId}"].task-button`);
    if (taskBtn) {
      taskBtn.classList.remove('active');
    }
    
    if (this.activeWindow === windowId) {
      this.activeWindow = null;
    }
  }
  
  toggleMaximize(windowId) {
    const win = this.windows.get(windowId);
    if (!win) return;
    
    const windowEl = win.element;
    
    if (win.isMaximized) {
      // Restore
      windowEl.classList.remove('maximized');
      if (win.prevPosition) {
        windowEl.style.left = win.prevPosition.left;
        windowEl.style.top = win.prevPosition.top;
      }
      if (win.prevSize) {
        windowEl.style.width = win.prevSize.width;
        windowEl.style.height = win.prevSize.height;
      }
      win.isMaximized = false;
    } else {
      // Maximize
      win.prevPosition = {
        left: windowEl.style.left,
        top: windowEl.style.top
      };
      win.prevSize = {
        width: windowEl.style.width,
        height: windowEl.style.height
      };
      windowEl.classList.add('maximized');
      win.isMaximized = true;
    }
  }
  
  focusWindow(windowId) {
    // Remove active from all windows
    document.querySelectorAll('.window').forEach(w => {
      w.classList.remove('active');
    });
    
    // Remove active from all taskbar buttons
    document.querySelectorAll('.task-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const win = this.windows.get(windowId);
    if (!win) return;
    
    // Set active
    win.element.classList.add('active');
    win.element.style.zIndex = ++this.zIndexCounter;
    this.activeWindow = windowId;
    
    // Update taskbar button
    const taskBtn = document.querySelector(`[data-window="${windowId}"].task-button`);
    if (taskBtn) {
      taskBtn.classList.add('active');
    }
  }
  
  startDrag(e, windowEl) {
    const windowId = windowEl.id;
    const win = this.windows.get(windowId);
    
    // Don't drag if maximized
    if (win && win.isMaximized) return;
    
    // Focus the window
    this.focusWindow(windowId);
    
    const rect = windowEl.getBoundingClientRect();
    
    this.dragState = {
      windowEl: windowEl,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    
    e.preventDefault();
  }
  
  onDrag = (e) => {
    if (!this.dragState) return;
    
    const { windowEl, offsetX, offsetY } = this.dragState;
    
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Keep window in bounds
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    windowEl.style.left = newX + 'px';
    windowEl.style.top = newY + 'px';
  }
  
  stopDrag = () => {
    this.dragState = null;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  }
  
  centerWindow(windowEl) {
    const width = windowEl.offsetWidth || 400;
    const height = windowEl.offsetHeight || 300;
    
    const x = (window.innerWidth - width) / 2;
    const y = (window.innerHeight - height - 28) / 2; // Account for taskbar
    
    windowEl.style.left = Math.max(0, x) + 'px';
    windowEl.style.top = Math.max(0, y) + 'px';
  }
  
  addTaskbarButton(windowId) {
    // Check if button already exists
    if (document.querySelector(`[data-window="${windowId}"].task-button`)) {
      return;
    }
    
    const win = this.windows.get(windowId);
    if (!win) return;
    
    const taskList = document.querySelector('.task-list');
    const titleBar = win.element.querySelector('.title-bar-text');
    const icon = titleBar.querySelector('img');
    const title = titleBar.textContent.trim();
    
    const btn = document.createElement('button');
    btn.className = 'task-button';
    btn.dataset.window = windowId;
    
    if (icon) {
      const btnIcon = icon.cloneNode(true);
      btn.appendChild(btnIcon);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = title;
    btn.appendChild(textSpan);
    
    btn.addEventListener('click', () => {
      if (win.isMinimized) {
        // Restore window
        win.isMinimized = false;
        win.element.classList.remove('minimized');
        this.focusWindow(windowId);
      } else if (this.activeWindow === windowId) {
        // Minimize if already active
        this.minimizeWindow(windowId);
      } else {
        // Focus window
        this.focusWindow(windowId);
      }
    });
    
    taskList.appendChild(btn);
  }
  
  removeTaskbarButton(windowId) {
    const btn = document.querySelector(`[data-window="${windowId}"].task-button`);
    if (btn) {
      btn.remove();
    }
  }
  
  toggleStartMenu() {
    const startMenu = document.querySelector('.start-menu');
    const startBtn = document.querySelector('.start-button');
    
    if (startMenu.classList.contains('show')) {
      startMenu.classList.remove('show');
      startBtn.classList.remove('active');
    } else {
      startMenu.classList.add('show');
      startBtn.classList.add('active');
    }
  }
  
  updateClock() {
    const clockEl = document.querySelector('.clock');
    if (!clockEl) return;
    
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }
}

// Initialize desktop when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new Desktop95();
  });
} else {
  window.desktop = new Desktop95();
}
