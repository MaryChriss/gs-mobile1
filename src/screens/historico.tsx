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
  const [favoritosBack, setFavoritosBack] = useState<Favorito[]>([]);

  const isFavorite = (cidade: string) => {
    return favorites.includes(cidade);
  } 

  const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const historicoUnico = historico.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.cidade === item.cidade)
  );

  type Favorito = {
  id: number;
  cidade: string;
  };

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
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const user = JSON.parse(userData);

      try {
        const response = await axios.get(`${API_URL_BACK}/favoritos/${user.id}`);
        const favoritosCompletos = response.data.map((fav: any) => ({
          id: fav.idFavorito,
          cidade: fav.cidade,
        }));

      setFavoritosBack(favoritosCompletos);

      const favoritosStrings = favoritosCompletos.map((f: Favorito) => f.cidade);
      setFavorites(favoritosStrings);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritosStrings));

    } catch (error) {
      console.error("Erro ao carregar favoritos do backend:", error);
    }
  };

      fetchHistorico();
      fetchDadosClimaticos();
      loadFavorites();
      }, [])
    );


const toggleFavorite = async (item: any) => {
  Animated.sequence([
    Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
    Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
  ]).start();

  const userData = await AsyncStorage.getItem("userData");
  if (!userData) return;
  const user = JSON.parse(userData);

  const jaEhFavorito = isFavorite(item.cidade);
  if (jaEhFavorito) {
    // Remover do favorito
    const favorito = favoritosBack.find((f) => normalize(f.cidade) === normalize(item.cidade));

    if (!favorito) {
      console.warn("⚠️ Favorito não encontrado para cidade:", item.cidade);
      return;
    }

    try {
      await axios.delete(`${API_URL_BACK}/favoritos/${favorito.id}`);
      const updated = favorites.filter((fav) => fav !== item.cidade);
      setFavorites(updated); // Atualiza o estado de favoritos
      setFavoritosBack(favoritosBack.filter((f) => f.id !== favorito.id)); // Atualiza o estado completo de favoritos
      await AsyncStorage.setItem("favorites", JSON.stringify(updated)); // Salva no AsyncStorage
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  } else {
    // Adicionar ao favorito
    try {
      let latApi = item.latApi;
      let lonApi = item.lonApi;

      if (!latApi || !lonApi) {
        const coords = getLatLonByCidade(item.cidade);
        latApi = coords.latApi;
        lonApi = coords.lonApi;
      }

      if (!latApi || !lonApi) {
        alert("Não foi possível favoritar esta cidade. Dados de localização incompletos.");
        return;
      }

      const response = await axios.post(`${API_URL_BACK}/favoritos`, {
        idUsuario: user.id,
        cidade: item.cidade,
        latApi,
        lonApi,
      });

      const novoFavorito = {
        id: response.data.idFavorito,
        cidade: response.data.cidade,
      };

      const atualizados = [...favoritosBack, novoFavorito];
      setFavorites(atualizados.map(f => f.cidade)); // Atualiza os favoritos no estado
      setFavoritosBack(atualizados); // Atualiza o estado completo de favoritos
      await AsyncStorage.setItem("favorites", JSON.stringify(atualizados)); // Salva no AsyncStorage
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log("Cidade já favoritada.");
      } else {
        console.error("Erro ao favoritar cidade:", error);
      }
    }
  }
};

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
            color={isFavorite(item.cidade) ? "#e53935" : "#ccc"}  // Verifica se é favorito
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
