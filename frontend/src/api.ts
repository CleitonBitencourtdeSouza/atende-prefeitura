// O "garçom" do salão: leva os pedidos para a API e traz as respostas.

export const STATUS = ['Aberto', 'Em andamento', 'Resolvido'] as const
export type Status = (typeof STATUS)[number]

export interface Chamado {
  id: number
  titulo: string
  descricao: string
  categoria: string
  bairro: string
  status: Status
  resposta: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface NovoChamado {
  titulo: string
  descricao: string
  categoria: string
  bairro: string
}

// Em produção, dá para apontar para outra API com VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL ?? ''

// Faz o pedido e, se a API responder com erro, transforma a mensagem dela num erro.
async function pedir<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(BASE + caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  const corpo = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    throw new Error(corpo?.erro ?? `Erro ${resposta.status} ao falar com a API.`)
  }
  return corpo as T
}

export function listarChamados(status?: Status) {
  const filtro = status ? `?status=${encodeURIComponent(status)}` : ''
  return pedir<Chamado[]>(`/chamados${filtro}`)
}

export function criarChamado(dados: NovoChamado) {
  return pedir<Chamado>('/chamados', { method: 'POST', body: JSON.stringify(dados) })
}

export function atualizarChamado(id: number, dados: { status?: Status; resposta?: string }) {
  return pedir<Chamado>(`/chamados/${id}`, { method: 'PATCH', body: JSON.stringify(dados) })
}
