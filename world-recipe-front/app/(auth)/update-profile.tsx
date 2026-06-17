import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Platform, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Footer from "../../components/Footer";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    biography: string | null;
    userImage: string | null;
}

export default function UpdateProfileScreen() {
    const router = useRouter();
    const { userToken, isLoading } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [biography, setBiography] = useState('');
    const [userImage, setUserImage] = useState('');
    const [password, setPassword] = useState('');

    const [loadingData, setLoadingData] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (isLoading) return;

        if (!userToken) {
            router.replace('/authentification');
            return;
        }

        const fetchCurrentData = async () => {
            try {
                const response = await fetch('http://localhost:8090/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des informations du profil.');
                }

                const data: UserProfile = await response.json();

                setUsername(data.username);
                setEmail(data.email);
                setBiography(data.biography || '');
                setUserImage(data.userImage || '');
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setLoadingData(false);
            }
        };

        fetchCurrentData();
    }, [userToken, isLoading]);

    const handleUpdate = async () => {
        if (!username.trim() || !email.trim()) {
            setError("Le nom d'utilisateur et l'email ne peuvent pas être vides.");
            return;
        }

        setUpdating(true);
        setError(null);
        setSuccess(false);

        const userRequest: Record<string, any> = {
            username: username,
            email: email,
            biography: biography,
            userImage: userImage,
        };

        if (password && password.trim().length > 0) {
            userRequest.password = password;
        }

        try {
            const response = await fetch('http://localhost:8090/users/me', {
                method: 'PATCH', //
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRequest),
            });

            if (!response.ok) {
                throw new Error('Échec de la mise à jour du profil.');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/profile');
            }, 1500);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erreur lors de la communication avec le serveur.');
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading || loadingData) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#C05A32" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.title}>Modifier mon profil</Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {success && <Text style={styles.successText}>Profil mis à jour avec succès !</Text>}

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nom d'utilisateur</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Votre pseudo"
                                placeholderTextColor="#888"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Adresse Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="exemple@domaine.com"
                                placeholderTextColor="#888"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>URL de l'image de profil</Text>
                            <TextInput
                                style={styles.input}
                                value={userImage}
                                onChangeText={setUserImage}
                                placeholder="https://lien-vers-votre-image.jpg"
                                placeholderTextColor="#888"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Biographie</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={biography}
                                onChangeText={setBiography}
                                placeholder="Parlez-nous de vous..."
                                placeholderTextColor="#888"
                                multiline={true}
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nouveau mot de passe (optionnel)</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Laissez vide si inchangé"
                                placeholderTextColor="#888"
                                secureTextEntry={true}
                                autoCapitalize="none"
                            />
                        </View>

                        <Pressable
                            style={[styles.btnSubmit, updating && styles.btnDisabled]}
                            onPress={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? (
                                <ActivityIndicator color="#FAF6EE" />
                            ) : (
                                <Text style={styles.btnSubmitText}>Enregistrer les modifications</Text>
                            )}
                        </Pressable>

                        <Pressable style={styles.btnCancel} onPress={() => router.push('/profile')}>
                            <Text style={styles.btnCancelText}>Annuler</Text>
                        </Pressable>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6EE',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#FAF6EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 500,
        padding: 32,
        borderRadius: 12,
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    title: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 26,
        fontWeight: '700',
        color: '#2F2214', //
        marginBottom: 24,
        textAlign: 'center',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 12,
        fontWeight: '600',
        color: '#2F2214',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        borderWidth: 1,
        borderColor: 'rgba(47, 34, 20, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#2F2214',
        backgroundColor: '#FAF6EE',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    btnSubmit: {
        backgroundColor: '#C05A32',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnDisabled: {
        backgroundColor: 'rgba(192, 90, 50, 0.6)',
    },
    btnSubmitText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#FAF6EE',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    btnCancel: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    btnCancelText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#BA3C2A',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    errorText: {
        color: '#BA3C2A',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: '#7A9B6B',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
});