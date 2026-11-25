import type { ReactNode } from 'react'
import type { Chamado } from '../api'
import { StatusBadge } from './StatusBadge'

// Mostra um chamado. O "children" é um espaço extra (a tela do atendente coloca o formulário ali).
export function ChamadoCard({ chamado, children }: { chamado: Chamado; children?: ReactNode }) {
  const data = new Date(chamado.criadoEm).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return (
    <article className="card">
      <header className="card-topo">
        <h3>
          <span className="card-id">#{chamado.id}</span> {chamado.titulo}
        </h3>
        <StatusBadge status={chamado.status} />
      </header>
      <p className="card-descricao">{chamado.descricao}</p>
      <p className="card-meta">
        {chamado.categoria} · {chamado.bairro} · aberto em {data}
      </p>
      {chamado.resposta && (
        <p className="card-resposta">
          <strong>Resposta da prefeitura:</strong> {chamado.resposta}
        </p>
      )}
      {children}
    </article>
  )
}
