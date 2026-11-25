// O "garçom" do app: a mesma API usada pelo site.

export type Status = 'Aberto' | 'Em andamento' | 'Resolvido'

export interface Chamado {
  id: number
  titulo: string
  descricao: string
  categoria: string
  bairro: string
  status: Status
  resposta: string | null
  criadoEm: string
}

// No celular, "localhost" é o próprio celular! Por isso o endereço da API vem do .env
// (ex.: http://192.168.0.10:3333, o IP do computador na rede Wi-Fi).
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333'

async function pedir<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(API_URL + caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  const corpo = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    throw new Error(corpo?.erro ?? `Erro ${resposta.status} ao falar com a API.`)
  }
  return corpo as T
}

export function listarChamados() {
  return pedir<Chamado[]>('/chamados')
}

export function criarChamado(dados: { titulo: string; descricao: string; bairro: string }) {
  return pedir<Chamado>('/chamados', { method: 'POST', body: JSON.stringify(dados) })
}
