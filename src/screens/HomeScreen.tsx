import {Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import Header from "../../components/header/header";
import { TextInput } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Home() {
    const [text, setText] = useState('');
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

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.search}>
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
            </View>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -8.0476,
                    longitude: -34.8770,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                customMapStyle={mapvision}
                >
                <Marker coordinate={{ latitude: -8.0476, longitude: -34.8770 }} />
            </MapView>

            <View style={styles.card}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="weather-rainy" size={48} color="#000" style={styles.icon} />
                    <View>
                    <Text style={styles.city}>Recife</Text>
                    <Text style={styles.condition}>Chuva moderada</Text>
                    </View>
                </View>

                <Text style={styles.temp}>26 °C</Text>
                <Text style={styles.info}>Umidade: 757</Text>
                <Text style={styles.info}>Vento: w8r4/h</Text>
            </View>

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
    backgroundColor: '#fff',
    height: 40,
    fontSize: 16,
    width: '90%',
    marginLeft: 20,
    marginTop: 15,
},
});