import { Image, Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/header/header";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Modal, TextInput } from "react-native";
import axios from 'axios';
import { API_URL_BACK } from '@env'; // se ainda não tiver importado

export default function Perfil() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
      <Text style={styles.name}>{item}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonHome} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonHomeText}>Ver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRemove} onPress={() => removeFavorite(item)}>
          <Text style={styles.buttonRemoveText}>X</Text>
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
        <Image style={styles.image} source={require('../../assets/photo.png')} />

        <View style={styles.infosContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

        </View>
      </View>

        <View style={{ display: "flex",padding: 10 }}>
            <Text style={styles.title}>Cidades favoritas:</Text>

            {favorites.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum personagem salvo.</Text>
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
    flexDirection: 'column'
  },
    title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 30,
  },
    emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 360,
  },
  buttonsContainer: {
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
  marginLeft: 15,
},
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContainer: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
  fontSize: 16,
},
    card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
  },
buttonHome: {
  borderWidth: 1,
  borderColor: "#00000045",
  borderRadius: 5,
  width: 60,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f2f2f2',
},


buttonRemove: {
  backgroundColor: "#cf1212c7",
  borderRadius: 5,
  width: 60,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
},

buttonHomeText: {
  textAlign: 'center',
  color: '#000',
  fontWeight: '600',
},
buttonRemoveText: {
  color: "white",
  textAlign: 'center',
  fontWeight: 'bold',
},
    info: {
    padding: 10,
    flexDirection: 'row'
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginTop: 50
  },
  infosContainer: {
        display: 'flex',
  },
  image: {
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
    button: {
  marginTop: 10,
  backgroundColor: '#FF8F53',
  borderRadius: 10,
  width: 120,
  height: 35,
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
    alignSelf: 'center',
},
buttonText: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'center',
}
});
