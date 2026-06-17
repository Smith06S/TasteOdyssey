import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const { userToken, logout } = useAuth();
    const isLoggedIn = !!userToken;


    const handleLogout = async () => {
        try {
            if (userToken) {
                await fetch('http://localhost:8090/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion auprès de l\'API:', error);
        } finally {
            await logout();
            router.replace('/authentification');
        }
    };

    return (
        <View style={styles.navbar}>
            <Link href="/" asChild>
                <Pressable style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logoTasteOdyssey.webp')}
                        style={styles.logoIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.brandName}>TasteOdyssey</Text>
                </Pressable>
            </Link>

            <View style={styles.navLinks}>
                <Link href="/" asChild>
                    <Pressable style={styles.linkButton}>
                        <Text style={styles.linkText}>Accueil</Text>
                    </Pressable>
                </Link>

                <Link href="/recipes" asChild>
                    <Pressable style={styles.linkButton}>
                        <Text style={styles.linkText}>Recettes</Text>
                    </Pressable>
                </Link>

                {!isLoggedIn ? (
                    <>
                        <Link href="/authentification" asChild>
                            <Pressable style={styles.linkButton}>
                                <Text style={styles.linkText}>Connexion</Text>
                            </Pressable>
                        </Link>

                        <Link href="/register" asChild>
                            <Pressable style={styles.btnPrimary}>
                                <Text style={styles.btnPrimaryText}>Inscription</Text>
                            </Pressable>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/profile" asChild>
                            <Pressable style={styles.linkButton}>
                                <Text style={[styles.linkText, styles.profileLink]}>Mon Profil</Text>
                            </Pressable>
                        </Link>

                        <Pressable style={styles.linkButton} onPress={handleLogout}>
                            <Text style={[styles.linkText, { color: '#BA3C2A' }]}>Déconnexion</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FAF6EE',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(47, 34, 20, 0.08)',
        ...Platform.select({
            web: {
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            },
        }),
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoIcon: {
        width: 38,
        height: 38,
    },
    brandName: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 22,
        fontWeight: '700',
        color: '#2F2214',
        letterSpacing: 0.5,
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    linkButton: {
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    linkText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        fontWeight: '500',
        color: '#2F2214',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileLink: {
        color: '#7A9B6B',
        fontWeight: '600',
    },
    btnPrimary: {
        backgroundColor: '#C05A32',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnPrimaryText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#FAF6EE',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});