import { useState } from 'react'
import { Atendente } from './pages/Atendente'
import { Cidadao } from './pages/Cidadao'

type Aba = 'cidadao' | 'atendente'

// O salão: cabeçalho e as duas abas (cidadão e atendente).
export default function App() {
  const [aba, setAba] = useState<Aba>('cidadao')

  return (
    <>
      <header className="topo">
        <div className="topo-conteudo">
          <h1>Atende Prefeitura</h1>
          <nav className="abas">
            <button className={aba === 'cidadao' ? 'ativo' : ''} onClick={() => setAba('cidadao')}>
              Sou cidadão
            </button>
            <button className={aba === 'atendente' ? 'ativo' : ''} onClick={() => setAba('atendente')}>
              Sou atendente
            </button>
          </nav>
        </div>
      </header>
      <main className="conteudo">{aba === 'cidadao' ? <Cidadao /> : <Atendente />}</main>
    </>
  )
}
