import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ width: '90%', height: 180 }}
  initialRegion={{
    latitude: -8.0476,
    longitude: -34.8770,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  <Marker coordinate={{ latitude: -8.0476, longitude: -34.8770 }} />
</MapView>
