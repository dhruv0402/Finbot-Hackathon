import os
import sys
import subprocess
import webbrowser
import time

def main():
    print("\n=========================================================")
    print("🚀 FINBOT AI: 1-CLICK PRODUCTION LAUNCHER")
    print("=========================================================\n")
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")
    backend_dir = os.path.join(root_dir, "backend")

    print("[1/3] Building production frontend bundle...")
    try:
        subprocess.run(["npx", "vite", "build"], cwd=frontend_dir, check=True)
        print("  ✅ Frontend bundle built successfully.")
    except Exception as e:
        print(f"  ⚠️ Warning: Could not run vite build, using existing dist: {e}")

    print("\n[2/3] Launching FinBot Server on http://localhost:8000...")
    cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    
    proc = subprocess.Popen(cmd, cwd=backend_dir)
    time.sleep(2.5)

    url = "http://localhost:8000"
    print(f"\n[3/3] Opening {url} in your web browser...")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"  Note: Please open {url} manually in Chrome/Safari.")

    print("\n🎉 FinBot AI is LIVE and running on http://localhost:8000!")
    print("   Press Ctrl+C to stop the server.\n")

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down FinBot AI...")
        proc.terminate()

if __name__ == "__main__":
    main()
