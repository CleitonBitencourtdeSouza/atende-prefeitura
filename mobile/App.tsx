import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { criarChamado, listarChamados, type Chamado, type Status } from './src/api'

const CORES: Record<Status, { fundo: string; texto: string }> = {
  Aberto: { fundo: '#fef3c7', texto: '#92400e' },
  'Em andamento': { fundo: '#dbeafe', texto: '#1d4ed8' },
  Resolvido: { fundo: '#dcfce7', texto: '#15803d' },
}

// Um chamado da lista.
function Cartao({ chamado }: { chamado: Chamado }) {
  const cor = CORES[chamado.status]
  return (
    <View style={estilos.cartao}>
      <View style={estilos.cartaoTopo}>
        <Text style={estilos.cartaoTitulo}>
          <Text style={estilos.cartaoId}>#{chamado.id} </Text>
          {chamado.titulo}
        </Text>
        <Text style={[estilos.etiqueta, { backgroundColor: cor.fundo, color: cor.texto }]}>{chamado.status}</Text>
      </View>
      <Text style={estilos.cartaoDescricao}>{chamado.descricao}</Text>
      <Text style={estilos.cartaoMeta}>
        {chamado.categoria} · {chamado.bairro}
      </Text>
      {chamado.resposta ? (
        <Text style={estilos.resposta}>
          <Text style={{ fontWeight: '700' }}>Resposta: </Text>
          {chamado.resposta}
        </Text>
      ) : null}
    </View>
  )
}

// A tela do app: formulário no topo e a lista de chamados embaixo.
export default function App() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [carregando, setCarregando] = useState(true)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [bairro, setBairro] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setChamados(await listarChamados())
      setErro('')
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function enviar() {
    setErro('')
    setSucesso('')
    if (!titulo.trim()) return setErro('O título é obrigatório.')
    if (!descricao.trim()) return setErro('A descrição é obrigatória.')

    setEnviando(true)
    try {
      const novo = await criarChamado({ titulo, descricao, bairro })
      setSucesso(`Chamado #${novo.id} aberto com sucesso!`)
      setTitulo('')
      setDescricao('')
      setBairro('')
      await carregar()
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  const formulario = (
    <View style={estilos.painel}>
      <Text style={estilos.subtitulo}>Abrir um chamado</Text>
      <TextInput style={estilos.campo} placeholder="Título *" value={titulo} onChangeText={setTitulo} />
      <TextInput
        style={[estilos.campo, { minHeight: 72, textAlignVertical: 'top' }]}
        placeholder="Descrição *"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <TextInput style={estilos.campo} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      {erro ? <Text style={[estilos.aviso, estilos.avisoErro]}>{erro}</Text> : null}
      {sucesso ? <Text style={[estilos.aviso, estilos.avisoOk]}>{sucesso}</Text> : null}
      <Pressable style={[estilos.botao, enviando && { opacity: 0.6 }]} onPress={enviar} disabled={enviando}>
        <Text style={estilos.botaoTexto}>{enviando ? 'Enviando...' : 'Abrir chamado'}</Text>
      </Pressable>
      <Text style={estilos.subtitulo}>Chamados ({chamados.length})</Text>
      {carregando && chamados.length === 0 ? <ActivityIndicator color="#1d4ed8" /> : null}
    </View>
  )

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar style="light" />
      <View style={estilos.topo}>
        <Text style={estilos.titulo}>Atende Prefeitura</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={chamados}
          keyExtractor={(c) => String(c.id)}
          renderItem={({ item }) => <Cartao chamado={item} />}
          ListHeaderComponent={formulario}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} />}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f4f6fa' },
  topo: { backgroundColor: '#1d4ed8', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '700' },
  painel: { gap: 10 },
  subtitulo: { fontSize: 17, fontWeight: '700', color: '#1f2937', marginTop: 4 },
  campo: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  botao: { backgroundColor: '#1d4ed8', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
  aviso: { padding: 10, borderRadius: 8, fontSize: 14 },
  avisoErro: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  avisoOk: { backgroundColor: '#dcfce7', color: '#15803d' },
  cartao: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 14, gap: 6 },
  cartaoTopo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' },
  cartaoTitulo: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1f2937' },
  cartaoId: { fontWeight: '400', color: '#6b7280' },
  etiqueta: { fontSize: 12, fontWeight: '700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  cartaoDescricao: { fontSize: 14, color: '#1f2937' },
  cartaoMeta: { fontSize: 12, color: '#6b7280' },
  resposta: { backgroundColor: '#dbeafe', borderRadius: 8, padding: 8, fontSize: 13, color: '#1f2937' },
})
