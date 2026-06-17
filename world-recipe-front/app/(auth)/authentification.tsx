import React, { useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import Footer from "../../components/Footer";

const API_URL = 'http://localhost:8090/api/v1/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        try {
            const cleanUsername = username.trim().toLowerCase();
            const cleanPassword = password.trim();

            const response = await fetch(`${API_URL}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    password: cleanPassword,
                }),
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Identifiants incorrects ou utilisateur introuvable.");
                } catch {
                    setErrorMessage("Une erreur est survenue lors de l'authentification.");
                }
                return;
            }

            const data = await response.json();
            console.log('Connexion réussie, Token JWT.');

            await login(data.token);

            if (Platform.OS === 'web') {
                alert("Connexion Réussie ! Votre Token JWT a bien été généré par l'API.");
                router.push('/');
            } else {
                Alert.alert(
                    "Connexion Réussie !",
                    "Votre Token JWT a bien été généré par l'API.",
                    [
                        {
                            text: "Super, redirection !",
                            onPress: () => {
                                router.push('/');
                            }
                        }
                    ]
                );
            }

        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            setErrorMessage("Impossible de joindre le serveur. Vérifiez que votre API Spring Boot est lancée.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.scrollContainer}>
                <Text style={styles.title}>Se connecter</Text>
                <Text style={styles.subtitle}>Connectez-vous</Text>


                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <TextInput
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor="#6B5A4C"
                    autoCapitalize="words"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#6B5A4C"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/register')}
                >
                    <Text style={styles.linkText}>
                        Pas de compte ? <Text style={styles.linkTextBold}>Créer un compte</Text>
                    </Text>
                </TouchableOpacity>
            </View>
            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6EE',
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#FAF6EE',
        marginBottom: -60
    },
    title: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2F2214',
        marginBottom: 6,
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 15,
        color: '#7A9B6B',
        marginBottom: 28,
        textAlign: 'center',
        fontWeight: '500'
    },
    errorText: {
        color: '#A6261B',
        backgroundColor: '#F7E3E1',
        padding: 14,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15
    },
    input: {
        width: '100%',
        maxWidth: 400,
        height: 52,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(47, 34, 20, 0.25)',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        fontSize: 16,
        color: '#2F2214',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif'
    },
    button: {
        backgroundColor: '#C05A32',
        paddingVertical: 14,
        borderRadius: 8,
        width: '100%',
        maxWidth: 400,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    buttonText: {
        color: '#FAF6EE',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    linkButton: {
        marginTop: 24,
        padding: 12,
    },
    linkText: {
        color: '#4B3621',
        fontSize: 15,
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif'
    },
    linkTextBold: {
        color: '#C05A32',
        fontWeight: '700',
        textDecorationLine: 'underline',
    }
});