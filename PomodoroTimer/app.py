from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mobile')
def mobile():
    return render_template('mobile.html')

@app.route('/api/timer/status', methods=['GET'])
def timer_status():
    # Placeholder logic for timer status
    return jsonify({
        "is_running": False,
        "current_time": 0,
        "session_type": "work",
        "sessions_completed": 0
    })

@app.route('/api/timer/start', methods=['POST'])
def start_timer():
    # Placeholder logic for starting timer
    data = request.json
    work_duration = data.get('work_duration', 25)
    break_duration = data.get('break_duration', 5)
    return jsonify(success=True)

@app.route('/api/timer/pause', methods=['POST'])
def pause_timer():
    # Placeholder logic for pausing timer
    return jsonify(success=True)

@app.route('/api/timer/reset', methods=['POST'])
def reset_timer():
    # Placeholder logic for resetting timer
    return jsonify(success=True)

@app.route('/api/settings', methods=['POST'])
def update_settings():
    # Placeholder logic for updating settings
    data = request.json
    work_duration = data.get('work_duration', 25)
    break_duration = data.get('break_duration', 5)
    auto_start = data.get('auto_start', True)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
