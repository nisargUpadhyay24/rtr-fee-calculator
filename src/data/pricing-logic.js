// Wholesale fees are sourced from FedNow public pricing (Federal Reserve, 2022).
// Canadian RTR pricing is not yet publicly disclosed by Payments Canada as of 2026 —
// US FedNow benchmarks are used as illustrative proxies only.
// Commercial fees are illustrative market estimates, not quoted rates.

// --- Wholesale (Operator → Bank) ---

// Per-item fees by ISO 20022 message type.
// Source: FedNow public pricing (Federal Reserve, 2022).
export const WHOLESALE_MESSAGE_TYPES = [
  {
    name: 'Credit Transfer',
    isoType: 'pacs.008',
    fee: 0.045,
    description: 'Standard credit push payment',
  },
  {
    name: 'Request for Payment',
    isoType: 'pain.013',
    fee: 0.01,
    description: 'Payment initiation request',
  },
  {
    name: 'Return',
    isoType: 'pacs.004',
    fee: 0.045,
    description: 'Payment return / reversal',
  },
]

// Monthly participation fee per routing transit number.
// Source: FedNow public pricing (Federal Reserve, 2022) — $25/mo flat.
export const WHOLESALE_PARTICIPATION_FEE = 25

export function calcWholesale({ volume, messageTypeName }) {
  const msgType = WHOLESALE_MESSAGE_TYPES.find((m) => m.name === messageTypeName)
  const perItemFee = volume * msgType.fee
  const total = perItemFee + WHOLESALE_PARTICIPATION_FEE

  return {
    messageType: msgType,
    lines: [
      {
        label: `Per-item fee (${msgType.isoType})`,
        detail: `${volume.toLocaleString('en-CA')} × $${msgType.fee.toFixed(3)}`,
        amount: perItemFee,
      },
      {
        label: 'Participation fee',
        detail: 'Monthly flat fee per routing transit',
        amount: WHOLESALE_PARTICIPATION_FEE,
      },
    ],
    total,
  }
}

// --- Commercial (Bank → Business) ---

// SMB flat rate. Benchmark range: $0.50–$1.50/txn. Midpoint used here.
export const COMMERCIAL_SMB_RATE = 1.0

// Enterprise volume tiers. Illustrative market estimates adapted from US RTP/FedNow
// commercial pricing. Canadian RTR commercial pricing pending Payments Canada publication.
export const COMMERCIAL_ENTERPRISE_TIERS = [
  {
    name: 'Tier 1',
    label: '1 – 50,000 txns/mo',
    minVolume: 1,
    maxVolume: 50_000,
    perTransaction: 0.4,
  },
  {
    name: 'Tier 2',
    label: '50,001 – 250,000 txns/mo',
    minVolume: 50_001,
    maxVolume: 250_000,
    perTransaction: 0.25,
  },
  {
    name: 'Tier 3',
    label: '250,001+ txns/mo',
    minVolume: 250_001,
    maxVolume: Infinity,
    perTransaction: 0.15,
  },
]

// Monthly API/Gateway SaaS fee for ERP integration.
export const COMMERCIAL_API_SAAS_FEE = 250

export function calcCommercial({ volume, customerType, includeApiSaas }) {
  const apiSaas = includeApiSaas ? COMMERCIAL_API_SAAS_FEE : 0

  if (customerType === 'smb') {
    const txnFee = volume * COMMERCIAL_SMB_RATE
    const total = txnFee + apiSaas
    return {
      customerType: 'smb',
      tier: null,
      lines: [
        {
          label: 'SMB flat rate',
          detail: `${volume.toLocaleString('en-CA')} × $${COMMERCIAL_SMB_RATE.toFixed(2)}`,
          amount: txnFee,
        },
        ...(includeApiSaas
          ? [{ label: 'API / Gateway SaaS', detail: 'ERP integration — monthly flat', amount: apiSaas }]
          : []),
      ],
      total,
    }
  }

  // Enterprise: rate determined by volume band
  const tier = COMMERCIAL_ENTERPRISE_TIERS.find(
    (t) => volume >= t.minVolume && volume <= t.maxVolume
  )
  const txnFee = volume * tier.perTransaction
  const total = txnFee + apiSaas

  return {
    customerType: 'enterprise',
    tier,
    lines: [
      {
        label: `Enterprise ${tier.name}`,
        detail: `${volume.toLocaleString('en-CA')} × $${tier.perTransaction.toFixed(2)}`,
        amount: txnFee,
      },
      ...(includeApiSaas
        ? [{ label: 'API / Gateway SaaS', detail: 'ERP integration — monthly flat', amount: apiSaas }]
        : []),
    ],
    total,
  }
}
