import React, { useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Footer from "../../components/Footer";

const API_URL = 'http://localhost:8090/api/v1/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (!username.trim() || !email.trim() || !password.trim()) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const cleanUsername = username.trim();
            const cleanEmail = email.trim().toLowerCase();
            const cleanPassword = password.trim();

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    email: cleanEmail,
                    password: cleanPassword,
                }),
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Impossible de créer le compte. Vérifiez vos informations.");
                } catch {
                    setErrorMessage(`Erreur serveur : Code ${response.status} (${response.statusText})`);
                }
                return;
            }

            const data = await response.json();
            await login(data.token);

            setSuccessMessage("Compte créé avec succès !");

            if (Platform.OS === 'web') {
                alert("Votre compte a été créé avec succès ! Redirection vers la page de connexion.");
                router.push('/authentification');
            } else {
                Alert.alert(
                    "Inscription réussie !",
                    "Votre compte Taste Odyssey a bien été créé.",
                    [
                        {
                            text: "Se connecter",
                            onPress: () => router.push('/authentification')
                        }
                    ]
                );
            }

            router.push('/');

        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            setErrorMessage("Impossible de joindre le serveur. Vérifiez que votre API Spring Boot est lancée.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.scrollContainer}>
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez l'aventure Taste Odyssey</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                {successMessage ? (
                    <Text style={styles.successText}>{successMessage}</Text>
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
                    placeholder="Adresse Email"
                    placeholderTextColor="#6B5A4C"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#6B5A4C"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/authentification')}
                >
                    <Text style={styles.linkText}>
                        Déjà un compte ? <Text style={styles.linkTextBold}>Se connecter</Text>
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
    successText: {
        color: '#3B5E2B',
        backgroundColor: '#EAF2E6',
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