import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useState, useCallback } from 'react';

type Item = {
  id: number;
  descricao: string;
  finalizado: boolean;
};

const dadosIniciais: Item[] = [];

export default function App() {
  const [itens, setItens] = useState<Item[]>(dadosIniciais);
  const [entrada, setEntrada] = useState('');
  const [ultimoId, setUltimoId] = useState(1);

  const incluirItem = useCallback(() => {
    const textoLimpo = entrada.trim();
    if (textoLimpo === '') return;

    const novoItem: Item = {
      id: ultimoId,
      descricao: textoLimpo,
      finalizado: false,
    };

    setItens(prev => [...prev, novoItem]);
    setEntrada('');
    setUltimoId(prev => prev + 1);
  }, [entrada, ultimoId]);

  const alternarStatus = useCallback((id: number) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, finalizado: !item.finalizado } : item
      )
    );
  }, []);

  const deletarItem = useCallback((id: number) => {
    setItens(prev => prev.filter(item => item.id !== id));
  }, []);

  const itensPendentes = itens.filter(item => !item.finalizado).length;

  const exibirItem = ({ item }: { item: Item }) => (
    <View style={[styles.card, item.finalizado && styles.cardCompleto]}>
      <TouchableOpacity
        style={[styles.indicador, item.finalizado && styles.indicadorAtivo]}
        onPress={() => alternarStatus(item.id)}
        activeOpacity={0.7}
      >
        {item.finalizado && <Text style={styles.marcador}>✓</Text>}
      </TouchableOpacity>

      <Text
        style={[styles.descricao, item.finalizado && styles.descricaoRiscada]}
        numberOfLines={2}
      >
        {item.descricao}
      </Text>

      <TouchableOpacity
        style={styles.lixeira}
        onPress={() => deletarItem(item.id)}
        activeOpacity={0.6}
      >
        <Text style={styles.iconeLixeira}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.areaSegura}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.conteudoCentral}>
          {/* Cabeçalho */}
          <View style={styles.cabecalho}>
            <Text style={styles.iconeCabecalho}>🎯</Text>
            <Text style={styles.titulo}>Meu Organizador</Text>
            <Text style={styles.subtitulo}>
              {itensPendentes === 0
                ? 'Parabéns! Você completou tudo 🎉'
                : `Faltam ${itensPendentes} atividade${itensPendentes > 1 ? 's' : ''} para finalizar`}
            </Text>
          </View>

          {/* Caixa de adicionar no topo */}
          <View style={styles.areaAdicao}>
            <TextInput
              style={styles.campoEntrada}
              placeholder="Digite seu compromisso..."
              placeholderTextColor="#a0a0a0"
              value={entrada}
              onChangeText={setEntrada}
              onSubmitEditing={incluirItem}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.botaoIncluir} onPress={incluirItem}>
              <Text style={styles.textoBotao}>+ Incluir</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de atividades */}
          <FlatList
            data={itens}
            keyExtractor={item => String(item.id)}
            renderItem={exibirItem}
            contentContainerStyle={styles.listaConteudo}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.mensagemVazia}>
                <Text style={styles.iconeVazio}>📭</Text>
                <Text style={styles.textoVazio}>Nada por aqui ainda</Text>
                <Text style={styles.textoSecundario}>Comece adicionando algo acima</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  conteudoCentral: {
    flex: 1,
    maxWidth: 650,
    width: '100%',
    alignSelf: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  iconeCabecalho: {
    fontSize: 44,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  areaAdicao: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  campoEntrada: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  botaoIncluir: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listaConteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eef2ff',
  },
  cardCompleto: {
    backgroundColor: '#fafcff',
    borderColor: '#e2e8f0',
  },
  indicador: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#ffffff',
  },
  indicadorAtivo: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  marcador: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descricao: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  descricaoRiscada: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  lixeira: {
    padding: 6,
    marginLeft: 8,
  },
  iconeLixeira: {
    fontSize: 18,
    color: '#ef4444',
  },
  mensagemVazia: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },
  iconeVazio: {
    fontSize: 56,
    marginBottom: 16,
    opacity: 0.6,
  },
  textoVazio: {
    fontSize: 17,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6,
  },
  textoSecundario: {
    fontSize: 13,
    color: '#94a3b8',
  },
});