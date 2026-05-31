import { useState } from 'react'
import WholesaleCalculator from './components/WholesaleCalculator'
import CommercialCalculator from './components/CommercialCalculator'
import Disclaimer from './components/Disclaimer'
import './App.css'

export default function App() {
  const [mode, setMode] = useState('wholesale')

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">RTR Fee Calculator</h1>
        <p className="subtitle">Estimate Real-Time Rail transaction costs</p>
      </header>

      <div className="mode-toggle">
        <button
          className={`toggle-btn ${mode === 'wholesale' ? 'active' : ''}`}
          onClick={() => setMode('wholesale')}
        >
          Wholesale
          <span className="toggle-sub">Operator → Bank</span>
        </button>
        <button
          className={`toggle-btn ${mode === 'commercial' ? 'active' : ''}`}
          onClick={() => setMode('commercial')}
        >
          Commercial
          <span className="toggle-sub">Bank → Business</span>
        </button>
      </div>

      <main className="main">
        {mode === 'wholesale' ? <WholesaleCalculator /> : <CommercialCalculator />}
      </main>

      <Disclaimer />
    </div>
  )
}
