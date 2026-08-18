# FinBot AI | Institutional Wealth Management & Quantitative Analytics Platform

> **A full-stack, recruiter-grade financial advisory desk built with FastAPI, React, Chart.js, and Stochastic Monte Carlo Simulation Engines.**

---

## 🌟 Executive Overview

**FinBot AI** is an institutional-grade wealth management and financial analytics desk engineered for quantitative asset allocation, risk-adjusted yield modeling, and real-time market data insights.

Designed for high performance, high density, and strict financial precision, FinBot transforms raw investor input into actionable asset allocation strategies backed by statistical metrics like the **Sharpe Ratio**, **Value at Risk (VaR 95%)**, **Max Drawdown**, and **1,000-Path Stochastic Monte Carlo Simulations**.

---

## 🛠 Tech Stack & Architecture

### Backend Architecture (FastAPI & Financial Math)
- **Framework**: FastAPI (Python 3.11) with Uvicorn ASGI server
- **Data Validation**: Pydantic v2 schemas for quantitative models
- **Financial Analytics**: Stochastic Monte Carlo Engine (Geometric Brownian Motion / Box-Muller transform)
- **Session & Intent Engine**: Regex entity extraction & LLM fallback parser with SQLite persistence
- **Testing**: Native Python test suite (`test_backend.py`)

### Frontend Architecture (React & Financial UX)
- **Framework**: React 18 + Vite
- **Data Visualization**: Chart.js (`react-chartjs-2`) for Monte Carlo line projections & asset allocation doughnuts
- **Styling**: Emotion CSS-in-JS (Institutional Terminal Dark Theme: `#0b0f17` slate, crisp `2px` corners, zero drop shadow bloat)
- **State Management**: React Hooks & Context API for session stability

---

## 🚀 Key Modules & Differentiators

### 1. 📈 Live Market Ticker Streaming
- Real-time stock, crypto, and index feeds (NIFTY 50, S&P 500, Nasdaq 100, NVIDIA, Apple, Bitcoin, Gold) with intraday price sparkline arrays.

### 2. 💬 Conversational AI Financial Advisor
- Structured intent classification and entity extraction (`capital`, `monthly_investment`, `risk_appetite`, `preferred_tools`).
- Intelligent dual-mode backend: operates seamlessly both online with LLM providers and offline via a deterministic quantitative rule fallback engine.

### 3. 🛡️ Institutional Risk & Portfolio Command Center
- Evaluates portfolios on risk-adjusted quantitative metrics:
  - **Sharpe Ratio**: Risk-adjusted excess return evaluation
  - **Annual Volatility (%)** & **Expected Yield (%)**
  - **Value at Risk (VaR 95%)**: Maximum expected tail-risk loss
  - **Max Drawdown (%)** & **Beta vs Benchmark**
- Multi-asset class allocation breakdown (Direct Equities, Equity Mutual Funds, AAA Debt Instruments, Sovereign Gold Bonds).

### 4. 🎲 Stochastic Monte Carlo Wealth Simulator
- Executes 1,000 stochastic iteration paths over 1–35 year investment horizons.
- Visualizes 10th percentile (Bear Case), 50th percentile (Median Case), and 90th percentile (Bull Case) growth boundaries against total principal invested.

### 5. 📋 Quantitative Risk Evaluator Quiz
- 5-question investor risk profiling questionnaire measuring capital preservation goals, draw-down tolerance, and liquidity requirements.

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Run Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Terminal will be live at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

To run the backend test suite verifying portfolio math, Monte Carlo bounds, market ticker streaming, and intent parsing:
```bash
cd backend
python3 test_backend.py
```

---

## 🐳 Docker Deployment

Run both backend FastAPI and frontend Nginx containers with one command:
```bash
docker-compose up --build
```
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`

---

## 📤 Publishing to GitHub Account (`dhruv0402`)

To publish this upgraded codebase to your personal GitHub repository (`dhruv0402/Finbot-Hackathon`):

```bash
# 1. Stage all changes
git add .

# 2. Commit the overhaul
git commit -m "feat: complete institutional wealth desk overhaul with Monte Carlo simulator and quantitative analytics"

# 3. Set remote origin to your GitHub account repository
git remote set-url origin https://github.com/dhruv0402/Finbot-Hackathon.git

# 4. Push to main branch
git push -u origin main
```
