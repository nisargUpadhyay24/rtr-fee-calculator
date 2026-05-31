# RTR Fee Calculator

A fee estimator for Canadian Real-Time Rail (RTR) transactions, built for payments professionals who need to model transaction costs before initiating an RTR payment.

**Live app:** [rtr-fee-calculator.vercel.app](https://rtr-fee-calculator.vercel.app)

---

## What it does

The calculator covers two fee perspectives:

- **Wholesale (Operator → Bank):** estimates what a financial institution pays to participate in the RTR network — per-item fees by ISO 20022 message type (`pacs.008`, `pain.013`, `pacs.004`) plus the monthly participation fee.
- **Commercial (Bank → Business):** estimates what a business pays its bank — SMB flat rates or enterprise volume tiers, with an optional API/Gateway SaaS add-on for ERP integrations.

Enter a transaction volume, select the relevant inputs, and the calculator returns a total fee with a full line-item breakdown and the pricing tier applied.

## Why it was built

Canadian RTR pricing has not been publicly disclosed by Payments Canada as of 2026. Payments professionals evaluating RTR adoption have no quick reference for cost modelling. This tool fills that gap by surfacing US FedNow public benchmarks as illustrative proxies — clearly labelled as estimates, not quoted rates.

## Tech stack

- React 18
- Vite 6
- No external UI libraries — plain CSS

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Future additions

1. **PDF / CSV export** — let users download a formatted cost summary to share with finance or procurement teams.
2. **Side-by-side comparison** — compare wholesale vs. commercial costs at the same volume in a single view, useful for banks modelling pass-through margins.
3. **Payments Canada rate sync** — once Payments Canada publishes official RTR pricing, replace the FedNow proxies with a live or periodically updated data source and flag which figures are official vs. estimated.

---

> **Disclaimer:** All pricing values are benchmarks and illustrative market estimates, not legal or quoted rates. Wholesale figures are derived from FedNow public pricing (Federal Reserve, 2022). Commercial figures are illustrative estimates. Verify costs directly with Payments Canada and your financial institution before making business decisions.
