import { useState } from 'react'
import {
  calcCommercial,
  COMMERCIAL_ENTERPRISE_TIERS,
  COMMERCIAL_SMB_RATE,
  COMMERCIAL_API_SAAS_FEE,
} from '../data/pricing-logic'
import BreakdownTable from './BreakdownTable'

export default function CommercialCalculator() {
  const [volume, setVolume] = useState('')
  const [customerType, setCustomerType] = useState('smb')
  const [includeApiSaas, setIncludeApiSaas] = useState(false)

  const vol = parseInt(volume, 10)
  const isInvalid = volume !== '' && (volume.includes('.') || parseFloat(volume) < 0)
  const result = !isInvalid && vol > 0 ? calcCommercial({ volume: vol, customerType, includeApiSaas }) : null

  const badgeText = result
    ? result.customerType === 'smb'
      ? `SMB — $${COMMERCIAL_SMB_RATE.toFixed(2)}/txn flat`
      : `Enterprise ${result.tier.name} — ${result.tier.label}`
    : null

  return (
    <div className="calculator">
      <div className="inputs">
        <div className="field">
          <label htmlFor="c-volume">Monthly transaction volume</label>
          <input
            id="c-volume"
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          {isInvalid && (
            <span className="field-error">Volume must be a positive whole number</span>
          )}
        </div>
        <div className="field">
          <label>Customer type</label>
          <div className="plan-options">
            <button
              className={`plan-btn ${customerType === 'smb' ? 'active' : ''}`}
              onClick={() => setCustomerType('smb')}
            >
              <span className="plan-name">SMB</span>
              <span className="plan-meta">$1.00/txn flat · range $0.50–$1.50</span>
            </button>
            <button
              className={`plan-btn ${customerType === 'enterprise' ? 'active' : ''}`}
              onClick={() => setCustomerType('enterprise')}
            >
              <span className="plan-name">Enterprise</span>
              <span className="plan-meta">Volume tiers · $0.40 → $0.15</span>
            </button>
          </div>
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={includeApiSaas}
            onChange={(e) => setIncludeApiSaas(e.target.checked)}
          />
          Include API / Gateway SaaS fee (${COMMERCIAL_API_SAAS_FEE}/mo — ERP integration)
        </label>
      </div>

      {result && (
        <div className="result">
          <div className="result-header">
            <div className="result-total">
              <span className="result-label">Estimated monthly cost</span>
              <span className="result-amount">
                ${result.total.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="result-badge">{badgeText}</div>
          </div>
          <BreakdownTable lines={result.lines} total={result.total} />
        </div>
      )}

      <div className="tier-reference">
        <h3>Commercial rate reference</h3>
        <table className="tier-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Volume range</th>
              <th>Per transaction</th>
            </tr>
          </thead>
          <tbody>
            <tr className={customerType === 'smb' ? 'active-tier' : ''}>
              <td>SMB (flat)</td>
              <td>Any volume</td>
              <td>$1.00</td>
            </tr>
            {COMMERCIAL_ENTERPRISE_TIERS.map((tier) => (
              <tr
                key={tier.name}
                className={
                  customerType === 'enterprise' && result?.tier?.name === tier.name
                    ? 'active-tier'
                    : ''
                }
              >
                <td>Enterprise {tier.name}</td>
                <td>{tier.label}</td>
                <td>${tier.perTransaction.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">API / Gateway SaaS (optional)</td>
              <td>${COMMERCIAL_API_SAAS_FEE}/mo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
