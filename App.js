import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './Screens/StartScreen';
import GameScreen from './Screens/GameScreen';
import ResultScreen from './Screens/ResultScreen';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;