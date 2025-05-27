import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";

export default function Register() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showMessage({
        message: "Erro", 
        description: "Preencha todos os campos.",
        type: "danger",
      })
      return;
    }

      if (!validateEmail(email)) {
    showMessage({
      message: "Erro",
      description: "Digite um email válido.",
      type: "danger",
    });
    return;
  }

    const userData = { name, email, password };
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    showMessage({
      message: "Sucesso",
      description: "Cadastro realizado com sucesso.",
      type: "success",
    });
    setName('');
    setEmail('');
    setPassword('');
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/wppLogin.png')}
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
            Fique por dentro das condições do tempo em tempo real, ajude a proteger sua comunidade com tecnologia.
          </Text>
        </View>

        <View style={styles.containereverything}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginLabel}>Cadastro:</Text>
            <TextInput
                placeholder="Nome"
                mode="outlined"
                value={name}
                onChangeText={setName}
                style={styles.input}
                theme={{
                    roundness: 15,
                    colors: {
                    primary: '#ff8f533e',
                    background: '#fff',
                    placeholder: '#999',
                    text: '#000'
                    }
                }}
                />
            <TextInput
                placeholder="E-mail"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                theme={{
                    roundness: 15,
                    colors: {
                    primary: '#ff8f533e',
                    background: '#fff',
                    placeholder: '#999',
                    text: '#000'
                    }
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
                    primary: '#ff8f533e',
                    background: '#fff',
                    placeholder: '#999',
                    text: '#000'
                    }
                }}
                />

          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.buttonText} onPress={() => navigation.navigate('Login')}>
            Já tem conta? Login
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    color: '#2E9936',
  },
  container: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerPhases: {
    marginTop: -70,
  },
  title: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 40,
  },
  titleHighlight: {
    color: '#34c43d',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    marginTop: 8,
  },
  loginContainer: {
    marginTop: 100,
  },
  loginLabel: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containereverything: {
    marginBottom: -100,
  },
  input: {
  marginBottom: 12,
  backgroundColor: '#ffffff',
  borderRadius: 15,
  fontSize: 16,
  elevation: 2,
},

  button: {
  marginTop: 20,
  backgroundColor: '#FF8F53',
  borderRadius: 15,
  width: '50%',
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
    alignSelf: 'center',
marginBottom: 20,
},
buttonText: {
  color: '#000000',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
}

});