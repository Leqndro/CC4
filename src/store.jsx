// Estado global do app + persistência no localStorage (histórico local da Fase 1).
// Na Fase 2 este arquivo passa a falar com o Supabase.
import { createContext, useContext, useEffect, useReducer } from 'react'

const KEY = 'cc4:v1'
const empty = { missions: [], messages: [], logs: [] }
export const uid = () => crypto.randomUUID()
export const now = () => new Date().toISOString()
export const fmt = (iso) => new Date(iso).toLocaleString('pt-BR')

const log = (s, text) => ({ ...s, logs: [{ id: uid(), at: now(), text }, ...s.logs] })

function reducer(s, a) {
  switch (a.type) {
    case 'addMission': {
      const m = a.mission
      const msgs = m.assignments.map((x) => ({
        id: uid(), author: 'leandro', to: x.agent, missionId: m.id, text: x.task, at: m.createdAt,
      }))
      return log({ ...s, missions: [m, ...s.missions], messages: [...s.messages, ...msgs] }, `Missão criada: ${m.title}`)
    }
    case 'patchAssignment': {
      const missions = s.missions.map((m) =>
        m.id !== a.missionId ? m : {
          ...m,
          assignments: m.assignments.map((x) => (x.agent === a.agent ? { ...x, ...a.patch } : x)),
          history: [{ at: now(), text: a.log }, ...m.history],
        })
      return log({ ...s, missions }, a.log)
    }
    case 'closeMission': {
      const missions = s.missions.map((m) =>
        m.id !== a.missionId ? m : { ...m, status: 'encerrada', history: [{ at: now(), text: 'Missão encerrada' }, ...m.history] })
      return log({ ...s, missions }, 'Missão encerrada')
    }
    case 'addMessage':
      return log({ ...s, messages: [...s.messages, { id: uid(), at: now(), ...a.message }] }, `Mensagem de ${a.message.author}`)
    case 'reset':
      return empty
    default:
      return s
  }
}

function load() {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return empty }
}

const Ctx = createContext(null)
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(state)), [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)

export function exportJSON(state) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `cc4-historico-${Date.now()}.json` })
  a.click()
  URL.revokeObjectURL(url)
}
