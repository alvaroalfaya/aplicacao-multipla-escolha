import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { TextInput, Button, Checkbox, IconButton } from 'react-native-paper';
import Constants from 'expo-constants';
import NavbarComponent from '../components/NavbarComponent';
import {formatarData} from '../utils/functions'
import { editAtividade, getAtividade } from '../services/atividades.services';
import { colors } from '../utils/colors';
import LoadingComponent from '../components/LoadingComponent';
import { useUser } from '../context/UserContext';

// or any pure javascript modules available in npm

export default function VisualizarAtividadePage({ navigation, route }) {
  const { atividadeId } = route.params ? route.params : 0;

  const { turmaId } = route.params ? route.params : 0;

  const { userData } = useUser();

  const [nomeDaAtividade, setNomeDaAtividade] = useState('');

  const [descricao, setDescricao] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

const [podeSerRealizada, setPodeSerRealizada] = useState(null);

  const [semPrazo, setSemPrazo] = useState(false);

  const [tentativasPermitidas, setTentativasPermitidas] = useState('1');

  const [tentativasIlimitadas, setTentativasIlimitadas] = useState(false);

  const [valorAtividade, setValorAtividade] = useState('0');

  const [date, setDate] = useState("");

  const [questoes, setQuestoes] = useState([]);

  const [turma, setTurma] = useState(null);

  const ALFABETO = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const [alternativas, setAlternativas] = useState(['', '', '', '']);

  const [numeroAlternativas, setNumeroAlternativas] = useState('4');

  const [numeroAlternativasParseInt, setNumeroAlternativasParseInt] =
    useState(4);

  const [resposta, setResposta] = useState(0);

  const [editIndexQuestao, setEditIndexQuestao] = useState(null);

  useEffect(() => {
    getAtividade(atividadeId).then((res) => {
      setNomeDaAtividade(res.nome);
      setValorAtividade(res.valor);
      setDescricao(res.descricao);
      setTentativasPermitidas(res.tentativasPermitidas == null? '1' : res.tentativasPermitidas.toString());
      setQuestoes(res.atividadeMongoDb.questoes);
      setDate(res.dataPrazoDeEntrega == null? "" : formatarData(res.dataPrazoDeEntrega.toString()));
      setSemPrazo(res.dataPrazoDeEntrega == null ? true : false);
      setTentativasIlimitadas(res.tentativasPermitidas == null ? true : false);
      setTurma(res.turma);
      setPodeSerRealizada(res.podeSerRealizada);
    });
  }, []);

  function handleEditarAtividade() {
    if (nomeDaAtividade.trim().length == 0) {
      setNomeDaAtividade('');
      return setErrorMessage('Inserir nome da atividade!');
    }
    if (descricao.trim().length == 0) {
      setDescricao('');
      return setErrorMessage('Inserir descrição!');
    }
    if (questoes.length == 0) {
      setDescricao('');
      return setErrorMessage('Inserir ao menos uma questão!');
    }
    editAtividade(
      {
        id: atividadeId,
        nome: nomeDaAtividade,
        descricao: descricao,
        turmaId: turmaId,
        tentativasPermitidas: tentativasIlimitadas
          ? null
          : typeof parseInt(tentativasPermitidas) == 'number' &&
            parseInt(tentativasPermitidas) > 0
          ? parseInt(tentativasPermitidas)
          : null,
        atividadeMongoDb: { questoes: questoes },
        dataPrazoDeEntrega: semPrazo ? null : ajustarOffsetData(date),
        valor:
          typeof parseFloat(valorAtividade) == 'number'
            ? parseFloat(valorAtividade).toFixed(2)
            : 0,
      },
      navigation,
      setErrorMessage
    ).then((res) => navigation.goBack());
  }

  function ajustarOffsetData(data) {
    const offset = data.getTimezoneOffset();
    data = new Date(data.getTime() - 1000 * (60 * offset));
    data = data.toISOString().substring(0, 19);
    return data;
  }

  function ajustarOffsetDataAsDate(data) {
    const offset = data.getTimezoneOffset();
    data = new Date(data.getTime() - 1000 * (60 * offset));
    return data;
  }

  function formatarDataIsoString(data) {
    data = ajustarOffsetData(data);
    data = data.replace('T', '-');
    let separateData = data.split('-');
    let dataFormatada =
      separateData[2] +
      '/' +
      separateData[1] +
      '/' +
      separateData[0] +
      ' ' +
      separateData[3];
    return dataFormatada;
  }

    if (turma == null || typeof userData == 'undefined' || userData == null) {
    return (
      <View style={styles.container}>
        <NavbarComponent title="Atividade" />
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarComponent
        title={'Atividade - ' + nomeDaAtividade}
        goBack={true}
      />
      <ScrollView style={{ margin: 30, display: 'flex', alignItems: 'center', width: '100%' }}>
        <View style={{ marginTop: 30, display: 'flex', alignItems: 'center', width: '100%' }}>
          <View style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>
            <Text style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>{descricao}</Text>
            <Text style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>Turma: {turma != null ? turma.nome : ""}</Text>
            <Text style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>Prazo de entrega: {date}</Text>
            <Text style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>Tentativas Permitidas: {tentativasPermitidas}</Text>
            <Text style={{ margin: 6, fontSize: 16, fontWeight: 'bold' }}>
            Valor:{' '}
            {' ' +
              parseFloat(valorAtividade)
                .toFixed(2)
                .toString()
                .replace('.', ',') +
              ' pontos'}
          </Text>
          </View>
                {userData.perfil == 'Professor' || podeSerRealizada == false ? null : (      <Button
        style={styles.ButtonAtividade}
        mode="contained"
        onPress={() => navigation.navigate("RealizarAtividadePage", {turmaId: turmaId, atividadeId: atividadeId})}>
        <Text style={{ color: 'white' }}>Fazer atividade</Text>
      </Button>
                )}
          <Text style={{ marginTop: 12, fontSize: 21, fontWeight: 'bold' }}>
            Questões
          </Text>
          <View style={{ width: '95%', marginLeft: '2.5%' }}>
            {questoes.map((questao, indexQuestao) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 5,
                  padding: 6,
                  width: 300,
                  marginTop: 6,
                  marginBottom: 6,
                }}>
                <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text>Questão {indexQuestao + 1}</Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Valor: {questao.valor.toString().replace(".",",")}
                </Text>
                </View>
                <Text style={{margin: 6}}>{questao.enunciado}</Text>
                <View style={{ width: '100%' }}>
                  {questao.alternativas.map((alternativa, index) => (
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: '#555555',
                        margin: 6,
                      }}>
                      <Text
                        style={
                          index == questao.resposta ? { color: 'green' } : null
                        }>
                        {ALFABETO[index] + '. ' + alternativa}{' '}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.defaultBackgroundColor,
  },
  ButtonAtividade: {
    backgroundColor: colors.secondaryColor,
    borderRadius: 20,
    padding: 0,
    marginBottom: 12,
    width: '100%',
  },
});
