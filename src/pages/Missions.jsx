import { useState } from 'react'
import { AI, nameOf } from '../agents.js'
import { useStore, uid, now, fmt } from '../store.jsx'

const MODES = { individual: 'Individual', coletiva: 'Coletiva', diferenciada: 'Tarefas diferentes' }
const SLABEL = { pendente: 'Pendente', entregue: 'Entregue', aprovada: 'Aprovada', rejeitada: 'Rejeitada' }

function NewMission() {
  const { dispatch } = useStore()
  const [f, setF] = useState({ title: '', description: '', mode: 'coletiva', agents: ['claude'], tasks: {} })
  const [err, setErr] = useState('')
  const toggle = (id) =>
    setF((p) => ({
      ...p,
      agents: p.mode === 'individual' ? [id] : p.agents.includes(id) ? p.agents.filter((x) => x !== id) : [...p.agents, id],
    }))
  const submit = (e) => {
    e.preventDefault()
    const title = f.title.trim().slice(0, 120)
    if (!title) return setErr('Informe um título.')
    if (!f.agents.length) return setErr('Escolha ao menos um agente.')
    const description = f.description.trim().slice(0, 4000)
    const assignments = f.agents.map((agent) => ({
      agent, status: 'pendente', delivery: '', note: '',
      task: (f.mode === 'diferenciada' ? f.tasks[agent] || '' : description).trim() || title,
    }))
    dispatch({ type: 'addMission', mission: { id: uid(), title, description, status: 'aberta', createdAt: now(), assignments, history: [{ at: now(), text: 'Missão criada' }] } })
    setF({ title: '', description: '', mode: 'coletiva', agents: ['claude'], tasks: {} })
    setErr('')
  }
  return (
    <form className="card" onSubmit={submit}>
      <h3>Nova missão</h3>
      <input placeholder="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <textarea placeholder="Descrição" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <div className="row wrap">
        {Object.entries(MODES).map(([k, v]) => (
          <label key={k}><input type="radio" checked={f.mode === k} onChange={() => setF({ ...f, mode: k, agents: k === 'individual' ? f.agents.slice(0, 1) : f.agents })} /> {v}</label>
        ))}
      </div>
      <div className="row wrap">
        {AI.map((a) => (
          <label key={a.id}><input type="checkbox" checked={f.agents.includes(a.id)} onChange={() => toggle(a.id)} /> {a.name}</label>
        ))}
      </div>
      {f.mode === 'diferenciada' && f.agents.map((id) => (
        <textarea key={id} placeholder={`Tarefa para ${nameOf(id)}`} value={f.tasks[id] || ''} onChange={(e) => setF({ ...f, tasks: { ...f.tasks, [id]: e.target.value } })} />
      ))}
      {err && <div className="err">{err}</div>}
      <button className="primary">Criar e distribuir</button>
    </form>
  )
}

function Assignment({ m, s }) {
  const { dispatch } = useStore()
  const [text, setText] = useState(s.delivery)
  const [note, setNote] = useState(s.note)
  const patch = (p, log) => dispatch({ type: 'patchAssignment', missionId: m.id, agent: s.agent, patch: p, log: `${m.title} · ${nameOf(s.agent)}: ${log}` })
  const closed = m.status === 'encerrada'
  return (
    <div className="sub">
      <div className="row"><strong>{nameOf(s.agent)}</strong><span className={`badge st-${s.status}`}>{SLABEL[s.status]}</span></div>
      <p className="task">{s.task}</p>
      <button onClick={() => navigator.clipboard?.writeText(s.task)}>Copiar tarefa</button>
      <textarea disabled={closed} placeholder="Cole aqui a resposta/entrega" value={text} onChange={(e) => setText(e.target.value)} />
      {!closed && <button disabled={!text.trim()} onClick={() => patch({ delivery: text.trim(), status: 'entregue' }, 'entrega registrada')}>Registrar entrega</button>}
      {!closed && s.status === 'entregue' && (
        <div className="row">
          <button className="ok" onClick={() => patch({ status: 'aprovada' }, 'entrega aprovada')}>Aprovar</button>
          <button className="no" onClick={() => patch({ status: 'rejeitada' }, 'entrega rejeitada')}>Rejeitar</button>
        </div>
      )}
      <input disabled={closed} placeholder="Observação do mestre" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== s.note && patch({ note }, 'observação registrada')} />
    </div>
  )
}

export default function Missions() {
  const { state, dispatch } = useStore()
  return (
    <>
      <h2>Missões</h2>
      <NewMission />
      {state.missions.map((m) => (
        <div className="card" key={m.id}>
          <div className="row"><h3>{m.title}</h3><span className={`badge st-${m.status}`}>{m.status}</span></div>
          <div className="mut">Criada em {fmt(m.createdAt)}</div>
          {m.description && <p>{m.description}</p>}
          {m.assignments.map((s) => <Assignment key={s.agent} m={m} s={s} />)}
          {m.status === 'aberta' && (
            <button className="no" onClick={() => window.confirm('Encerrar esta missão?') && dispatch({ type: 'closeMission', missionId: m.id })}>Encerrar missão</button>
          )}
          <details><summary>Histórico de alterações</summary>{m.history.map((h, i) => <div key={i} className="mut">{fmt(h.at)} — {h.text}</div>)}</details>
        </div>
      ))}
    </>
  )
}
