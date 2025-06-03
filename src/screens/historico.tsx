import { Text, View, StyleSheet, Pressable, Modal, TouchableOpacity, Animated, FlatList } from "react-native";
import Header from "../../components/header/header";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef, useState, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_URL_BACK } from '@env';

export default function Historico() {
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [dadosClimaticos, setDadosClimaticos] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {

      const fetchDadosClimaticos = async () => {
      try {
        const response = await axios.get(`${API_URL_BACK}/dados`);
        setDadosClimaticos(response.data.content || []);
      } catch (error) {
        console.error("Erro ao buscar dados climáticos:", error);
      }
    };

      const fetchHistorico = async () => {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) return;

        const user = JSON.parse(userData);
        const userId = user.id
        try {
          const response = await axios.get(`${API_URL_BACK}/historico/${userId}`);
          setHistorico(response.data);
        } catch (error) {
          console.error("Erro ao buscar histórico:", error);
        }
      };

      const loadFavorites = async () => {
        const favs = await AsyncStorage.getItem("favorites");
        setFavorites(favs ? JSON.parse(favs) : []);
      };

      fetchHistorico();
      fetchDadosClimaticos();
      loadFavorites();
    }, [])
  );

  const historicoUnico = historico.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.cidade === item.cidade)
);

  const isFavorite = (cidade: string) => favorites.includes(cidade);


const toggleFavorite = async (item: any) => {
  Animated.sequence([
    Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
    Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
  ]).start();

  const userData = await AsyncStorage.getItem("userData");
  if (!userData) return;
  const user = JSON.parse(userData);

  // Já é favorito? Apenas remove localmente
  if (isFavorite(item.cidade)) {
    const updated = favorites.filter((fav) => fav !== item.cidade);
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    return;
  }

  // POST para o backend
  try {
    console.log("Item enviado:", item);

let latApi = item.latApi;
let lonApi = item.lonApi;

// Fallback se vier undefined do histórico
if (!latApi || !lonApi) {
  const coords = getLatLonByCidade(item.cidade);
  latApi = coords.latApi;
  lonApi = coords.lonApi;
}


if (!latApi || !lonApi) {
  console.warn("Dados de localização ausentes para:", item.cidade);
  alert("Não foi possível favoritar esta cidade. Dados de localização incompletos.");
  return;
}

await axios.post(`${API_URL_BACK}/favoritos`, {
  idUsuario: user.id,
  cidade: item.cidade,
  latApi,
  lonApi,
});



    const updated = [...favorites, item.cidade];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log("Cidade já favoritada.");
    } else {
      console.error("Erro ao favoritar cidade:", error);
    }
  }
};

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const getLatLonByCidade = (cidade: string) => {
  const cidadeNormalizada = normalize(cidade);
  const dado = dadosClimaticos.find(
    (d) => normalize(d.cidade) === cidadeNormalizada
  );
  return {
    latApi: dado?.latApi || null,
    lonApi: dado?.lonApi || null,
  };
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

      <Modal transparent visible={modalVisible} animationType="fade">
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
        data={historicoUnico}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.cidade}</Text>
              <Text style={{ color: "#888" }}>
                {new Date(item.dataPesquisa).toLocaleString("pt-BR", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Animated.View style={[styles.heartButton, { transform: [{ scale: scaleAnim }] }]}>
                <FontAwesome
                  name="heart"
                  size={20}
                  color={isFavorite(item.cidade) ? "#e53935" : "#ccc"}
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
    flex: 1 
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
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white", 
    borderRadius: 10, 
    padding: 25, 
    width: "80%", 
    elevation: 5
  },
  modalTitle: { fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 25 
  },
  button: {
    marginTop: 15, 
    backgroundColor: "#ff7f50", 
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center"
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  card: {
    backgroundColor: "#f8f8f8", 
    padding: 20, 
    borderRadius: 10,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    borderColor: "#0000001a", 
    borderWidth: 1
  },
  heartButton: {
    backgroundColor: "#fff", 
    borderRadius: 30, 
    padding: 10, 
    elevation: 4
  },
});
