import {Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import Header from "../../components/header/header";
import { TextInput } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL_BACK } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const [text, setText] = useState('');
    const [dadosCidade, setDadosCidade] = useState<any | null>(null);
    const [region, setRegion] = useState({
      latitude: -8.0476,
      longitude: -34.8770,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    const [buscouCidade, setBuscouCidade] = useState(false);
    const mapvision = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

const buscarCidade = async () => {
  try {

      const storedId = await AsyncStorage.getItem('@userId');

      if (!storedId) {
      console.log("Usuário não encontrado no AsyncStorage");
      return;
    }

    setBuscouCidade(true);

      const idUsuario = parseInt(storedId, 10);

    const response = await axios.get(`${API_URL_BACK}/dados`, {
      params: {
        cidade: text,
        idUsuario: idUsuario,
        size: 1,
        page: 0,
      },
    });

    if (response.data?.content?.length > 0) {
  const dados = response.data.content[0];
  setDadosCidade(dados);

  // Atualiza o mapa com a nova cidade
if (dados.latApi && dados.lonApi) {
  console.log("Atualizando região para:", dados.latApi, dados.lonApi);
  setRegion({
    latitude: dados.latApi,
    longitude: dados.lonApi,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
} else {
  console.warn("Lat/Lon não encontrados em dados:", dados);
}
  }
  } catch (error) {
    console.log("Erro ao buscar cidade:", error);
    setDadosCidade(null);
  }
};

const getIconeClima = (descricao: string) => {
  switch (descricao.toLowerCase()) {
    case 'light rain':
      return 'weather-rainy';
    case 'moderate rain':
      return 'weather-pouring';
    case 'heavy intensity rain':
      return 'weather-lightning-rainy';
    case 'scattered clouds':
      return 'weather-cloudy';
    case 'broken clouds':
    case 'overcast clouds':
      return 'weather-cloudy-alert';
    default:
      return 'weather-partly-cloudy';
  }
};

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.searchRow}>
  <TextInput
    style={styles.input}
    value={text}
    onChangeText={setText}
    underlineColor="transparent"
    mode="outlined"
    outlineColor="#fff"
    activeOutlineColor="#fff"
    theme={{ colors: { text: '#000', background: '#fff' } }}
    placeholder="Pesquisar local"
  />
  <TouchableOpacity style={styles.searchButton} onPress={buscarCidade}>
    <MaterialCommunityIcons name="magnify" size={28} color="#fff" />
  </TouchableOpacity>
</View>

            <MapView
              style={styles.map}
              region={region} // aqui!
              customMapStyle={mapvision}
            >
              <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
            </MapView>

            {buscouCidade && !dadosCidade && (
  <Text style={styles.mensagemNaoEncontrado}>
  😕 Cidade não encontrada. Tente outra busca!
</Text>

)}


          {dadosCidade && (
          <View style={styles.card}>
            <View style={styles.header}>
              <MaterialCommunityIcons
                name={getIconeClima(dadosCidade.descricaoClima)}
                size={48}
                color="#000"
                style={styles.icon}
              />
              <View>
                <Text style={styles.city}>{dadosCidade.cidade}</Text>
                <Text style={styles.condition}>{dadosCidade.condicao}</Text>
              </View>
            </View>

            <Text style={styles.temp}>{dadosCidade.temperatura} °C</Text>
            <Text style={styles.info}>Umidade: {dadosCidade.umidade}</Text>
            <Text style={styles.info}>Vento: {dadosCidade.ventoVelocidade}</Text>
          </View>
        )}


        </View>
    );
}

const styles = StyleSheet.create({
filialTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 150,
    marginLeft: 40,
},
container: {
    flex: 1,
},
searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#ABD5FF',
  paddingHorizontal: 16,
  paddingVertical: 10,
  gap: 10, // opcional se quiser espaçamento entre input e botão
},
mensagemNaoEncontrado: {
  textAlign: 'center',
  marginTop: 0,
  fontSize: 16,
  color: '#555',
  fontStyle: 'italic',
},

searchButton: {
  backgroundColor: '#007BFF',
  borderRadius: 10,
  padding: 10,
  marginLeft: 10,
},

card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: '90%',
    alignSelf: 'center',
    marginTop: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
},
header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
},
icon: {
    marginRight: 12,
},
city: {
    fontSize: 18,
    fontWeight: '600',
},
condition: {
    fontSize: 14,
    color: '#555',
},
temp: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
},
info: {
    fontSize: 14,
    color: '#333',
},
map: {
  width: '90%',
  height: 280, 
  alignSelf: 'center',
  marginTop: 46,
  overflow: 'hidden', 
},
search: {
    backgroundColor: '#ABD5FF',
    width: '100%',
    height: 80,
    marginTop:0,
},
input: {
  flex: 1,
  backgroundColor: '#fff',
  height: 44,
  fontSize: 16,
  borderRadius: 10,
},
});