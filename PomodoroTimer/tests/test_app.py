import unittest
from app import app

class TestPomodoroAPI(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Pomodoro Timer', response.data)

    def test_timer_status(self):
        response = self.app.get('/api/timer/status')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'is_running', response.data)
        self.assertIn(b'current_time', response.data)

    def test_start_timer(self):
        response = self.app.post('/api/timer/start', json={
            'work_duration': 25,
            'break_duration': 5
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

    def test_pause_timer(self):
        response = self.app.post('/api/timer/pause')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

    def test_reset_timer(self):
        response = self.app.post('/api/timer/reset')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

    def test_update_settings(self):
        response = self.app.post('/api/settings', json={
            'work_duration': 30,
            'break_duration': 10,
            'auto_start': True
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

if __name__ == '__main__':
    unittest.main()
