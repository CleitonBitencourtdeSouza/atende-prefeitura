import { useEffect, useState } from 'react'
import { atualizarChamado, listarChamados, STATUS, type Chamado, type Status } from '../api'
import { ChamadoCard } from '../components/ChamadoCard'

// Formulário de atendimento de UM chamado: escrever a resposta e escolher o status.
function Atender({ chamado, aoSalvar }: { chamado: Chamado; aoSalvar: () => Promise<void> }) {
  const [status, setStatus] = useState<Status>(chamado.status)
  const [resposta, setResposta] = useState(chamado.resposta ?? '')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function salvar() {
    setErro('')
    setSalvando(true)
    try {
      // Só manda a resposta se o atendente escreveu algo.
      await atualizarChamado(chamado.id, {
        status,
        resposta: resposta.trim() ? resposta : undefined,
      })
      await aoSalvar() // a lista atualiza depois de mudar
    } catch (e) {
      setErro((e as Error).message)
      setSalvando(false)
    }
  }

  return (
    <div className="atender">
      <textarea
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        placeholder="Resposta para o cidadão"
        rows={2}
        aria-label={`Resposta do chamado ${chamado.id}`}
      />
      <div className="linha">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          aria-label={`Status do chamado ${chamado.id}`}
        >
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
      {erro && (
        <p className="aviso aviso-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

// Tela do atendente: filtrar por status, responder e mudar o status.
export function Atendente() {
  const [filtro, setFiltro] = useState<Status | undefined>(undefined)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      setErro('')
      setChamados(await listarChamados(filtro))
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  // Busca de novo sempre que o filtro muda.
  // O "ativo" evita que uma resposta atrasada (de um filtro antigo) apague a lista certa.
  useEffect(() => {
    let ativo = true
    listarChamados(filtro)
      .then((lista) => ativo && setChamados(lista))
      .catch((e: Error) => ativo && setErro(e.message))
    return () => {
      ativo = false
    }
  }, [filtro])

  return (
    <section className="painel">
      <h2>Painel do atendente</h2>
      <div className="filtros" role="group" aria-label="Filtrar por status">
        <button className={filtro === undefined ? 'ativo' : ''} onClick={() => setFiltro(undefined)}>
          Todos
        </button>
        {STATUS.map((s) => (
          <button key={s} className={filtro === s ? 'ativo' : ''} onClick={() => setFiltro(s)}>
            {s}
          </button>
        ))}
      </div>
      {erro && (
        <p className="aviso aviso-erro" role="alert">
          {erro}
        </p>
      )}
      {chamados.length === 0 && <p className="vazio">Nenhum chamado com esse status.</p>}
      <div className="lista">
        {chamados.map((c) => (
          // A "key" com o atualizadoEm recria o formulário depois de salvar.
          <ChamadoCard key={`${c.id}-${c.atualizadoEm}`} chamado={c}>
            <Atender chamado={c} aoSalvar={carregar} />
          </ChamadoCard>
        ))}
      </div>
    </section>
  )
}
