const fmt = (n) =>
  n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function BreakdownTable({ lines, total }) {
  return (
    <table className="breakdown-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Detail</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line, i) => (
          <tr key={i}>
            <td>{line.label}</td>
            <td className="detail">{line.detail}</td>
            <td className="amount">${fmt(line.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="2">Total</td>
          <td className="amount total">${fmt(total)}</td>
        </tr>
      </tfoot>
    </table>
  )
}
