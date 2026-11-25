import { useStore, exportJSON } from '../store.jsx'

export const Soon = ({ title, phase }) => (
  <><h2>{title}</h2><div className="card mut">Previsto para a Fase {phase}.</div></>
)

export function Config() {
  const { state, dispatch } = useStore()
  return (
    <>
      <h2>Configurações</h2>
      <div className="card">
        <p className="mut">Dados salvos apenas neste navegador (Fase 1).</p>
        <button onClick={() => exportJSON(state)}>Exportar dados</button>
        <button className="no" onClick={() => window.confirm('Apagar TODOS os dados locais? Não dá para desfazer.') && dispatch({ type: 'reset' })}>Apagar dados locais</button>
      </div>
    </>
  )
}
