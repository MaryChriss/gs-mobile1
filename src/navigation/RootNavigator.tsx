import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from 'react-native';
import BottomTabsNavigator from "./BottomTabsNavigator";
import Login from "../screens/Login";
import Register from "../screens/Register";


export type RootStackParamList = {
  Home: undefined;
  Configuration: undefined;
  Login: undefined;
  Register: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d2929',
    alignItems: 'center',
    justifyContent: 'center',
  },
});