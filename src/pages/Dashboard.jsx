import { AGENTS, STATUS, agentStatus } from '../agents.js'
import { useStore } from '../store.jsx'

export default function Dashboard({ go }) {
  const { state } = useStore()
  const open = state.missions.filter((m) => m.status === 'aberta')
  return (
    <>
      <h2>Central de comando</h2>
      <p className="mut">Estados reais: nenhuma IA está conectada por API nesta versão (Fase 1). Todas participam em modo manual.</p>
      <div className="grid">
        {AGENTS.map((a) => {
          const st = agentStatus(a, state.missions)
          return (
            <div className="card" key={a.id}>
              <div className="row"><strong>{a.name}</strong><span className={`badge ${st}`}>{STATUS[st]}</span></div>
              <div className="mut">{a.role}</div>
              <p>{a.desc}</p>
            </div>
          )
        })}
      </div>
      <div className="grid">
        <div className="card"><div className="mut">Missões abertas</div><h3>{open.length}</h3></div>
        <div className="card"><div className="mut">Mensagens</div><h3>{state.messages.length}</h3></div>
        <div className="card"><div className="mut">Registros</div><h3>{state.logs.length}</h3></div>
      </div>
      <button className="primary" onClick={() => go('missoes')}>Nova missão</button>
    </>
  )
}
