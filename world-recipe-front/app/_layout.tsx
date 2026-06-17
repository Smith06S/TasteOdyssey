import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
    return (
        <AuthProvider>
            <View style={styles.container}>
                <Navbar />
                <Slot />
            </View>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 }
});