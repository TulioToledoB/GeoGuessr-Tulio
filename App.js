import React, { useState, useRef } from "react";
import { View, Button, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Crosshair } from "react-native-feather";

const App = () => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const mapRef = useRef(null);

  const handlePress = () => {
    if (mapRef.current) {
      mapRef.current
        .getCamera()
        .then((camera) => {
          const center = {
            latitude: camera.center.latitude,
            longitude: camera.center.longitude,
          };
          setMarkerPosition(center);
          // Calcular la distancia entre el punto fijado por el marcador y el centro marcado por el crosshair
          const distanceInMeters = calculateDistance(center, markerPosition);
          setDistance(distanceInMeters);

          // Actualizar las coordenadas de la línea
          setPolylineCoordinates([markerPosition, center]);
        })
        .catch((e) => {
          console.error("Error obteniendo la cámara del mapa:", e);
        });
    }
  };

  const calculateDistance = (point1, point2) => {
    const radiusOfEarth = 6371; // Radio de la Tierra en kilómetros
    const lat1 = deg2rad(point1.latitude);
    const lon1 = deg2rad(point1.longitude);
    const lat2 = deg2rad(point2.latitude);
    const lon2 = deg2rad(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radiusOfEarth * c; // Distancia en kilómetros
    return distance;
  };

  const deg2rad = (degree) => {
    return degree * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 41.7220833,
          longitude: 1.815919,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markerPosition && <Marker coordinate={markerPosition} />}
        {polylineCoordinates.length === 2 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeWidth={2}
            strokeColor="red"
          />
        )}
      </MapView>
      <View />
      <Crosshair style={styles.crosshair} width={40} height={40} />
      <Button
        title="Marcar Centro"
        onPress={handlePress}
        style={styles.button}
      />
      {distance !== null && (
        <Text style={styles.distanceText}>
          Distancia entre el punto fijado y el centro: {distance.toFixed(2)} km
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 50,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get("window").height * 0.6,
    marginTop: 50,
    marginBottom: 50,
    borderColor: "blue",
    borderWidth: 3,
  },
  crosshair: {
    position: "absolute",
    top: "39%",
    marginLeft: -15,
    marginTop: -15,
  },
  button: {
    position: "absolute",
    bottom: 10,
  },
  distanceText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
