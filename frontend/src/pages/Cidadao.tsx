import { useEffect, useState, type FormEvent } from 'react'
import { criarChamado, listarChamados, type Chamado } from '../api'
import { ChamadoCard } from '../components/ChamadoCard'

const CATEGORIAS = ['Vias', 'Iluminação', 'Limpeza', 'Meio ambiente', 'Outros']
const formVazio = { titulo: '', descricao: '', categoria: 'Outros', bairro: '' }

// Tela do cidadão: abrir um chamado e acompanhar a lista.
export function Cidadao() {
  const [form, setForm] = useState(formVazio)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function carregar() {
    try {
      setChamados(await listarChamados())
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  // Ao abrir a tela, busca a lista na API.
  useEffect(() => {
    let ativo = true
    listarChamados()
      .then((lista) => ativo && setChamados(lista))
      .catch((e: Error) => ativo && setErro(e.message))
    return () => {
      ativo = false
    }
  }, [])

  async function enviar(evento: FormEvent) {
    evento.preventDefault() // não recarrega a página
    setErro('')
    setSucesso('')

    // A mesma regra da API, conferida antes de enviar.
    if (!form.titulo.trim()) return setErro('O título é obrigatório.')
    if (!form.descricao.trim()) return setErro('A descrição é obrigatória.')

    setEnviando(true)
    try {
      const novo = await criarChamado(form)
      setSucesso(`Chamado #${novo.id} aberto com sucesso!`)
      setForm(formVazio)
      await carregar() // a lista atualiza depois de criar
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="grade">
      <section className="painel">
        <h2>Abrir um chamado</h2>
        <form onSubmit={enviar} noValidate>
          <label>
            Título *
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex.: Buraco na rua"
            />
          </label>
          <label>
            Descrição *
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Conte o que está acontecendo e onde"
              rows={4}
            />
          </label>
          <div className="linha">
            <label>
              Categoria
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Bairro
              <input
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                placeholder="Ex.: Centro"
              />
            </label>
          </div>
          {erro && (
            <p className="aviso aviso-erro" role="alert">
              {erro}
            </p>
          )}
          {sucesso && (
            <p className="aviso aviso-ok" role="status">
              {sucesso}
            </p>
          )}
          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Abrir chamado'}
          </button>
        </form>
      </section>

      <section className="painel">
        <h2>Chamados ({chamados.length})</h2>
        {chamados.length === 0 && <p className="vazio">Nenhum chamado ainda.</p>}
        <div className="lista">
          {chamados.map((c) => (
            <ChamadoCard key={c.id} chamado={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
