import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="dark" />
    </>
  );
}