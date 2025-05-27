
import {Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

export default function Header() {
    const navigation = useNavigation<any>();
    
    return (
        <View style={styles.container}>
            <View style={styles.name}>
            <Image style={styles.image} source={require('../../assets/logo.png')}/>
            <Text style={styles.title}>Future Stack</Text>
            
            </View>

            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <MaterialIcons name="logout" size={24} color="#1e3fad" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
      name: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 40,
    },
    headerIcons: {
        marginTop: 40,
    },
    image: {
        width: 45,
        height: 45,
    },
    container: {
        width: '100%',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: '#ABD5FF',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    title: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
});