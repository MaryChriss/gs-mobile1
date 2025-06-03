import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
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
  const [favorites, setFavorites] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<any>();
  const favoritos = "favorites";

useEffect(() => {
  const loadSavedData = async () => {
    const data = await AsyncStorage.getItem('userData');
    console.log('Dados do usuário:', data); 
    if (data) {
      const user = JSON.parse(data);
      setEmail(user.email);
      setName(user.nomeUser);
    }
  };
  loadSavedData();
}, []);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const favs = await AsyncStorage.getItem(favoritos);
        setFavorites(favs ? JSON.parse(favs) : []);
      };

      loadFavorites();
    }, [])
  );

const removeFavorite = async (cidade: string) => {
  const updated = favorites.filter((c) => c !== cidade);
  setFavorites(updated);
  await AsyncStorage.setItem(favoritos, JSON.stringify(updated));
};

const handleSaveProfile = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('userData');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    await axios.put(`${API_URL_BACK}/users/${userId}`, {
      email: email,
      password: password
    });

    await AsyncStorage.setItem('userData', JSON.stringify({
      ...parsedUser,
      nomeUser: parsedUser.nomeUser,
      email
    }));

    console.log("Dados enviados:", { nomeUser: name, email, password });

    setModalVisible(false);
    setPassword('');
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
  }
};


  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.name, { flex: 1 }]}>{item}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonHome}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonHomeText}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeFavorite(item)}>
            <Feather name="trash-2" size={20} color="#e53935" />
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


      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>


      <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={() => setModalVisible(false)}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
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

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <Text style={styles.modalSubtitle}>
              Altere seu nome ou e-mail quando quiser.
            </Text>

            <TextInput
              placeholder="Nome"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input}
              theme={{
                roundness: 12,
                colors: {
                  primary: "#FF8F53",
                  background: "#fff",
                  placeholder: "#aaa",
                  text: "#000",
                },
              }}
            />

            <TextInput
              placeholder="E-mail"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              theme={{
                roundness: 12,
                colors: {
                  primary: "#FF8F53",
                  background: "#fff",
                  placeholder: "#aaa",
                  text: "#000",
                },
              }}
            />

            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ display: "flex", padding: 10 }}>
        <Text style={styles.title}>Cidades favoritas:</Text>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma cidade salva.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
    marginTop: 150,
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
