class PomodoroTimer {
    constructor() {
        this.workDuration = 25; // minutes
        this.breakDuration = 5; // minutes
        this.currentTime = this.workDuration * 60; // seconds
        this.totalTime = this.workDuration * 60;
        this.isRunning = false;
        this.isWorkSession = true;
        this.sessionsCompleted = 0;
        this.autoStart = true;
        this.timer = null;
        
        this.initializeElements();
        this.loadSettings();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.progressFill = document.getElementById('progressFill');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.sessionCount = document.getElementById('sessionCount');
        this.settingsModal = document.getElementById('settingsModal');
        this.workDurationSlider = document.getElementById('workDuration');
        this.breakDurationSlider = document.getElementById('breakDuration');
        this.workDurationValue = document.getElementById('workDurationValue');
        this.breakDurationValue = document.getElementById('breakDurationValue');
        this.autoStartCheckbox = document.getElementById('autoStart');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.cancelSettingsBtn = document.getElementById('cancelSettings');
        this.notificationSound = document.getElementById('notificationSound');
        this.tomatoBody = document.querySelector('.tomato-body');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.cancelSettingsBtn.addEventListener('click', () => this.closeSettings());
        
        // Settings sliders - fix the real-time update
        this.workDurationSlider.addEventListener('input', (e) => {
            this.workDurationValue.textContent = e.target.value + ' min';
        });
        this.breakDurationSlider.addEventListener('input', (e) => {
            this.breakDurationValue.textContent = e.target.value + ' min';
        });

        // Close modal when clicking outside
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.settingsModal.style.display === 'flex') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            }
        });
    }

    start() {
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        
        this.timer = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            
            if (this.currentTime <= 0) {
                this.sessionComplete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        clearInterval(this.timer);
    }

    reset() {
        this.pause();
        this.currentTime = this.isWorkSession ? this.workDuration * 60 : this.breakDuration * 60;
        this.totalTime = this.currentTime;
        this.updateDisplay();
    }

    sessionComplete() {
        this.pause();
        this.playNotification();
        
        if (this.isWorkSession) {
            this.sessionsCompleted++;
            this.sessionCount.textContent = this.sessionsCompleted;
        }
        
        // Switch session type
        this.isWorkSession = !this.isWorkSession;
        this.currentTime = this.isWorkSession ? this.workDuration * 60 : this.breakDuration * 60;
        this.totalTime = this.currentTime;
        this.updateDisplay();
        
        // Auto-start next session if enabled
        if (this.autoStart) {
            setTimeout(() => this.start(), 1000);
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.sessionType.textContent = this.isWorkSession ? 'Work Session' : 'Break Time';
        
        // Update progress bar
        const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update tomato color based on session type
        if (this.tomatoBody) {
            this.tomatoBody.style.fill = this.isWorkSession ? '#E74C3C' : '#27AE60';
        }
        
        // Update progress bar color
        this.progressFill.style.backgroundColor = this.isWorkSession ? '#E74C3C' : '#27AE60';
    }

    playNotification() {
        try {
            this.notificationSound.currentTime = 0;
            this.notificationSound.play().catch(e => {
                console.log('Could not play notification sound:', e);
            });
        } catch (e) {
            console.log('Audio not supported:', e);
        }
        
        // Also show browser notification if permission granted
        if (Notification.permission === 'granted') {
            const message = this.isWorkSession ? 'Break time! Take a rest.' : 'Work time! Stay focused.';
            new Notification('Pomodoro Timer', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
            });
        }
    }

    openSettings() {
        this.workDurationSlider.value = this.workDuration;
        this.breakDurationSlider.value = this.breakDuration;
        this.workDurationValue.textContent = this.workDuration + ' min';
        this.breakDurationValue.textContent = this.breakDuration + ' min';
        this.autoStartCheckbox.checked = this.autoStart;
        this.settingsModal.style.display = 'flex';
    }

    closeSettings() {
        this.settingsModal.style.display = 'none';
    }

    saveSettings() {
        this.workDuration = parseInt(this.workDurationSlider.value);
        this.breakDuration = parseInt(this.breakDurationSlider.value);
        this.autoStart = this.autoStartCheckbox.checked;
        
        // Update current session if not running
        if (!this.isRunning) {
            this.currentTime = this.isWorkSession ? this.workDuration * 60 : this.breakDuration * 60;
            this.totalTime = this.currentTime;
            this.updateDisplay();
        }
        
        this.saveToLocalStorage();
        this.closeSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.workDuration = settings.workDuration || 25;
            this.breakDuration = settings.breakDuration || 5;
            this.autoStart = settings.autoStart !== undefined ? settings.autoStart : true;
            this.sessionsCompleted = settings.sessionsCompleted || 0;
            
            this.currentTime = this.workDuration * 60;
            this.totalTime = this.currentTime;
            this.sessionCount.textContent = this.sessionsCompleted;
        }
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    saveToLocalStorage() {
        const settings = {
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            autoStart: this.autoStart,
            sessionsCompleted: this.sessionsCompleted
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
