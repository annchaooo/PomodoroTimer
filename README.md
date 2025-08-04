# 🍅 Pomodoro Timer

A beautiful and functional Pomodoro Timer web application built with Python Flask and HTML/CSS/JavaScript.

## Features

- **Classic Pomodoro Technique**: 25 minutes work + 5 minutes break cycles
- **Automatic Timer Switching**: Seamlessly transitions between work and break periods
- **Customizable Time Settings**: Set your preferred work and break durations
- **Visual Tomato Design**: Beautiful tomato-themed UI
- **Audio Notifications**: Sound alerts when switching between work/break
- **Session Tracking**: Keep track of completed pomodoro sessions

## Screenshots

The application features a clean, tomato-themed interface with:
- Large, easy-to-read timer display
- Visual tomato illustration
- Intuitive start/pause/reset controls
- Settings panel for customizing durations

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Setup
1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd PomodoroTimer
   ```
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the application:
   ```bash
   python app.py
   ```
2. Open your web browser and go to `http://localhost:5000`
3. Click "Start" to begin your first pomodoro session
4. Use the settings icon to customize work and break durations

### Default Settings
- **Work Time**: 25 minutes
- **Break Time**: 5 minutes
- **Auto-start**: Enabled (automatically starts the next session)

### Customization
- Click the settings icon to modify work and break durations
- Times can be set from 1 minute to 60 minutes
- Settings are saved in your browser's local storage

## Project Structure

```
PomodoroTimer/
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── DOCUMENTATION.md   # Detailed technical documentation
├── static/
│   ├── css/
│   │   └── style.css  # Stylesheet with tomato theme
│   ├── js/
│   │   └── script.js  # Frontend JavaScript logic
│   └── audio/
│       └── notification.mp3  # Timer notification sound
└── templates/
    └── index.html     # Main HTML template
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the Pomodoro Technique developed by Francesco Cirillo
- Tomato illustrations and design inspired by classic pomodoro timers
- Built with Flask, HTML5, CSS3, and JavaScript
