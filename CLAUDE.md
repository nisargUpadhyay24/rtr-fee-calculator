# RTR Fee Calculator

## What this is
A fee calculator for Canadian Real-Time Rail (RTR) transactions.
Target user: payments professional estimating transaction costs
before initiating an RTR payment.

## Tech stack
- React + Vite
- No external UI libraries
- Clean, minimal, intuitive UI

## App structure
The calculator has two modes (user toggles between them):
1. Wholesale (Operator → Bank) — fee from the central operator
2. Commercial (Bank → Business) — fee a business pays its bank

## Data
All pricing logic, tiers, and benchmarks stored in
src/data/pricing-logic.js as structured constants.

## Output
For any calculation, show:
- Total fee
- Line-item breakdown (per-item, monthly, API/gateway, etc.)
- Tier or pricing model applied

## Constraints
- Never modify CLAUDE.md unless explicitly asked
- Pricing values are benchmarks, not legal/quoted rates —
  include a disclaimer in the UI
