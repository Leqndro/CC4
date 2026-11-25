import { useState } from 'react'
import { AGENTS, AI, nameOf } from '../agents.js'
import { useStore, fmt } from '../store.jsx'

export default function Conversas() {
  const { state, dispatch } = useStore()
  const [view, setView] = useState('all')
  const [author, setAuthor] = useState('leandro')
  const [to, setTo] = useState('all')
  const [missionId, setMissionId] = useState('')
  const [text, setText] = useState('')
  const list = state.messages.filter((m) => (view === 'all' ? m.to === 'all' : m.author === view || m.to === view))
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch({ type: 'addMessage', message: { author, to, missionId: missionId || null, text: text.trim().slice(0, 8000) } })
    setText('')
  }
  return (
    <>
      <h2>Conversas</h2>
      <div className="row wrap">
        <button className={view === 'all' ? 'on' : ''} onClick={() => setView('all')}>Equipe</button>
        {AI.map((a) => <button key={a.id} className={view === a.id ? 'on' : ''} onClick={() => setView(a.id)}>{a.name}</button>)}
      </div>
      <div className="card">
        {list.length === 0 && <div className="mut">Nenhuma mensagem.</div>}
        {list.map((m) => (
          <div className="msg" key={m.id}>
            <strong>{nameOf(m.author)}</strong> → {nameOf(m.to)} <span className="mut">· {fmt(m.at)}</span>
            {m.missionId && <span className="mut"> · {state.missions.find((x) => x.id === m.missionId)?.title}</span>}
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <form className="card" onSubmit={send}>
        <h3>Registrar mensagem</h3>
        <p className="mut">Para registrar a resposta de uma IA (manual), escolha-a como autor e cole o texto.</p>
        <div className="row wrap">
          <select value={author} onChange={(e) => setAuthor(e.target.value)}>{AGENTS.map((a) => <option key={a.id} value={a.id}>De: {a.name}</option>)}</select>
          <select value={to} onChange={(e) => setTo(e.target.value)}><option value="all">Para: Equipe</option>{AGENTS.map((a) => <option key={a.id} value={a.id}>Para: {a.name}</option>)}</select>
          <select value={missionId} onChange={(e) => setMissionId(e.target.value)}><option value="">Sem missão</option>{state.missions.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Mensagem" />
        <button className="primary">Registrar</button>
      </form>
    </>
  )
}
