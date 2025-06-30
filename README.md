# Risk-Engine-LLM

Risk-Engine-LLM is an AI-powered microservice that evaluates fraud risk for payment transactions using rule-based heuristics. It simulates a real-world fraud scoring engine focused on explainability and modularity. Built with Node.js, TypeScript, and Express, it uses LLMs to generate human-readable risk explanations.

---

## 📁 Project Structure (So far)

- `src/routes/` – API routes (e.g. `/evaluate-risk`)
- `src/services/` – Business logic and LLM integration
- `src/rules/` – Rule-based fraud scoring heuristics
- `src/utils/` – Utility helpers (e.g. IP tracking)

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install

```

## Project Structure Explanation

**src/index.ts**
- Entry point for the Express server. Sets up middleware and mounts the `/evaluate-risk` endpoint.

**src/routes/evaluateRisk.ts**
- Defines the POST `/evaluate-risk` endpoint. Validates input and delegates risk evaluation to the service layer.

**src/services/riskService.ts**
- Contains the main logic for evaluating payment risk. Aggregates results from various heuristics and utilities to produce a risk score and level.

**src/rules/heuristics.ts**
- Implements individual fraud detection rules, such as checking for high-risk email domains and large transactions.

**src/utils/ipDeviceTracker.ts**
- Provides in-memory tracking for IP addresses and device fingerprints to help identify repeat usage patterns that may indicate fraud.
