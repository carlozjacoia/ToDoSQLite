import { SQLiteDatabase } from "expo-sqlite";
import _tarefa from "../types/tarefa";
import { Button, Text, View, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type _propsTarefa = {
  dados: _tarefa;
  db: SQLiteDatabase;
  recarregar: any;
};

export default function Tarefa(props: _propsTarefa) {
  const excluir = async () => {
    await props.db.runAsync("DELETE FROM tarefas WHERE id = ?", props.dados.id);
    await props.recarregar();
  };

  const concluir = async () => {
    await props.db.runAsync(
      "UPDATE tarefas SET concluido = 1 WHERE id = ?",
      props.dados.id
    );
    await props.recarregar();
  };

  const renderTexto = () => {
    if (props.dados.concluido) {
      return (
        <Text style={[styles.texto, styles.concluido]}>
          {props.dados.texto}
        </Text>
      );
    }
    return <Text style={styles.texto}>{props.dados.texto}</Text>;
  };

  return (
    <View style={styles.tarefa}>
      <View style={styles.linha}>
        {renderTexto()}
        <Pressable onPress={excluir}>
          <AntDesign name="closecircle" size={20} color="red" />
        </Pressable>
      </View>
      {!props.dados.concluido && <Button title="Concluir" onPress={concluir} />}
    </View>
  );
}
const styles = StyleSheet.create({
  tarefa: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 8,
  },
  concluido: {
    textDecorationLine: "line-through",
    color: "green",
  },
  botoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
