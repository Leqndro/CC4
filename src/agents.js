// Os 4 participantes e a regra dos estados.
// "base" é o estado real hoje: nenhuma IA tem integração (Fase 3), então todas são "manual".
export const AGENTS = [
  { id: 'leandro', name: 'Leandro', role: 'Mestre', desc: 'Proprietário e responsável pelas decisões', base: 'online' },
  { id: 'chatgpt', name: 'ChatGPT', role: 'Segundo em comando', desc: 'Planejamento, orientação e supervisão', base: 'manual' },
  { id: 'gemini', name: 'Gemini', role: 'Execução e pesquisa', desc: 'Execução, pesquisa e desenvolvimento', base: 'manual' },
  { id: 'claude', name: 'Claude', role: 'Execução e análise', desc: 'Execução, desenvolvimento e análise', base: 'manual' },
]
export const AI = AGENTS.filter((a) => a.id !== 'leandro')
export const nameOf = (id) => (id === 'all' ? 'Equipe' : AGENTS.find((a) => a.id === id)?.name ?? id)

export const STATUS = {
  online: 'Online', // conexão efetivamente estabelecida
  disponivel: 'Disponível', // integração configurada e pronta
  trabalhando: 'Trabalhando', // tarefa em execução
  desconectado: 'Desconectado', // integração indisponível
  manual: 'Manual', // copiar e colar
}

// Estado derivado: se há tarefa pendente numa missão aberta, está "trabalhando".
export function agentStatus(agent, missions) {
  const busy = missions.some(
    (m) => m.status === 'aberta' && m.assignments.some((s) => s.agent === agent.id && s.status === 'pendente')
  )
  return agent.id !== 'leandro' && busy ? 'trabalhando' : agent.base
}
