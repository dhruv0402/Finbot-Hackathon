# FinBot AI | Institutional Wealth Management & Quantitative Analytics Platform

> **A recruiter-grade financial advisory desk & quantitative analytics engine built with FastAPI, SciPy, React, Chart.js, and Stochastic Monte Carlo Simulation.**

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-brightgreen.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/react-18.2-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg)](https://fastapi.tiangolo.com/)
[![CI Pipeline](https://github.com/dhruv0402/Finbot-Hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/dhruv0402/Finbot-Hackathon/actions)

---

## 🌟 Executive Overview

**FinBot AI** is a recruiter-grade wealth management and financial analytics desk engineered for quantitative asset allocation, Markowitz Efficient Frontier optimization, tax-loss harvesting, and historical crisis stress testing.

Designed with an institutional Bloomberg Terminal aesthetic (`#0b0f17` dark slate, zero drop shadows, crisp `2px` radii, IBM Plex typography), FinBot turns raw investor prompts into statistical portfolios backed by **Sharpe Ratios**, **Value at Risk (VaR 95%)**, **Max Drawdown**, and **1,000-Path Stochastic Monte Carlo Simulations**.

---

## 🛠 Tech Stack & Architecture

### Backend Architecture (FastAPI & Quantitative Math)
- **Framework**: FastAPI (Python 3.11) with Uvicorn ASGI server
- **Mathematical Solvers**: SciPy (`scipy.optimize.minimize` SLSQP solver for Markowitz MPT Efficient Frontier optimization)
- **Live Market Data**: Yahoo Finance API integration streaming real-time NSE/BSE quotes (NIFTY 50, SENSEX, RELIANCE, TCS, HDFC BANK, INFY)
- **Stochastic Engine**: Geometric Brownian Motion with Box-Muller random shocks (1,000-path 35-year simulations)
- **Report Generator**: Institutional HTML/PDF Wealth Planning Exporter with regulatory disclaimers
- **Single-Port Delivery**: Mounts compiled React `dist/` directly on root `/` for zero-CORS single-port execution

### Frontend Architecture (React & Financial UX)
- **Framework**: React 18 + Vite
- **Data Visualization**: Chart.js (`react-chartjs-2`) for Monte Carlo line projections & asset allocation doughnuts
- **Styling**: Emotion CSS-in-JS (Dark Charcoal Slate theme, IBM Plex Mono & IBM Plex Sans)
- **Navigation**: 6 Executive Desks (`[1] ASK FINBOT`, `[2] PORTFOLIO PLAN`, `[3] SIP WEALTH ENGINE`, `[4] RISK & FRONTIER`, `[5] TAX & SAVINGS GUIDE`, `[6] RISK QUIZ`)

---

## 🚀 Executive Features

### 1. 📐 Markowitz Modern Portfolio Theory (MPT) Optimization
- Solves for the **Efficient Frontier Risk vs Return Curve**.
- Computes the **Tangency Portfolio (Maximum Sharpe Ratio)** and **Minimum Variance Portfolio**.

### 2. ⚡ Historical Crisis Stress-Testing Engine
- Simulates portfolio drawdowns under 3 historical market shocks:
  - **2008 Global Financial Crisis** (-52.5% equity, +8.5% debt, +21.0% gold)
  - **2020 COVID Flash Shock** (-38.0% equity, +4.2% debt, +12.8% gold)
  - **2022 Inflation & Rate Crisis** (-24.5% equity, -4.8% debt, -1.5% gold)

### 3. 💡 Indian Tax & Savings Guide (Section 80C & LTCG)
- **Section 80C ELSS Savings**: Computes tax savings up to ₹46,800/yr on ₹1.5L ELSS investments.
- **LTCG Exemption Exemption**: Accounts for ₹1.25 Lakh tax-free profit exemption rule per year.
- **Tax-Loss Harvesting Calculator**: Offsets stock losses against gains to minimize net taxable income.

### 4. 📄 Printable Institutional PDF Wealth Report Exporter
- 1-click generation of printable wealth planning reports formatted with risk metrics, allocation tables, stress test outcomes, and regulatory disclaimers.

---

## ⚡ Single-Command Quickstart

### Option A: Single-Port Execution (Recommended)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Open **`http://localhost:8000`** in your browser — both the React frontend and FastAPI backend run seamlessly on a single port!

### Option B: Docker Deployment
```bash
docker-compose up --build
```
Open **`http://localhost:8000`**.

---

## 🧪 Automated Test Verification

Run the 7 automated backend test suites:
```bash
cd backend
python3 test_backend.py
```
- ✅ **Test 1**: Portfolio Math & Sharpe Ratio Metrics
- ✅ **Test 2**: 1,000-Path Monte Carlo Wealth Engine
- ✅ **Test 3**: Live Market Ticker Streaming Feed
- ✅ **Test 4**: Entity & Intent Classification Parser
- ✅ **Test 5**: SciPy Markowitz MPT Efficient Frontier Curve
- ✅ **Test 6**: Historical Crisis Drawdown Stress Tests
- ✅ **Test 7**: Branded HTML/PDF Report Exporter

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
