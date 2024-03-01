import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { distance } = route.params; // Recuperando la distancia pasada como parámetro
  const { correctAnswers } = route.params;
  const handlePlayAgainPress = () => {
    navigation.navigate('StartScreen');
  };

  return (
    <View style={styles.container}>
      <Text>Tu puntuación es: {correctAnswers}</Text>
      <TouchableOpacity onPress={handlePlayAgainPress} style={styles.button}>
        <Text>Jugar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  distanceText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default ResultScreen;
