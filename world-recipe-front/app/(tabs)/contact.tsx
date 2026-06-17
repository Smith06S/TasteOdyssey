import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Footer from "../../components/Footer";

export default function ContactScreen() {
    const { userToken } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm(prev => ({ ...prev, message: '' }));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userToken) return;

            try {
                const response = await fetch('http://localhost:8090/users/me', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setForm(prev => ({
                        ...prev,
                        name: userData.username || '',
                        email: userData.email || ''
                    }));
                }
            } catch (err) {
                console.error("Erreur chargement profil pour contact:", err);
            }
        };

        fetchUserData();
    }, [userToken]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
            {/* On réutilise la carte du profil ici */}
            <View style={styles.card}>
                <Text style={styles.title}>Contactez-nous</Text>
                <Text style={styles.subtitle}>Une question ? Une suggestion ? Laissez-nous un message.</Text>

                {submitted ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>Merci ! Votre message a bien été pris en compte.</Text>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Votre nom"
                            value={form.name}
                            onChangeText={(t) => setForm({...form, name: t})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Votre email"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(t) => setForm({...form, email: t})}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Votre message"
                            multiline
                            numberOfLines={4}
                            value={form.message}
                            onChangeText={(t) => setForm({...form, message: t})}
                        />
                        <Pressable style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Envoyer</Text>
                        </Pressable>
                    </View>
                )}
            </View>
            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    // Carte identique à celle du profil
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
        alignItems: 'center',
    },
    title: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 28,
        fontWeight: '700',
        color: '#2F2214',
        marginBottom: 10
    },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    form: { width: '100%' },
    input: { backgroundColor: '#FAF6EE', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.1)' },
    textArea: { height: 120, textAlignVertical: 'top' },
    submitButton: { backgroundColor: '#C05A32', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
    submitButtonText: { color: '#FFF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    successContainer: { padding: 40, backgroundColor: '#7A9B6B', borderRadius: 8 },
    successText: { color: '#FFF', textAlign: 'center', fontSize: 16 }
});