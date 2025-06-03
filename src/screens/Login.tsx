import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity, } from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

export default function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const apiUrl = process.env.API_URL_BACK;

  useEffect(() => {
    const loadSavedData = async () => {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const user = JSON.parse(data);
        setEmail(user.email);
      }
    };
    loadSavedData();
  }, []);


const handleLogin = async () => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Email ou senha inválidos.");
    }

    const data = await response.json();
    console.log("Resposta login:", data);

    await AsyncStorage.setItem('userData', JSON.stringify({
      id: data.id,
      name: data.nome,
      email: data.email,
      token: data.token,
      type: data.type
    }));

    navigation.navigate('Home');

  } catch (error) {
    showMessage({
      message: "Erro",
      description: (error instanceof Error ? error.message : "Não foi possível fazer login."),
      type: "danger",
    });
  }
};

  return (
    <ImageBackground
      source={require("../../assets/wppLogin.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.containerPhases}>
          <Text style={styles.title}>
            Bem-vindo ao{"\n"}
            <Text>Future Stack</Text>
          </Text>
          <Text style={styles.subtitle}>
            Fique por dentro das condições do tempo em tempo real, ajude a
            proteger sua comunidade com tecnologia.
          </Text>
        </View>

        <View style={styles.containereverything}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginLabel}>Login:</Text>
            <TextInput
              placeholder="E-mail"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              theme={{
                roundness: 15,
                colors: {
                  primary: "#ff8f533e",
                  background: "#fff",
                  placeholder: "#999",
                  text: "#000",
                },
              }}
            />

            <TextInput
              placeholder="Senha"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              theme={{
                roundness: 15,
                colors: {
                  primary: "#ff8f533e",
                  background: "#fff",
                  placeholder: "#999",
                  text: "#000",
                },
              }}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text
            style={styles.buttonText}
            onPress={() => navigation.navigate("Register")}
          >
            Não tem cadastro? Cadastre-se
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    color: "#2E9936",
  },
  container: {
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  containerPhases: {
    marginTop: -70,
  },
  title: {
    textAlign: "center",
    color: "#000000",
    fontSize: 40,
  },
  titleHighlight: {
    color: "#34c43d",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#000000",
    fontSize: 18,
    marginTop: 8,
  },
  loginContainer: {
    marginTop: 100,
  },
  loginLabel: {
    color: "#000000",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  containereverything: {
    marginBottom: -100,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF8F53",
    borderRadius: 15,
    width: "50%",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
