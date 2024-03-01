import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const initialRegion = {
  latitude: 41.387920,
  longitude: 2.169920,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const GameScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userMarkerPosition, setUserMarkerPosition] = useState(null);
  const [correctMarkerPosition, setCorrectMarkerPosition] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [distanceText, setDistanceText] = useState("");
  const [showLine, setShowLine] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const mapRef = useRef(null);


  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, 'ciudades'));
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(cities);
      selectRandomCity(cities);
    };

    fetchQuestions();
  }, []);

  const selectRandomCity = (cities) => {
    if (cities.length > 0) {
      const randomIndex = Math.floor(Math.random() * cities.length);
      setCurrentQuestion(cities[randomIndex]);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setCorrectMarkerPosition({
        latitude: currentQuestion.latitud,
        longitude: currentQuestion.longitud,
      });
    }
  }, [currentQuestion]);

  const handleMapPress = (event) => {
    setUserMarkerPosition(event.nativeEvent.coordinate);
    setShowLine(false);
    setDistanceText(""); // Resetear texto de distancia
  };

  const calculateDistance = (point1, point2) => {
    const radiusOfEarth = 6371; // Radio de la Tierra en kilómetros
    const lat1 = deg2rad(point1.latitude);
    const lon1 = deg2rad(point1.longitude);
    const lat2 = deg2rad(point2.latitude);
    const lon2 = deg2rad(point2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radiusOfEarth * c; // Devuelve la distancia en kilómetros
  };

  const deg2rad = (degree) => {
    return degree * (Math.PI / 180); // Convierte grados a radianes
  };

  const handleCheckAnswer = () => {
    if (!userMarkerPosition) {
      Alert.alert("Error", "Por favor, coloca un marcador en el mapa.");
      return;
    }

    const distanceInKm = calculateDistance(userMarkerPosition, correctMarkerPosition);
    setShowLine(true);
    setDistanceText(`Distancia: ${distanceInKm.toFixed(2)} km`);

    if (distanceInKm < 50) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setUserMarkerPosition(null);
      setShowLine(false);
      setDistanceText("");
      selectRandomCity(questions);
    } else {
      navigation.navigate('ResultScreen', { correctAnswers });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>¿Dónde está ubicada {currentQuestion ? currentQuestion.nombre : ''}?</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {userMarkerPosition && <Marker coordinate={userMarkerPosition} />}
        {showLine && correctMarkerPosition && (
          <>
            <Marker coordinate={correctMarkerPosition} />
            <Polyline
              coordinates={[userMarkerPosition, correctMarkerPosition]}
              strokeColor="#000"
              strokeWidth={3}
            />
          </>
        )}
      </MapView>
      <Text style={styles.distanceText}>{distanceText}</Text>
      <Button title="Comprobar Respuesta" onPress={handleCheckAnswer} />
      <Button title="Siguiente Pregunta" onPress={handleNextQuestion} />
      <Button title="Finalizar Juego" onPress={() => navigation.navigate('ResultScreen', { correctAnswers })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  distanceText: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
  },
});

export default GameScreen;
