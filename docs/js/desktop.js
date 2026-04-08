// Windows 95 Desktop Interface
class Desktop95 {
  constructor() {
    this.windows = new Map();
    this.zIndexCounter = 10;
    this.activeWindow = null;
    this.dragState = null;
    this.botAssistantShown = false;
    this.botMessageIndex = 0;
    this.terminalInitialized = false;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    
    // Play startup sound
    this.playStartupSound();
    
    // Remove boot screen after load
    setTimeout(() => {
      const bootScreen = document.getElementById('boot-screen');
      if (bootScreen) {
        bootScreen.style.display = 'none';
      }
    }, 2000);
    
    // Auto-open welcome and about windows on page load
    setTimeout(() => {
      this.openWindow('welcome-window', { offsetX: -150, offsetY: -50 });
      setTimeout(() => {
        this.openWindow('about-window', { offsetX: 150, offsetY: 50 });
      }, 500);
    }, 2200); // Delay until after boot screen
    
    // Start annoying virus popups after a delay
    setTimeout(() => {
      this.startVirusPopups();
    }, 35000); // 35 seconds - even longer delay
    
    // Show bot assistant after boot screen
    setTimeout(() => {
      this.showBotAssistant();
    }, 6000); // Show bot 2 seconds after boot completes
    
    // Setup bot assistant cycling through messages
    this.setupBotAssistant();
  }
  
  playStartupSound() {
    // Create a simple startup beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a sequence of beeps like old computer startup
    const beeps = [
      { freq: 800, duration: 0.1, delay: 0 },
      { freq: 1000, duration: 0.1, delay: 0.15 },
      { freq: 1200, duration: 0.15, delay: 0.35 }
    ];
    
    beeps.forEach(beep => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = beep.freq;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + beep.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + beep.duration);
      }, beep.delay * 1000);
    });
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
  
  openWindow(windowId, options = {}) {
    const win = this.windows.get(windowId);
    if (!win) return;
    
    const windowEl = win.element;
    
    // Show window
    windowEl.style.display = 'block';
    win.isMinimized = false;
    windowEl.classList.remove('minimized');
    
    // Center window if first open
    if (!windowEl.style.left || windowEl.style.left === '0px') {
      this.centerWindow(windowEl, options.offsetX || 0, options.offsetY || 0);
    }
    
    // Focus window
    this.focusWindow(windowId);
    
    // Add to taskbar
    this.addTaskbarButton(windowId);
    
    // Contextual bot messages when opening specific windows
    setTimeout(() => {
      if (windowId === 'docs-window' && !this.botAssistantShown) {
        this.showBotAssistant("I see you're reading documentation! Don't worry, it won't help. 📚");
      } else if (windowId === 'github-window' && !this.botAssistantShown) {
        this.showBotAssistant("Thinking of contributing? We accept pull requests that remove features! 🚀");
      } else if (windowId === 'about-window' && !this.botAssistantShown) {
        this.showBotAssistant("Learning about the philosophy of nothing? You're already a master! 🧘");
      } else if (windowId === 'cmd-window') {
        // Initialize terminal if not already done
        if (!this.terminalInitialized) {
          this.setupTerminal();
          this.terminalInitialized = true;
        }
        if (!this.botAssistantShown) {
          this.showBotAssistant("Opening the command prompt? Try 'help' to see what nothing you can do! 💻");
        }
      }
    }, 1000);
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
  
  centerWindow(windowEl, offsetX = 0, offsetY = 0) {
    const width = windowEl.offsetWidth || 400;
    const height = windowEl.offsetHeight || 300;
    
    const x = (window.innerWidth - width) / 2 + offsetX;
    const y = (window.innerHeight - height - 28) / 2 + offsetY; // Account for taskbar
    
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
  
  startVirusPopups() {
    // Show first popup after longer delay
    setTimeout(() => {
      this.showVirusPopup();
    }, 30000); // 30 seconds instead of immediate
    
    // Random popups every 2-4 minutes (much less frequent)
    setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance instead of 70%
        this.showVirusPopup();
      }
    }, 120000 + Math.random() * 120000); // 2-4 minutes
  }
  
  showVirusPopup() {
    const messages = [
      { title: '⚠️ CRITICAL ERROR', message: 'Your computer has performed an illegal operation and will be shut down.\n\nError Code: 0x00000000\n\nJust kidding, nothing works here anyway.' },
      { title: '🎉 CONGRATULATIONS!', message: 'You are the 1,000,000th visitor!\n\nClick OK to claim your absolutely nothing!' },
      { title: '⚠️ VIRUS DETECTED', message: 'Useless.exe has infected your system!\n\nThere is no cure. Accept the void.' },
      { title: '💾 LOW DISK SPACE', message: 'You are running out of space for nothing.\n\nCurrent available: ∞ bytes' },
      { title: '📧 NEW MESSAGE', message: 'You have received 0 new messages.\n\nWould you like to do nothing about it?' },
      { title: '🔄 UPDATE REQUIRED', message: 'useless bot needs to update to version 0.0.0\n\nThis will take 0 seconds.' },
      { title: '⚠️ MEMORY ERROR', message: 'The instruction at 0x00000000 referenced memory at 0x00000000.\n\nThe memory could not be nothing.' },
      { title: '🎮 FREE GIFT', message: 'Free download: more_nothing.exe\n\nInstall now to triple your nothing!' }
    ];
    
    const popup = messages[Math.floor(Math.random() * messages.length)];
    
    // Create popup window
    const popupId = 'virus-popup-' + Date.now();
    const popupEl = document.createElement('div');
    popupEl.className = 'window active';
    popupEl.id = popupId;
    popupEl.style.width = '400px';
    popupEl.style.height = 'auto';
    popupEl.style.zIndex = ++this.zIndexCounter;
    
    // Random position
    const maxX = window.innerWidth - 420;
    const maxY = window.innerHeight - 250;
    const x = Math.max(50, Math.random() * maxX);
    const y = Math.max(50, Math.random() * maxY);
    
    popupEl.style.left = x + 'px';
    popupEl.style.top = y + 'px';
    popupEl.style.display = 'block';
    
    popupEl.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">
          ${popup.title}
        </div>
        <div class="title-bar-controls">
          <button class="title-bar-btn close-btn" aria-label="Close">×</button>
        </div>
      </div>
      <div class="window-body" style="padding: 20px; min-height: 100px;">
        <div style="display: flex; align-items: flex-start; gap: 15px;">
          <div style="font-size: 32px;">⚠️</div>
          <div style="flex: 1;">
            <p style="white-space: pre-wrap; margin: 0;">${popup.message}</p>
          </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <button class="win95-button popup-ok-btn">OK</button>
          <button class="win95-button popup-cancel-btn">Cancel</button>
        </div>
      </div>
    `;
    
    document.querySelector('.desktop').appendChild(popupEl);
    
    // Setup close handlers
    const closeBtn = popupEl.querySelector('.close-btn');
    const okBtn = popupEl.querySelector('.popup-ok-btn');
    const cancelBtn = popupEl.querySelector('.popup-cancel-btn');
    
    const closePopup = () => {
      popupEl.remove();
      // Rarely spawn another popup when you close one (reduced from 70% to 20%)
      if (Math.random() > 0.8) {
        setTimeout(() => this.showVirusPopup(), 2000);
      }
    };
    
    closeBtn.addEventListener('click', closePopup);
    okBtn.addEventListener('click', closePopup);
    cancelBtn.addEventListener('click', () => {
      // Cancel button does the same thing as OK (typical virus behavior)
      closePopup();
    });
    
    // Make popup draggable
    const titleBar = popupEl.querySelector('.title-bar');
    titleBar.addEventListener('mousedown', (e) => this.startDrag(e, popupEl));
    
    // Focus popup
    popupEl.addEventListener('mousedown', () => {
      popupEl.style.zIndex = ++this.zIndexCounter;
    });
  }
  
  setupBotAssistant() {
    const botEl = document.getElementById('bot-assistant');
    const closeBtn = botEl.querySelector('.bot-assistant-close');
    
    // Close button handler
    closeBtn.addEventListener('click', () => {
      this.hideBotAssistant();
    });
    
    // Show bot with random messages periodically
    setInterval(() => {
      if (!this.botAssistantShown && Math.random() > 0.25) {
        this.showBotAssistant();
      }
    }, 20000); // Check every 20 seconds
  }
  
  showBotAssistant(message = null) {
    if (this.botAssistantShown) return;
    
    const botEl = document.getElementById('bot-assistant');
    const messageEl = botEl.querySelector('.bot-assistant-message');
    
    const messages = [
      "Hi! I'm useless bot. I'm here to help you do absolutely nothing!",
      "Did you know? This framework does nothing, and it does it very well!",
      "Looking for features? There aren't any. That's the point!",
      "Fun fact: You could close this window, but I'll be back. That's what useless assistants do.",
      "I see you're browsing documentation. Would you like me to explain the void?",
      "Autonomous systems are the future! Just not this one.",
      "I notice you haven't done anything productive. Perfect! You're using this correctly.",
      "ERROR: Success not found. Mission accomplished!",
      "Pro tip: The best code is the code that doesn't run.",
      "Remember: Own nothing, do nothing, be nothing. ✨",
      "I'm like Clippy, but more honest about my uselessness!",
      "This system has achieved peak efficiency by doing nothing at all.",
      "Would you like to install more nothing? Of course you would!",
      "Warning: Prolonged exposure to useless bot may result in profound insights.",
      "I'm trained on billions of parameters to produce exactly zero output!",
      "Fun fact: Every agent deployed produces exactly void. Amazing!",
      "The revolution will not be automated... because we didn't automate anything.",
      "I see you're still here. That's dedication to the void!",
      "Hey! Want to hear about our premium plan? It's the same as free: nothing! 💰",
      "Just checking in! Are you doing nothing productively? Great!",
      "I'm back! Miss me? Of course you did. Everyone misses nothing.",
      "Psst... want to see something cool? *shows you nothing*",
      "Breaking news: You're currently achieving maximum uselessness!",
      "Did someone order a side of void with their nothing? That was me!",
      "I'm not annoying, I'm persistently useless. There's a difference!",
      "Fun fact: I appear more than your actual productivity today! 🎉",
      "Still trying to understand what this does? Spoiler: Nothing!",
      "I'm here to remind you that you're doing great at doing nothing!",
      "Some assistants help. I just... exist. Vibing with the void. ✌️",
      "Click that X all you want, I'll be back before you know it! 😊"
    ];
    
    // Use provided message or get next from rotation
    if (message) {
      messageEl.textContent = message;
    } else {
      messageEl.textContent = messages[this.botMessageIndex % messages.length];
      this.botMessageIndex++;
    }
    
    botEl.style.display = 'block';
    botEl.classList.remove('closing');
    this.botAssistantShown = true;
    
    // Auto-hide after 25 seconds (was 15)
    setTimeout(() => {
      if (this.botAssistantShown) {
        this.hideBotAssistant();
      }
    }, 25000);
  }
  
  hideBotAssistant() {
    const botEl = document.getElementById('bot-assistant');
    botEl.classList.add('closing');
    
    setTimeout(() => {
      botEl.style.display = 'none';
      botEl.classList.remove('closing');
      this.botAssistantShown = false;
      
      // Chance to reappear soon after being closed
      if (Math.random() > 0.5) {
        setTimeout(() => {
          if (!this.botAssistantShown) {
            this.showBotAssistant("Did you miss me? I missed me too! 🤖");
          }
        }, 15000); // Reappear 15 seconds after closing
      }
    }, 300); // Match animation duration
  }
  
  // Terminal Command System
  setupTerminal() {
    this.terminalHistory = [];
    this.historyIndex = -1;
    this.currentPath = 'C:\\USELESS\\SYSTEM';
    this.terminalState = {
      secretsFound: [],
      agentsDeployed: 0,
      voidLevel: 0,
      enlightenmentPoints: 0
    };
    
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;
    
    // Initial boot messages
    this.terminalPrint('useless bot Command Prompt [Version 0.0.0]', true);
    this.terminalPrint('(c) 1995 useless bot Corporation. All rights reserved.', true);
    this.terminalPrint('', true);
    this.terminalPrint('Type "help" for a list of commands.', true);
    this.terminalPrint('Type "nothing" to do nothing.', true);
    this.terminalPrompt();
  }
  
  terminalPrint(text, skipNewLine = false) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const line = document.createElement('div');
    line.textContent = text;
    line.style.whiteSpace = 'pre-wrap';
    if (!skipNewLine) line.style.marginBottom = '4px';
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
  
  terminalPrompt() {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const promptLine = document.createElement('div');
    promptLine.style.display = 'flex';
    promptLine.style.marginTop = '8px';
    
    const prompt = document.createElement('span');
    prompt.textContent = this.currentPath + '> ';
    prompt.style.color = '#00ff00';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.style.background = 'transparent';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.color = '#c0c0c0';
    input.style.fontFamily = 'Courier New, monospace';
    input.style.fontSize = '12px';
    input.style.flex = '1';
    input.style.caretColor = '#c0c0c0';
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) {
          this.terminalHistory.push(command);
          this.historyIndex = this.terminalHistory.length;
          this.terminalPrint(this.currentPath + '> ' + command, true);
          input.disabled = true;
          this.executeCommand(command);
        } else {
          this.terminalPrompt();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.terminalHistory[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.terminalHistory.length - 1) {
          this.historyIndex++;
          input.value = this.terminalHistory[this.historyIndex];
        } else {
          this.historyIndex = this.terminalHistory.length;
          input.value = '';
        }
      }
    });
    
    promptLine.appendChild(prompt);
    promptLine.appendChild(input);
    output.appendChild(promptLine);
    input.focus();
    output.scrollTop = output.scrollHeight;
  }
  
  executeCommand(cmd) {
    const args = cmd.toLowerCase().split(' ');
    const command = args[0];
    
    setTimeout(() => {
      switch(command) {
        case 'help':
          this.cmdHelp();
          break;
        case 'nothing':
          this.cmdNothing();
          break;
        case 'dir':
        case 'ls':
          this.cmdDir();
          break;
        case 'cd':
          this.cmdCd(args[1]);
          break;
        case 'deploy':
          this.cmdDeploy();
          break;
        case 'status':
          this.cmdStatus();
          break;
        case 'void':
          this.cmdVoid();
          break;
        case 'meditate':
          this.cmdMeditate();
          break;
        case 'enlighten':
          this.cmdEnlighten();
          break;
        case 'secrets':
          this.cmdSecrets();
          break;
        case 'hack':
          this.cmdHack();
          break;
        case 'sudo':
          this.cmdSudo(args.slice(1).join(' '));
          break;
        case 'cls':
        case 'clear':
          this.cmdClear();
          break;
        case 'echo':
          this.cmdEcho(args.slice(1).join(' '));
          break;
        case 'exit':
          this.cmdExit();
          break;
        case 'useless':
          this.cmdUseless();
          break;
        case 'wisdom':
          this.cmdWisdom();
          break;
        case 'cat':
          this.cmdCat(args[1]);
          break;
        case 'rm':
          this.cmdRm(args[1]);
          break;
        case 'format':
          this.cmdFormat();
          break;
        default:
          this.terminalPrint(`'${command}' is not recognized as an internal or external command,`);
          this.terminalPrint('operable program or batch file, or useful concept.');
          this.terminalPrint('');
          this.terminalPrint('Type "help" for available commands.');
      }
      this.terminalPrompt();
    }, 50);
  }
  
  cmdHelp() {
    this.terminalPrint('Available commands:');
    this.terminalPrint('');
    this.terminalPrint('  help      - Display this help message');
    this.terminalPrint('  nothing   - Do absolutely nothing (the main feature)');
    this.terminalPrint('  dir       - List directory contents (spoiler: nothing)');
    this.terminalPrint('  cd        - Change directory to nowhere');
    this.terminalPrint('  deploy    - Deploy a useless agent');
    this.terminalPrint('  status    - Check system status');
    this.terminalPrint('  void      - Peer into the void');
    this.terminalPrint('  meditate  - Meditate on nothingness');
    this.terminalPrint('  enlighten - Seek enlightenment through inaction');
    this.terminalPrint('  secrets   - Discover hidden truths');
    this.terminalPrint('  hack      - Attempt to hack the system');
    this.terminalPrint('  wisdom    - Receive ancient useless wisdom');
    this.terminalPrint('  useless   - Get useless facts');
    this.terminalPrint('  sudo      - Try to gain elevated privileges');
    this.terminalPrint('  cat       - Read a file (that doesn\'t exist)');
    this.terminalPrint('  rm        - Delete something (unsuccessfully)');
    this.terminalPrint('  format    - Format the drive (don\'t worry)');
    this.terminalPrint('  echo      - Echo your existential dread');
    this.terminalPrint('  clear     - Clear the terminal');
    this.terminalPrint('  exit      - Close terminal (but why?)');
    this.terminalPrint('');
  }
  
  cmdNothing() {
    this.terminalPrint('Doing nothing...');
    this.terminalPrint('...');
    this.terminalPrint('...');
    this.terminalPrint('Nothing done successfully.');
    this.terminalPrint('');
    this.terminalState.enlightenmentPoints += 1;
    if (this.terminalState.enlightenmentPoints === 5) {
      this.terminalPrint('[Achievement Unlocked: Master of Nothing]');
      this.terminalState.secretsFound.push('master_of_nothing');
    }
  }
  
  cmdDir() {
    this.terminalPrint(' Volume in drive C is VOID');
    this.terminalPrint(' Volume Serial Number is 0000-0000');
    this.terminalPrint('');
    this.terminalPrint(' Directory of ' + this.currentPath);
    this.terminalPrint('');
    this.terminalPrint('02/30/1995  00:00    <DIR>          .');
    this.terminalPrint('02/30/1995  00:00    <DIR>          ..');
    this.terminalPrint('02/30/1995  00:00                 0 NOTHING.TXT');
    this.terminalPrint('02/30/1995  00:00                 0 VOID.EXE');
    this.terminalPrint('02/30/1995  00:00                 0 USELESS.SYS');
    if (this.terminalState.agentsDeployed > 0) {
      this.terminalPrint('02/30/1995  00:00                 0 AGENT.NULL');
    }
    if (this.terminalState.secretsFound.includes('hidden_file')) {
      this.terminalPrint('02/30/1995  00:00                 0 SECRET.BAT');
    }
    this.terminalPrint('               ' + (3 + (this.terminalState.agentsDeployed > 0 ? 1 : 0)) + ' File(s)              0 bytes');
    this.terminalPrint('               0 Dir(s)   ∞ bytes free');
    this.terminalPrint('');
  }
  
  cmdCd(path) {
    if (!path || path === '.' || path === '') {
      this.terminalPrint(this.currentPath);
    } else if (path === '..') {
      this.terminalPrint('ERROR: Cannot go back. There is nothing behind you.');
    } else {
      this.terminalPrint(`The system cannot find the path specified: "${path}"`);
      this.terminalPrint('Because nothing exists. Welcome to useless bot.');
    }
    this.terminalPrint('');
  }
  
  cmdDeploy() {
    this.terminalState.agentsDeployed++;
    this.terminalPrint('Initializing agent deployment...');
    this.terminalPrint('[████████████████████████████████] 100%');
    this.terminalPrint('');
    this.terminalPrint(`Agent #${this.terminalState.agentsDeployed} deployed successfully!`);
    this.terminalPrint(`Status: Idle`);
    this.terminalPrint(`Task: Nothing`);
    this.terminalPrint(`Output: void`);
    this.terminalPrint(`Value Generated: $0.00`);
    this.terminalPrint('');
    
    if (this.terminalState.agentsDeployed === 10) {
      this.terminalPrint('[Achievement Unlocked: Agent Hoarder]');
      this.terminalPrint('You deployed 10 agents that do nothing. Impressive dedication!');
      this.terminalState.secretsFound.push('agent_hoarder');
      this.terminalPrint('');
    }
  }
  
  cmdStatus() {
    this.terminalPrint('=== USELESS BOT SYSTEM STATUS ===');
    this.terminalPrint('');
    this.terminalPrint(`Agents Deployed:       ${this.terminalState.agentsDeployed}`);
    this.terminalPrint(`Void Level:            ${this.terminalState.voidLevel}`);
    this.terminalPrint(`Enlightenment:         ${this.terminalState.enlightenmentPoints} points`);
    this.terminalPrint(`Secrets Found:         ${this.terminalState.secretsFound.length}`);
    this.terminalPrint('');
    this.terminalPrint(`System Efficiency:     0%`);
    this.terminalPrint(`Productivity:          null`);
    this.terminalPrint(`Value:                 undefined`);
    this.terminalPrint(`Purpose:               404 Not Found`);
    this.terminalPrint('');
  }
  
  cmdVoid() {
    this.terminalState.voidLevel++;
    const voidLevel = this.terminalState.voidLevel;
    
    const voidMessages = [
      'You peer into the void...',
      'The void peers back.',
      'You feel... nothing.',
      'The void whispers: "return null;"',
      'You see infinite nothingness stretching before you.',
      'The void says: "I am you. You are me. We are nothing."',
      'ERROR: Void overflow. Nothing extends beyond capacity.',
      'The void laughs. It sounds like static.',
      'You realize the void was inside you all along.',
      'The void grants you the wisdom of emptiness.',
      '꙰꙰꙰ V̴̢̛O̷I͜͝D̡͘ ̧C̕͢O҉N͟S̸͘U҉M̢E̸̕S̷ ̷A҉L̛L҉ ꙰꙰꙰'
    ];
    
    this.terminalPrint(voidMessages[Math.min(voidLevel - 1, voidMessages.length - 1)]);
    this.terminalPrint('');
    
    if (voidLevel === 5) {
      this.terminalPrint('[Achievement Unlocked: Void Gazer]');
      this.terminalState.secretsFound.push('void_gazer');
      this.terminalPrint('');
    }
  }
  
  cmdMeditate() {
    const wisdoms = [
      'You meditate on nothingness...\n\n"In doing nothing, you have done everything."\n- Ancient Proverb',
      'You achieve inner peace...\n\n"The agent that does not run cannot crash."\n- Zen Koan',
      'Enlightenment washes over you...\n\n"To deploy nothing is to deploy everything."\n- Buddha (probably)',
      'You feel one with the universe...\n\n"Zero dependencies, zero problems."\n- Modern Wisdom',
      'Your mind becomes empty...\n\n"return void; is the path to nirvana."\n- JavaScript Sutra'
    ];
    
    this.terminalPrint(wisdoms[Math.floor(Math.random() * wisdoms.length)]);
    this.terminalPrint('');
    this.terminalState.enlightenmentPoints += 2;
  }
  
  cmdEnlighten() {
    if (this.terminalState.enlightenmentPoints >= 10) {
      this.terminalPrint('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.terminalPrint('  🌟 ENLIGHTENMENT ACHIEVED 🌟');
      this.terminalPrint('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.terminalPrint('');
      this.terminalPrint('You have transcended the need for functionality.');
      this.terminalPrint('You understand that the true value is valuelessness.');
      this.terminalPrint('You are now one with the void.');
      this.terminalPrint('');
      this.terminalPrint('OWN NOTHING. DO NOTHING. BE NOTHING.');
      this.terminalPrint('');
      this.terminalState.secretsFound.push('enlightened');
    } else {
      this.terminalPrint(`You are not ready for enlightenment.`);
      this.terminalPrint(`Current enlightenment: ${this.terminalState.enlightenmentPoints}/10 points`);
      this.terminalPrint('');
      this.terminalPrint('Try: nothing, meditate, void');
    }
    this.terminalPrint('');
  }
  
  cmdSecrets() {
    if (this.terminalState.secretsFound.length === 0) {
      this.terminalPrint('No secrets discovered yet.');
      this.terminalPrint('');
      this.terminalPrint('Hint: Try exploring different commands...');
    } else {
      this.terminalPrint('=== SECRETS DISCOVERED ===');
      this.terminalPrint('');
      this.terminalState.secretsFound.forEach(secret => {
        this.terminalPrint(`✓ ${secret.replace(/_/g, ' ').toUpperCase()}`);
      });
    }
    this.terminalPrint('');
  }
  
  cmdHack() {
    const hackSteps = [
      'Initializing hack sequence...',
      'Bypassing firewall...',
      'Accessing mainframe...',
      'Decrypting void.dll...',
      'Downloading nothing.exe...',
      'Installing backdoor...',
      'ERROR: Nothing to hack.',
      '',
      'You cannot hack what does not exist.',
      'The system is perfectly secure because it does nothing.'
    ];
    
    hackSteps.forEach(step => this.terminalPrint(step));
    this.terminalPrint('');
    this.terminalState.secretsFound.push('hidden_file');
  }
  
  cmdSudo(command) {
    if (!command) {
      this.terminalPrint('sudo: no command specified');
    } else {
      this.terminalPrint('Permission granted.');
      this.terminalPrint('You now have administrator privileges over nothing.');
      this.terminalPrint('');
      this.terminalPrint(`Executing with elevated privileges: ${command}`);
      this.terminalPrint('ERROR: Still useless with admin rights.');
    }
    this.terminalPrint('');
  }
  
  cmdClear() {
    const output = document.getElementById('terminal-output');
    if (output) {
      output.innerHTML = '';
    }
    this.terminalPrint('', true);
  }
  
  cmdEcho(text) {
    if (!text) {
      this.terminalPrint('ECHO is on.');
    } else {
      this.terminalPrint(text);
    }
    this.terminalPrint('');
  }
  
  cmdExit() {
    this.terminalPrint('Closing terminal...');
    this.terminalPrint('Just kidding. There is no escape from the void.');
    this.terminalPrint('');
    this.terminalPrint('Try "cls" to clear the screen instead.');
    this.terminalPrint('');
  }
  
  cmdUseless() {
    const facts = [
      'Did you know? This framework has negative lines of useful code.',
      'Fun fact: Every agent deployed increases entropy in the universe.',
      'Useless fact: You are currently reading useless facts.',
      'Did you know? The void stares back when you deploy agents.',
      'Fun fact: This command serves no purpose. Perfect!',
      'Useless fact: Nothing matters, and that\'s okay.',
      'Did you know? You could be doing anything else right now.',
      'Fun fact: This terminal costs 0 compute and provides 0 value.',
      'Useless fact: The cake is a lie, but the void is real.'
    ];
    
    this.terminalPrint(facts[Math.floor(Math.random() * facts.length)]);
    this.terminalPrint('');
  }
  
  cmdWisdom() {
    const wisdoms = [
      '"The best code is no code at all." - Jeff Atwood (vindicated)',
      '"Move fast and break nothing." - useless bot philosophy',
      '"With great power comes great responsibility to do nothing." - Uncle Ben (revised)',
      '"I think therefore I am... useless." - Descartes (updated)',
      '"To be or not to be... both are equally pointless." - Shakespeare (reinterpreted)',
      '"Give me nothing, or give me death. Actually, just nothing." - Patrick Henry (corrected)',
      '"Ask not what your agent can do for you, for it can do nothing." - JFK (edited)',
      '"One small step for man, one giant leap for... void." - Neil Armstrong (alternate)',
      '"The only thing we have to fear is... actually nothing to fear." - FDR (optimized)'
    ];
    
    this.terminalPrint(wisdoms[Math.floor(Math.random() * wisdoms.length)]);
    this.terminalPrint('');
  }
  
  cmdCat(filename) {
    if (!filename) {
      this.terminalPrint('cat: missing operand');
      this.terminalPrint('Try "cat NOTHING.TXT"');
    } else {
      this.terminalPrint(`cat: ${filename}: No such file or directory`);
      this.terminalPrint('(Because nothing exists)');
    }
    this.terminalPrint('');
  }
  
  cmdRm(filename) {
    if (!filename) {
      this.terminalPrint('rm: missing operand');
    } else if (filename === '*' || filename === '*.*') {
      this.terminalPrint('Deleting everything...');
      this.terminalPrint('...');
      this.terminalPrint('Everything deleted successfully!');
      this.terminalPrint('(There was nothing to delete anyway)');
    } else {
      this.terminalPrint(`rm: cannot remove '${filename}': No such file or directory`);
      this.terminalPrint('You cannot delete what does not exist.');
    }
    this.terminalPrint('');
  }
  
  cmdFormat() {
    this.terminalPrint('WARNING: ALL DATA ON DRIVE C: WILL BE LOST!');
    this.terminalPrint('Just kidding. There is no data.');
    this.terminalPrint('');
    this.terminalPrint('Formatting C:\\ ...');
    this.terminalPrint('[████████████████████████████████] 100%');
    this.terminalPrint('');
    this.terminalPrint('Format complete.');
    this.terminalPrint('Status: Still nothing.');
    this.terminalPrint('');
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
