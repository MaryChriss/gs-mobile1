import { Text, View, StyleSheet, Pressable, Modal, TouchableOpacity, Animated, FlatList } from "react-native";
import Header from "../../components/header/header";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef, useState, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MOCK_CIDADES = ["Bahia", "Salvador", "Ceará"];

export default function Historico() {
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const favs = await AsyncStorage.getItem("favorites");
        setFavorites(favs ? JSON.parse(favs) : []);
      };

      loadFavorites();
    }, [])
  );

  const isFavorite = (cidade: string) => favorites.includes(cidade);

  const toggleFavorite = async (cidade: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    let updatedFavorites = [];

    if (favorites.includes(cidade)) {
      updatedFavorites = favorites.filter((item) => item !== cidade);
    } else {
      updatedFavorites = [...favorites, cidade];
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.titlecont}>
        <Text style={styles.title}>Histórico de Pesquisas:</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <MaterialIcons name="info" size={24} color="#000000" />
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recomendações Climáticas</Text>
            <Text>🚩 Ventos acima de 30 km/h: evite áreas abertas.{"\n"}</Text>
            <Text>🌡️ Temperatura acima de 35 °C: mantenha-se hidratado.{"\n"}</Text>
            <Text>💧 Umidade abaixo de 30%: cuidado com pele e olhos.{"\n"}</Text>
            <Text>🌧️ Previsão de chuva: leve guarda-chuva!{"\n"}</Text>

            <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <FlatList
        data={MOCK_CIDADES}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Animated.View style={[styles.heartButton, { transform: [{ scale: scaleAnim }] }]}>
                <FontAwesome
                  name="heart"
                  size={20}
                  color={isFavorite(item) ? "#e53935" : "#ccc"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titlecont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    fontWeight: "500",
    fontSize: 17
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 25,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#ff7f50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#0000001a",
    borderWidth: 1,
  },
  heartButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    elevation: 4,
  },
});
