# 🏛️ FinBot AI: End-to-End Technical Report & System Architecture Specification

> **Architectural Blueprint, Quantitative Mathematical Formulations, API Specifications, and Production Readiness Audit.**
> *Refined Specification for Recruiter Audits, Code Reviews, and LLM Context Exchange (Claude / GPT-4 / Gemini).*

---

## 📋 Executive Overview

**FinBot AI** is an institutional-grade, recruiter-ready **Quantitative Wealth Management & Financial Advisory Platform**. It translates investor financial prompts into statistical asset allocations backed by:
- **Markowitz Modern Portfolio Theory (MPT)** Efficient Frontier optimization (SciPy SLSQP quadratic solver).
- **1,000-Path Stochastic Monte Carlo Simulations** utilizing Geometric Brownian Motion with Box-Muller random shocks.
- **Historical Crisis Stress-Testing** evaluating drawdowns under the 2008 GFC, 2020 COVID shock, and 2022 Inflation rate crisis.
- **Indian Tax-Loss Harvesting Engine** (Section 80C ELSS tax deduction & LTCG ₹1.25L exemption rules).
- **Single-Port FastAPI Production Architecture** serving both backend REST APIs and compiled React static assets on port `8000`.

---

## 🏗️ End-to-End System Architecture

```mermaid
graph TD
    Client["Browser / Client (React 18 Desk)"] -->|HTTP / REST| SinglePortServer["FastAPI Single-Port Server (Port 8000)"]
    
    subgraph FastAPI Backend App
        SinglePortServer --> Router["Chat & Portfolio Router (backend/app/routers/chat_router.py)"]
        SinglePortServer --> StaticMount["StaticFiles Mount (frontend/dist)"]
        
        Router --> LLMService["Intent Classifier & Entity Parser (backend/app/services/llm_service.py)"]
        Router --> PortfolioService["Quantitative Engine (backend/app/services/portfolio_service.py)"]
        Router --> MPTService["SciPy MPT Optimizer (backend/app/services/mpt_service.py)"]
        Router --> StressService["Crash Stress Test Engine (backend/app/services/stress_test_service.py)"]
        Router --> TaxService["Section 70/71 Tax Engine (backend/app/services/tax_service.py)"]
        Router --> MarketService["Live Market Streamer (backend/app/services/market_data_service.py)"]
        Router --> PDFService["Printable Report Exporter (backend/app/services/pdf_report_service.py)"]
    end
    
    subgraph Data & Math Models
        MPTService --> SLSQPSolver["scipy.optimize.minimize (SLSQP)"]
        PortfolioService --> MonteCarlo["Box-Muller GBM Simulation (1,000 Paths)"]
        MarketService --> IndianTickers["NSE / BSE Tickers (NIFTY 50, SENSEX, RELIANCE, TCS)"]
    end
```

---

## 🧮 Quantitative Mathematical Formulations

### 1. Markowitz Modern Portfolio Theory (MPT) Efficient Frontier
The portfolio expected return $E(R_p)$ and portfolio variance $\sigma_p^2$ for $n$ assets with weights $w = [w_1, w_2, \dots, w_n]^T$ are given by:

$$E(R_p) = w^T \mu = \sum_{i=1}^n w_i \mu_i$$

$$\sigma_p^2 = w^T \Sigma w = \sum_{i=1}^n \sum_{j=1}^n w_i w_j \sigma_{ij}$$

Subject to constraints:
$$\sum_{i=1}^n w_i = 1, \quad w_i \ge 0 \quad \forall i$$

#### Tangency Portfolio (Maximum Sharpe Ratio)
$$\max_{w} \text{Sharpe}(w) = \frac{w^T \mu - R_f}{\sqrt{w^T \Sigma w}}$$
Solved using `scipy.optimize.minimize` with method `'SLSQP'`.

---

### 2. Stochastic Monte Carlo Engine (Geometric Brownian Motion)
Asset price paths $S_t$ are modeled using the stochastic differential equation:

$$dS_t = \mu S_t dt + \sigma S_t dW_t$$

Discrete solution using Box-Muller standard normal random shocks $Z_t \sim \mathcal{N}(0, 1)$:

$$S_{t+\Delta t} = S_t \exp\left( \left(\mu - \frac{\sigma^2}{2}\right) \Delta t + \sigma \sqrt{\Delta t} \, Z_t \right)$$

Evaluated over 1,000 paths across 1–35 year horizons to derive the 10th percentile (Bear Case), 50th percentile (Median Case), and 90th percentile (Bull Case) wealth bounds.

---

### 3. Parametric Value at Risk (VaR 95%) & Horizon Scaling Footnote
- **Single-Period Parametric VaR (95% Confidence)**:
  $$\text{VaR}_{95\%, 1\text{yr}} = 1.645 \cdot \sigma_p - \mu_p$$
- **Multi-Period Horizon Scaling Footnote**:
  For multi-year horizons $T$, time-scaling is applied via square-root rule:
  $$\text{VaR}_{95\%, T} = 1.645 \cdot \sigma_p \sqrt{T} - \mu_p T$$

---

## 📁 Repository Directory & Module Map

```
./
├── README.md                          # Executive README with quickstart & badges
├── E2E_TECHNICAL_REPORT.md            # Detailed technical specification (this document)
├── start.py                           # 1-Click launcher script (builds frontend & runs Uvicorn)
├── start.sh                           # Shell wrapper for start.py
├── docker-compose.yml                 # Docker container setup
├── backend/
│   ├── app/
│   │   ├── main.py                    # Single-Port FastAPI app & StaticFiles mount
│   │   ├── models/
│   │   │   └── portfolio_models.py    # Pydantic schemas (PortfolioMetrics, MonteCarloRequest)
│   │   ├── routers/
│   │   │   └── chat_router.py         # All REST API endpoints (/api/chat, /api/portfolio/*)
│   │   └── services/
│   │       ├── portfolio_service.py   # Core math metrics & Monte Carlo engine
│   │       ├── mpt_service.py         # Markowitz Efficient Frontier SciPy solver
│   │       ├── stress_test_service.py # 2008, 2020, 2022 historical crisis simulator
│   │       ├── tax_service.py         # Section 80C ELSS & LTCG exemption calculator
│   │       ├── market_data_service.py # Non-blocking live Indian ticker feed (NSE/BSE)
│   │       ├── llm_service.py         # Natural Language Intent & Entity Parser
│   │       └── pdf_report_service.py  # Printable HTML/PDF report template generator
│   └── test_backend.py                # Python unittest automated test suite
└── frontend/
    ├── package.json                   # React 18 + Emotion + Chart.js dependencies
    ├── vite.config.js                 # Vite config (host: 0.0.0.0, port: 5173, CORS enabled)
    ├── dist/                          # Compiled production static bundle
    └── src/
        ├── App.jsx                    # Header, Bloomberg theme, & 6-tab navigation
        ├── theme.js                   # Institutional dark palette (#0b0f17, IBM Plex)
        ├── services/
        │   ├── api.js                 # Chat POST request handler
        │   └── apiConfig.js           # Dynamic window.location.origin resolver
        └── components/
            ├── MarketTickerTape.jsx   # Top ticker tape with NSE/BSE stock sparklines
            ├── WelcomeScreen.jsx      # Launchpad screen with Indian investment presets
            ├── ChatInterface.jsx      # Conversational AI terminal with preset pills
            ├── PortfolioDisplay.jsx   # High-density metrics grid & allocation doughnut
            ├── WealthSimulator.jsx    # Interactive 1,000-path Monte Carlo line chart
            ├── EfficientFrontierStressTest.jsx # MPT scatter plot & crisis cards
            ├── TaxHarvestingWidget.jsx# Tax & Savings Guide with Section 80C & LTCG cards
            └── RiskQuizModal.jsx      # 5-question quantitative risk questionnaire
```

---

## 🔍 Precise Architectural Clarification: Natural Language Intent & Entity Parser (`llm_service.py`)

`llm_service.py` is engineered as a **hybrid Natural Language Processing (NLP) & Rule-Based Fallback Parser**:
- **Primary Dual Execution**: Supports dynamic LLM API dispatch (OpenAI / Gemini) when API keys are configured in environment variables.
- **Deterministic Rule Engine**: When unauthenticated, it utilizes regex currency normalizers (`50k` $\rightarrow 50,000$, `5 Lakh` $\rightarrow 500,000$), question keyword priority flags (`explain`, `what is`), and financial term dictionary matching to classify user intent without external latency.

---

## ⚖️ Tax Legislation Disclaimer Footnote

> **Tax Legislation Notice**: Tax rules implemented in `tax_service.py` (Section 80C ELSS ₹1.5 Lakh annual deduction cap and Section 112A LTCG ₹1.25 Lakh tax-exempt profit threshold) reflect the Indian **Finance Act 2024**. Future Union Budget amendments require re-validation of rate parameters in `tax_service.py`.

---

## 🔒 Security Architecture & Production Hardening Roadmap

While designed for self-contained single-port hackathon evaluation, production hardening requires:
1. **Authentication & Authorization**: Integration of `OAuth2PasswordBearer` with JWT access tokens.
2. **Rate Limiting**: Redis Token Bucket rate limiting (`100 req/min` per IP) via `slowapi`.
3. **Session Store**: Session state migration from in-memory dictionary to Redis / PostgreSQL.

---

## 🌐 Complete REST API Endpoint Specification

All endpoints are hosted on `http://localhost:8000`:

| Method | Endpoint Path | Request Body Schema | Response Output Schema | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | `{"message": str, "session_id": str}` | `{"response_type": str, "content": str, "portfolio_data": dict}` | Conversational advisory & portfolio builder |
| `GET` | `/api/market/tickers` | None | `{"status": "success", "tickers": List[dict]}` | Streams live Indian stock sparklines (NIFTY 50, SENSEX, RELIANCE, TCS) |
| `POST` | `/api/portfolio/simulate` | `{"initial_capital": float, "monthly_contribution": float, "time_horizon_years": int, "risk_level": str}` | `{"years": List[int], "principal": List[float], "median_path": List[float], "bull_path": List[float], "bear_path": List[float]}` | 1,000-path stochastic Monte Carlo simulation |
| `GET` | `/api/portfolio/mpt-efficient-frontier` | None | `{"frontier": List[dict], "tangency_portfolio": dict, "min_volatility_portfolio": dict}` | Calculates Markowitz Efficient Frontier curve points via SLSQP |
| `POST` | `/api/portfolio/stress-test` | `{"capital": float, "allocation": List[dict]}` | `{"scenarios": List[dict]}` | Simulates portfolio drawdown under 2008 GFC, 2020 COVID, and 2022 Inflation shocks |
| `POST` | `/api/portfolio/tax-harvesting` | `{"realized_gains": float, "unrealized_losses": float, "holding_period_days": int}` | `{"gain_type": str, "tax_before_harvest": float, "tax_after_harvest": float, "tax_saved": float, "recommendation": str}` | Computes Section 70/71 Income Tax Act loss offset savings |
| `POST` | `/api/portfolio/export-report` | `PortfolioData` | `{"status": "success", "html": str}` | Generates printable institutional PDF wealth report HTML |
| `POST` | `/api/risk-quiz` | `{"q1": int, "q2": int, ...}` | `{"score": int, "risk_appetite": str, "description": str}` | Evaluates investor risk profiling score |

---

## 🧪 Automated Test Verification (`unittest`)

Executed via `python3 test_backend.py`:

```
........
----------------------------------------------------------------------
Ran 8 tests in 0.244s

OK
```

Test suite coverage (`TestFinBotQuantSuite`):
1. `test_portfolio_math`: Asserts positive Sharpe ratio and expected returns.
2. `test_monte_carlo`: Asserts median wealth growth > principal invested over 10-year horizon.
3. `test_market_tickers`: Asserts minimum 8 tickers returned with valid sparkline arrays.
4. `test_llm_fallback`: Asserts entity parser correctly extracts numeric capital and risk appetite.
5. `test_mpt`: Asserts SciPy SLSQP solver yields >5 frontier points and positive Sharpe ratio.
6. `test_stress_test`: Asserts historical crash drawdown calculations across 3 crisis scenarios.
7. `test_pdf_report`: Asserts HTML report rendering contains target portfolio values.
8. `test_edge_cases`: Asserts Pydantic `ValidationError` exception handling on negative inputs (`capital=-50000`) and single-asset degenerate allocations.

---

## 💻 Developer Setup Commands

To launch FinBot AI on any machine with 1 command:

```bash
python3 start.py
```

The script builds the React distribution, launches Uvicorn on port `8000`, and opens **`http://localhost:8000`** directly in the default web browser!
