#!/usr/bin/env python3
"""
Mobile Pomodoro Timer Server Starter
Starts the Flask server and provides mobile access instructions.
"""

import socket
import subprocess
import sys
import os

def get_local_ip():
    """Get the local IP address of the machine."""
    try:
        # Connect to a remote address to get local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
        return local_ip
    except Exception:
        return "localhost"

def print_qr_code(url):
    """Print a simple QR code for the URL."""
    try:
        import qrcode
        qr = qrcode.QRCode(version=1, box_size=2, border=1)
        qr.add_data(url)
        qr.make(fit=True)
        qr.print_ascii(invert=True)
    except ImportError:
        print("📱 Install qrcode for QR code generation: pip install qrcode[pil]")

def main():
    print("🍅 Starting Mobile Pomodoro Timer Server...")
    print("=" * 50)
    
    # Get local IP
    local_ip = get_local_ip()
    port = 8080
    
    # URLs for access
    desktop_url = f"http://{local_ip}:{port}/"
    mobile_url = f"http://{local_ip}:{port}/mobile"
    
    print(f"🖥️  Desktop Version: {desktop_url}")
    print(f"📱 Mobile Version:  {mobile_url}")
    print()
    
    print("📲 How to Access on Your Phone:")
    print("1. Make sure your phone is on the same WiFi network")
    print("2. Open your phone's web browser")
    print(f"3. Go to: {mobile_url}")
    print("4. Add to home screen for app-like experience")
    print()
    
    print("📱 QR Code for Mobile Access:")
    print_qr_code(mobile_url)
    print()
    
    print("💡 Tips:")
    print("- Use the mobile version for best phone experience")
    print("- Enable notifications in your browser")
    print("- Add to home screen for offline use")
    print("- Keep both devices on the same network")
    print()
    
    print("🚀 Starting server...")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask server
    os.system(f"python3 app.py")

if __name__ == "__main__":
    main()
