import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Missions from './pages/Missions.jsx'
import Conversas from './pages/Conversas.jsx'
import Historico from './pages/Historico.jsx'
import { Config, Soon } from './pages/Outras.jsx'

const MENU = [
  ['central', 'Central de comando', Dashboard],
  ['equipe', 'Equipe', Dashboard],
  ['conversas', 'Conversas', Conversas],
  ['missoes', 'Missões', Missions],
  ['projetos', 'Projetos', () => <Soon title="Projetos" phase={5} />],
  ['documentos', 'Documentos', () => <Soon title="Documentos" phase={5} />],
  ['historico', 'Histórico', Historico],
  ['config', 'Configurações', Config],
]

export default function App() {
  const [page, setPage] = useState('central')
  const Page = MENU.find((m) => m[0] === page)[2]
  return (
    <div className="app">
      <nav className="side">
        <h1>CC4</h1>
        {MENU.map(([id, label]) => (
          <button key={id} className={id === page ? 'on' : ''} onClick={() => setPage(id)}>{label}</button>
        ))}
      </nav>
      <main><Page go={setPage} /></main>
    </div>
  )
}
