import { Image, Text, View, StyleSheet, TouchableOpacity, FlatList, Modal,} from "react-native";
import Header from "../../components/header/header";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { API_URL_BACK } from '@env';
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

export default function Perfil() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState('');
  const [favorites, setFavorites] = useState<{ id: number, cidade: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);


  const navigation = useNavigation<any>();
  const favoritos = "favorites";

  useEffect(() => {
    const loadSavedData = async () => {
      const data = await AsyncStorage.getItem('userData');
      console.log('Dados do usuário:', data); 
      if (data) {
        const user = JSON.parse(data);
        setEmail(user.email);
        setName(user.name);
      }
    };
    loadSavedData();
  }, []);

  useFocusEffect(
    useCallback(() => {
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

        setFavorites(favoritosCompletos);

        await AsyncStorage.setItem("favorites", JSON.stringify(favoritosCompletos.map((f: { cidade: any; }) => f.cidade)));
      } catch (error) {
        console.error("Erro ao carregar favoritos do backend:", error);
      }
    };
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id: number) => {
    try {
      await axios.delete(`${API_URL_BACK}/favoritos/${id}`);
      const updated = favorites.filter((fav) => fav.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

const handleSaveProfile = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('userData');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    await axios.put(`${API_URL_BACK}/users/${userId}`, {
    nomeUser: name,
    email,
    password
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });


  await AsyncStorage.setItem('userData', JSON.stringify({
    ...parsedUser,
    nomeUser: name,
    email
  }));

  console.log("Dados enviados:", { nomeUser: name, email });

    setModalVisible(false);
    setPassword('');
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
  }
};

const deleteUser = async () => {
  const storedUser = await AsyncStorage.getItem('userData');
  if (!storedUser) return;

  const user = JSON.parse(storedUser);
  try {
    await axios.delete(`${API_URL_BACK}/users/${user.id}`);
    await AsyncStorage.clear();
    navigation.navigate("Login");
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
  }
};



const renderItem = ({ item }: { item: { id: number; cidade: string } }) => (
  <View style={styles.cleanCard}>
    <View style={styles.cardRow}>
      <Text style={styles.cardCity}>{item.cidade}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", { cidade: item.cidade })}>
          <Feather name="map-pin" size={18} color="#555" style={styles.cardIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Feather name="trash-2" size={18} color="#e53935" style={styles.cardIcon} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      <Header />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry
            />

            <View style={styles.buttonModal}>
            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>


            <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal 
        animationType="fade"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => setModalVisibleDelete(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deletar Conta</Text>
            <Text style={styles.modalSubtitle}>Tem certeza que deseja excluir sua conta?</Text>
            <Text style={styles.modalWarning}>Essa ação não poderá ser desfeita.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#e53935' }]} 
                onPress={deleteUser}
              >
                <Text style={styles.modalButtonText}>Deletar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#888' }]} 
                onPress={() => setModalVisibleDelete(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.profileContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/photo.png")}
        />

        <View style={styles.infosContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={{ display: "flex", padding: 10 }}>
        <Text style={styles.title}>Cidades favoritas:</Text>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma cidade salva.</Text>
        ) : (
          <FlatList
          data={favorites.slice(0, 4)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
        )}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
          <Feather name="user" size={20} color="#555" style={styles.menuIcon} />
          <Text style={styles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisibleDelete(true)}>
          <Feather name="trash-2" size={20} color="#da0707" style={styles.menuIcon} />
          <Text style={styles.menuText}>Deletar Conta</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  buttonModal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20
  },menuContainer: {
  marginTop: 30,
  paddingHorizontal: 25,
},

menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
},

menuIcon: {
  marginRight: 15,
},

menuText: {
  fontSize: 16,
  color: "#333",
},

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "left",
    color: "#333",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#FF8F53",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    height: 33,
    width: 90,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginTop: -5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#0000001a",
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonHome: {
    borderWidth: 1,
    borderColor: "#00000045",
    borderRadius: 5,
    width: 60,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginRight: 5,
  },
modalWarning: {
  fontSize: 14,
  color: "#c62828",
  marginBottom: 20,
  textAlign: "center",
},

modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  gap: 12,
},

modalButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
},

modalButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 14,
},
cleanCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingVertical: 15,
  paddingHorizontal: 20,
  marginBottom: 12,
  borderWidth: 0,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1, 
},

cardRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

cardCity: {
  fontSize: 16,
  color: "#333",
  fontWeight: "500",
  flexShrink: 1,
},

cardActions: {
  flexDirection: "row",
  gap: 15,
},

cardIcon: {
  padding: 4,
},

  buttonHomeText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
  },
  buttonRemoveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    marginTop: 50,
  },
  infosContainer: {
    display: "flex",
  },
  image: {
    width: 120,
    height: 120,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 15,
    color: "gray",
  },
});
