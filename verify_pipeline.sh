#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================================="
echo "🧪 FINBOT AI: PRE-COMMIT LOCAL VERIFICATION PIPELINE"
echo "=========================================================="

echo "[1/4] Checking Python Syntax..."
python3 -m py_compile backend/app/main.py
for f in backend/app/services/*.py; do
    python3 -m py_compile "$f"
done
echo "  ✅ Python compilation clean."

echo "[2/4] Running Backend Quant, RAG & MarketProbe Tests..."
cd backend
python3 test_backend.py
cd ..
echo "  ✅ All 11 unit tests passed."

echo "[3/4] Building Frontend Distribution..."
cd frontend
npm run build
cd ..
echo "  ✅ Frontend build verified."

echo "[4/4] Verifying Single-Port Mount Files..."
test -f frontend/dist/index.html || (echo "❌ frontend/dist/index.html missing!" && exit 1)
echo "  ✅ Single-port static files verified."

echo "=========================================================="
echo "🎉 PIPELINE PASSED! Safe to git commit and push."
echo "=========================================================="
