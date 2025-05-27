import { Text, View, StyleSheet } from "react-native";
import Header from "../../components/header/header";

export default function Historico() {
    return (
        <View style={styles.container}>
            <Header/>
        <Text>Histórico</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
},
});