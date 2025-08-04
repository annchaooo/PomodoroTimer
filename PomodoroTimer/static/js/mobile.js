class MobilePomodoroTimer {
    constructor() {
        this.workDuration = 25; // minutes
        this.breakDuration = 5; // minutes
        this.currentTime = this.workDuration * 60; // seconds
        this.totalTime = this.workDuration * 60;
        this.isRunning = false;
        this.isWorkSession = true;
        this.sessionsCompleted = 0;
        this.autoStart = true;
        this.vibration = true;
        this.keepScreenOn = true;
        this.timer = null;
        this.wakeLock = null;
        
        this.initializeElements();
        this.loadSettings();
        this.setupEventListeners();
        this.updateDisplay();
        this.setupWakeLock();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionIndicator = document.getElementById('sessionIndicator');
        this.progressCircle = document.getElementById('progressCircle');
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
        this.vibrationCheckbox = document.getElementById('vibration');
        this.keepScreenOnCheckbox = document.getElementById('keepScreenOn');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.notificationSound = document.getElementById('notificationSound');
        this.tomatoBody = document.querySelector('.tomato-body');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        
        // Settings sliders
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
        
        // Touch events for better mobile interaction
        this.addTouchListeners();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                // App is in background, continue timer
                this.handleBackgroundTimer();
            }
        });
    }

    addTouchListeners() {
        // Add haptic feedback for button touches
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (this.vibration && navigator.vibrate) {
                    navigator.vibrate(10); // Short vibration feedback
                }
            });
        });
        
        // Double tap to start/pause
        let lastTap = 0;
        this.timeDisplay.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            }
            lastTap = currentTime;
        });
    }

    async setupWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                // Request wake lock when timer starts
                this.requestWakeLock();
            } catch (err) {
                console.log('Wake Lock not supported:', err);
            }
        }
    }

    async requestWakeLock() {
        if (this.keepScreenOn && 'wakeLock' in navigator) {
            try {
                this.wakeLock = await navigator.wakeLock.request('screen');
                this.wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock released');
                });
            } catch (err) {
                console.log('Failed to request wake lock:', err);
            }
        }
    }

    releaseWakeLock() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
        }
    }

    start() {
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'block';
        
        if (this.keepScreenOn) {
            this.requestWakeLock();
        }
        
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
        this.startBtn.style.display = 'block';
        this.pauseBtn.style.display = 'none';
        clearInterval(this.timer);
        this.releaseWakeLock();
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
        this.triggerVibration();
        
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
            setTimeout(() => this.start(), 2000);
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.sessionIndicator.textContent = this.isWorkSession ? 'Work Session' : 'Break Time';
        
        // Update progress circle
        const progress = ((this.totalTime - this.currentTime) / this.totalTime);
        const circumference = 2 * Math.PI * 120; // radius = 120
        const offset = circumference - (progress * circumference);
        this.progressCircle.style.strokeDashoffset = offset;
        
        // Update colors based on session type
        const color = this.isWorkSession ? '#E74C3C' : '#27AE60';
        if (this.tomatoBody) {
            this.tomatoBody.style.fill = color;
        }
        this.progressCircle.style.stroke = color;
        
        // Update document title for background use
        document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${this.isWorkSession ? 'Work' : 'Break'}`;
    }

    triggerVibration() {
        if (this.vibration && navigator.vibrate) {
            // Pattern: long, short, long, short, long
            navigator.vibrate([500, 100, 500, 100, 500]);
        }
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
        
        // Show notification if permission granted
        if (Notification.permission === 'granted') {
            const message = this.isWorkSession ? 'Break time! Take a rest.' : 'Work time! Stay focused.';
            new Notification('🍅 Pomodoro Timer', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
                vibrate: this.vibration ? [500, 100, 500] : undefined
            });
        }
    }

    handleBackgroundTimer() {
        // Store timestamp when going to background
        localStorage.setItem('pomodoroBackgroundTime', Date.now().toString());
        localStorage.setItem('pomodoroCurrentTime', this.currentTime.toString());
        localStorage.setItem('pomodoroIsRunning', this.isRunning.toString());
    }

    openSettings() {
        this.workDurationSlider.value = this.workDuration;
        this.breakDurationSlider.value = this.breakDuration;
        this.workDurationValue.textContent = this.workDuration + ' min';
        this.breakDurationValue.textContent = this.breakDuration + ' min';
        this.autoStartCheckbox.checked = this.autoStart;
        this.vibrationCheckbox.checked = this.vibration;
        this.keepScreenOnCheckbox.checked = this.keepScreenOn;
        this.settingsModal.style.display = 'flex';
    }

    closeSettings() {
        this.settingsModal.style.display = 'none';
    }

    saveSettings() {
        this.workDuration = parseInt(this.workDurationSlider.value);
        this.breakDuration = parseInt(this.breakDurationSlider.value);
        this.autoStart = this.autoStartCheckbox.checked;
        this.vibration = this.vibrationCheckbox.checked;
        this.keepScreenOn = this.keepScreenOnCheckbox.checked;
        
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
        const saved = localStorage.getItem('pomodoroMobileSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.workDuration = settings.workDuration || 25;
            this.breakDuration = settings.breakDuration || 5;
            this.autoStart = settings.autoStart !== undefined ? settings.autoStart : true;
            this.vibration = settings.vibration !== undefined ? settings.vibration : true;
            this.keepScreenOn = settings.keepScreenOn !== undefined ? settings.keepScreenOn : true;
            this.sessionsCompleted = settings.sessionsCompleted || 0;
            
            this.currentTime = this.workDuration * 60;
            this.totalTime = this.currentTime;
            this.sessionCount.textContent = this.sessionsCompleted;
        }
        
        // Check if app was running in background
        this.checkBackgroundTimer();
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    checkBackgroundTimer() {
        const backgroundTime = localStorage.getItem('pomodoroBackgroundTime');
        const savedCurrentTime = localStorage.getItem('pomodoroCurrentTime');
        const wasRunning = localStorage.getItem('pomodoroIsRunning') === 'true';
        
        if (backgroundTime && savedCurrentTime && wasRunning) {
            const elapsed = Math.floor((Date.now() - parseInt(backgroundTime)) / 1000);
            const newCurrentTime = Math.max(0, parseInt(savedCurrentTime) - elapsed);
            
            if (newCurrentTime > 0) {
                this.currentTime = newCurrentTime;
                this.start(); // Resume timer
            } else {
                // Timer completed while in background
                this.sessionComplete();
            }
            
            // Clean up
            localStorage.removeItem('pomodoroBackgroundTime');
            localStorage.removeItem('pomodoroCurrentTime');
            localStorage.removeItem('pomodoroIsRunning');
        }
    }

    saveToLocalStorage() {
        const settings = {
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            autoStart: this.autoStart,
            vibration: this.vibration,
            keepScreenOn: this.keepScreenOn,
            sessionsCompleted: this.sessionsCompleted
        };
        localStorage.setItem('pomodoroMobileSettings', JSON.stringify(settings));
    }
}

// Quick time functions
function setQuickTime(minutes) {
    if (window.timer && !window.timer.isRunning) {
        window.timer.workDuration = minutes;
        window.timer.currentTime = minutes * 60;
        window.timer.totalTime = minutes * 60;
        window.timer.updateDisplay();
    }
}

// Initialize the mobile timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new MobilePomodoroTimer();
    
    // Handle app install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button or prompt
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 Install App';
        installBtn.className = 'quick-btn';
        installBtn.onclick = () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installBtn.remove();
            });
        };
        
        document.querySelector('.quick-actions').appendChild(installBtn);
    });
});
