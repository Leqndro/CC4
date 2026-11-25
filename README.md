# CC4 — Central de Comando (Fase 1)

Versão local: tudo funciona no navegador, sem servidor e sem integrações de IA.
Os dados ficam no `localStorage` do navegador.

## Como executar
1. Instale o Node.js (versão LTS) em nodejs.org.
2. Na pasta do projeto: `npm install` (baixa React e Vite).
3. `npm run dev` e abra o endereço mostrado (normalmente http://localhost:5173).
4. `npm run build` gera a pasta `dist` (será usada no Cloudflare Pages).

## Estrutura de pastas
- `index.html` — página única; carrega `src/main.jsx`.
- `package.json` — lista de dependências e comandos.
- `vite.config.js` — configuração do Vite (servidor de desenvolvimento).
- `src/main.jsx` — ponto de entrada: monta o React e envolve tudo no `StoreProvider`.
- `src/App.jsx` — menu lateral; guarda em um `useState` qual página está aberta.
- `src/agents.js` — os 4 participantes e a regra dos estados.
- `src/store.jsx` — estado global (`useReducer`) + gravação no `localStorage` + exportação JSON.
- `src/pages/` — uma tela por arquivo: Dashboard, Missions, Conversas, Historico, Outras (Configurações e telas futuras).
- `src/styles.css` — visual azul-marinho, responsivo (menu vira barra horizontal no celular).

## Conceitos usados
- **Componente React**: função que retorna HTML (JSX). Ex.: `Dashboard`.
- **useState**: guarda valor local de uma tela (ex.: campos de um formulário).
- **useReducer + Context**: um "banco" central; as telas enviam ações (`dispatch({type:'addMission'...})`) e o `reducer` calcula o novo estado. Na Fase 2, só o `store.jsx` precisará mudar para falar com o Supabase.
- **useEffect**: toda vez que o estado muda, salva no `localStorage`.

## Fluxo de uma missão
Criar (título, descrição, agentes, modo) → o sistema cria uma tarefa por agente e uma mensagem registrada → você copia a tarefa, leva à IA, cola a resposta em "Registrar entrega" → aprova ou rejeita → encerra (com confirmação). Tudo vai para o Histórico.

## Estados dos participantes
Hoje o Leandro aparece **Online** (você está usando o app) e as IAs **Manual**; viram **Trabalhando** enquanto têm tarefa pendente. "Disponível" e "Desconectado" existem na regra, mas só serão usados com os adaptadores da Fase 3. Nenhuma IA é mostrada como conectada.

## Fora da Fase 1
Supabase/Auth (Fase 2), adaptadores OpenAI/Gemini/Claude (Fase 3), contexto compartilhado (Fase 4), Projetos e Documentos (Fase 5; as telas existem como "em breve").

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie **o conteúdo desta pasta** (incluindo `.github`).
2. Em *Settings → Pages → Build and deployment → Source*, escolha **GitHub Actions**.
3. A cada envio na branch `main`, o workflow compila e publica. O endereço aparece em *Actions* e em *Settings → Pages*.
