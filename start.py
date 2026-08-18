import os
import sys
import subprocess
import webbrowser
import time

def main():
    print("=========================================================")
    print("🚀 FINBOT AI: INSTITUTIONAL WEALTH DESK LAUNCHER")
    print("=========================================================")
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("\n[1/2] Launching Backend & Integrated Web Desk on Port 8000...")
    cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    
    proc = subprocess.Popen(cmd, cwd=backend_dir)
    time.sleep(2)

    url = "http://localhost:8000"
    print(f"\n[2/2] Opening {url} in your default web browser...")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not auto-open browser: {e}")

    print("\n✅ FinBot AI is LIVE at http://localhost:8000")
    print("Press Ctrl+C in this terminal to stop the server.\n")

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down FinBot AI server...")
        proc.terminate()

if __name__ == "__main__":
    main()
