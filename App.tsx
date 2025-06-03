import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import _tarefa from "./types/tarefa";
import Tarefa from "./components/Tarefa";

const db = SQLite.openDatabaseSync("to-do.sqlite");

export default function App() {
  const [novaTarefa, setNovaTarefa] = useState<string>("");
  const [tarefas, setTarefas] = useState<_tarefa[]>([]);

  useEffect(() => {
    db.execSync(`CREATE TABLE IF NOT EXISTS tarefas (
                  id INTEGER PRIMARY KEY NOT NULL,
                  texto VARCHAR(100),
                  concluido INTEGER DEFAULT 0
                )`);

    recarregar();
  }, []);

  const recarregar = async () => {
    let temp: _tarefa[] = await db.getAllAsync("SELECT * FROM tarefas");
    setTarefas(temp);
  };

  const adicionar = async () => {
    if (novaTarefa == "") {
      Alert.alert("Insira um texto!");
      return;
    }

    await db.runAsync("INSERT INTO tarefas (texto) VALUES (?)", novaTarefa);

    setNovaTarefa("");
    await recarregar();
  };

  const renderLista = () => {
    let lista = tarefas.map((t) => (
      <Tarefa dados={t} db={db} recarregar={recarregar} key={t.id} />
    ));
    return lista;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua tarefa..."
        value={novaTarefa}
        onChangeText={setNovaTarefa}
      />
      <View style={styles.button}>
        <Button title="Adicionar" onPress={adicionar} />
      </View>
      <View style={styles.lista}>{renderLista()}</View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f7f7f7",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    marginBottom: 20,
  },
  lista: {
    gap: 10,
  },
});
