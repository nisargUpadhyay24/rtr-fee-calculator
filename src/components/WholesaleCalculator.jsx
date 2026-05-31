import { useState } from 'react'
import { calcWholesale, WHOLESALE_MESSAGE_TYPES, WHOLESALE_PARTICIPATION_FEE } from '../data/pricing-logic'
import BreakdownTable from './BreakdownTable'

export default function WholesaleCalculator() {
  const [volume, setVolume] = useState('')
  const [messageTypeName, setMessageTypeName] = useState(WHOLESALE_MESSAGE_TYPES[0].name)

  const vol = parseInt(volume, 10)
  const isInvalid = volume !== '' && (volume.includes('.') || parseFloat(volume) < 0)
  const result = !isInvalid && vol > 0 ? calcWholesale({ volume: vol, messageTypeName }) : null

  return (
    <div className="calculator">
      <div className="inputs">
        <div className="field">
          <label htmlFor="w-volume">Monthly transaction volume</label>
          <input
            id="w-volume"
            type="number"
            min="0"
            placeholder="e.g. 50,000"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          {isInvalid && (
            <span className="field-error">Volume must be a positive whole number</span>
          )}
        </div>
        <div className="field">
          <label>Message type</label>
          <div className="plan-options">
            {WHOLESALE_MESSAGE_TYPES.map((mt) => (
              <button
                key={mt.name}
                className={`plan-btn ${messageTypeName === mt.name ? 'active' : ''}`}
                onClick={() => setMessageTypeName(mt.name)}
              >
                <span className="plan-name">{mt.name}</span>
                <span className="plan-meta">{mt.isoType} · ${mt.fee.toFixed(3)}/item</span>
              </button>
            ))}
          </div>
        </div>
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
            <div className="result-badge">
              {result.messageType.isoType} — {result.messageType.name}
            </div>
          </div>
          <BreakdownTable lines={result.lines} total={result.total} />
        </div>
      )}

      <div className="tier-reference">
        <h3>Message type reference</h3>
        <table className="tier-table">
          <thead>
            <tr>
              <th>Message type</th>
              <th>ISO type</th>
              <th>Description</th>
              <th>Per-item fee</th>
            </tr>
          </thead>
          <tbody>
            {WHOLESALE_MESSAGE_TYPES.map((mt) => (
              <tr
                key={mt.name}
                className={messageTypeName === mt.name ? 'active-tier' : ''}
              >
                <td>{mt.name}</td>
                <td>{mt.isoType}</td>
                <td>{mt.description}</td>
                <td>${mt.fee.toFixed(3)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3">Participation fee (per routing transit)</td>
              <td>${WHOLESALE_PARTICIPATION_FEE.toLocaleString('en-CA')}/mo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
