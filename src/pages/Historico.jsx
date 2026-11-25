import { useStore, exportJSON, fmt } from '../store.jsx'

export default function Historico() {
  const { state } = useStore()
  return (
    <>
      <h2>Histórico</h2>
      <button className="primary" onClick={() => exportJSON(state)}>Exportar histórico (JSON)</button>
      <div className="card">
        {state.logs.length === 0 && <div className="mut">Sem registros.</div>}
        {state.logs.map((l) => <div key={l.id} className="msg"><span className="mut">{fmt(l.at)}</span> — {l.text}</div>)}
      </div>
    </>
  )
}
