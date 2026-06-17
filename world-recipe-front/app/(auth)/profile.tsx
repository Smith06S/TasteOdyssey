import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, Pressable, ActivityIndicator, Platform, Image, ScrollView, Alert} from 'react-native';
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

interface UserRating {
    id: number;
    stars: number;
    dish: {
        id: number;
        dishName: string;
        slug: string;
        imageUrl: string | null;
    } | null;
}

interface FavoriteDish {
    dish: {
        id: number;
        dishName: string;
        slug: string;
        imageUrl: string | null;
    } | null;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { userToken, logout, isLoading } = useAuth();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [ratings, setRatings] = useState<UserRating[]>([]);
    const [favorites, setFavorites] = useState<FavoriteDish[]>([]);

    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return;

        if (!userToken) {
            router.replace('/authentification');
            return;
        }

        const fetchAllProfileData = async () => {
            try {
                const userResponse = await fetch('http://localhost:8090/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Impossible de récupérer les informations du profil.');
                }

                const userData: UserProfile = await userResponse.json();
                setUser(userData);

                const ratingsResponse = await fetch(`http://localhost:8090/ratings/user/${userData.id}?limit=5`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (ratingsResponse.ok) {
                    const ratingsData = await ratingsResponse.json();
                    setRatings(ratingsData);
                }

                const favoritesResponse = await fetch('http://localhost:8090/like-dishes/my-favorites', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    const parsedFavorites = Array.isArray(favoritesData)
                        ? favoritesData
                        : (favoritesData._embedded?.likeDishResponseList || []);

                    const cleanedFavorites = parsedFavorites.map((item: any) => item.content ? item.content : item);
                    setFavorites(cleanedFavorites);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchAllProfileData();
    }, [userToken, isLoading]);

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

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Supprimer mon compte",
            "Êtes-vous sûr de vouloir supprimer votre compte définitivement ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await fetch(`http://localhost:8090/users/${user?.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${userToken}` }
                            });

                            if (res.ok) {
                                Alert.alert("Succès", "Compte supprimé.");
                                await logout();
                                router.replace('/authentification');
                            } else {
                                Alert.alert("Erreur", "La suppression a échoué.");
                            }
                        } catch (err) {
                            Alert.alert("Erreur", "Impossible de contacter le serveur.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading || loadingProfile) {
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

                    <View style={styles.avatarContainer}>
                        {user?.userImage ? (
                            <Image source={{ uri: user.userImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderText}>
                                    {user?.username?.substring(0, 2).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.title}>{user?.username || 'Mon Profil'}</Text>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Nom d'utilisateur :</Text>
                                    <Text style={styles.value}>{user?.username}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Email :</Text>
                                    <Text style={styles.value}>{user?.email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Rôle :</Text>
                                    <Text style={[styles.value, styles.roleBadge]}>{user?.role}</Text>
                                </View>

                                <View style={styles.bioBlock}>
                                    <Text style={styles.label}>Biographie :</Text>
                                    <Text style={styles.bioValue}>
                                        {user?.biography || "Aucune biographie rédigée pour le moment."}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Mes 5 meilleures notes</Text>
                                {ratings.length === 0 ? (
                                    <Text style={styles.emptyText}>Vous n'avez pas encore attribué de note.</Text>
                                ) : (
                                    ratings.map((rating) => (
                                        <Pressable
                                            key={rating.id}
                                            style={styles.listItem}
                                            onPress={() => {
                                                if (rating.dish?.slug) {
                                                    router.push(`/(tabs)/${rating.dish.slug}` as any);
                                                }
                                            }}
                                        >
                                            <Text style={styles.listItemText}>{rating.dish?.dishName}</Text>
                                            <Text style={styles.starsText}>
                                                {'★'.repeat(rating.stars)}{'☆'.repeat(5 - rating.stars)}
                                            </Text>
                                        </Pressable>
                                    ))
                                )}
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Mes plats favoris</Text>
                                {favorites.length === 0 ? (
                                    <Text style={styles.emptyText}>Aucun plat favori pour le moment.</Text>
                                ) : (
                                    favorites.map((fav, index) => (
                                        <Pressable
                                            key={fav.dish?.id || index}
                                            style={styles.listItem}
                                            onPress={() => {
                                                if (fav.dish?.slug) {
                                                    router.push(`/(tabs)/${fav.dish.slug}` as any);
                                                }
                                            }}
                                        >
                                            <View style={styles.favDishContainer}>
                                                {fav.dish?.imageUrl && (
                                                    <Image source={{ uri: fav.dish.imageUrl }} style={styles.miniDishImage} />
                                                )}
                                                <Text style={styles.listItemText}>{fav.dish?.dishName}</Text>
                                            </View>
                                            <Text style={styles.heartIcon}>❤️</Text>
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        </>
                    )}

                    <Pressable style={styles.btnEdit} onPress={() => router.push('/update-profile')}>
                        <Text style={styles.btnEditText}>Modifier mon profil</Text>
                    </Pressable>

                    <Pressable style={styles.btnLogout} onPress={handleLogout}>
                        <Text style={styles.btnLogoutText}>Déconnexion</Text>
                    </Pressable>

                    <Pressable style={styles.btnDelete} onPress={handleDeleteAccount}>
                        <Text style={styles.btnDeleteText}>Supprimer mon compte</Text>
                    </Pressable>
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
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#FAF6EE',
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#C05A32',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FAF6EE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(47, 34, 20, 0.15)',
    },
    avatarPlaceholderText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 24,
        fontWeight: '700',
        color: '#C05A32',
    },
    title: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 28,
        fontWeight: '700',
        color: '#2F2214',
        marginBottom: 24,
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        marginBottom: 24,
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(47, 34, 20, 0.08)',
        paddingBottom: 12,
    },
    bioBlock: {
        flexDirection: 'column',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(47, 34, 20, 0.08)',
        paddingBottom: 12,
    },
    label: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 13,
        fontWeight: '600',
        color: '#2F2214',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 15,
        color: '#2F2214',
    },
    roleBadge: {
        color: '#7A9B6B',
        fontWeight: '600',
    },
    bioValue: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        color: '#555555',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    sectionContainer: {
        width: '100%',
        marginBottom: 28,
    },
    sectionTitle: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 20,
        fontWeight: '700',
        color: '#2F2214',
        marginBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#C05A32',
        paddingBottom: 4,
    },
    emptyText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 13,
        color: '#888888',
        fontStyle: 'italic',
        paddingVertical: 4,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(47, 34, 20, 0.05)',
    },
    listItemText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        color: '#2F2214',
        fontWeight: '500',
    },
    starsText: {
        color: '#C05A32',
        fontSize: 14,
        letterSpacing: 2,
    },
    favDishContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    miniDishImage: {
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#FAF6EE',
    },
    heartIcon: {
        fontSize: 14,
    },
    errorText: {
        color: '#BA3C2A',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        textAlign: 'center',
        marginBottom: 20,
    },
    btnEdit: {
        backgroundColor: '#C05A32',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnEditText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#FAF6EE',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    btnLogout: {
        backgroundColor: '#BA3C2A',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnLogoutText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#FAF6EE',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    btnDelete: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#BA3C2A',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 12,
    },
    btnDeleteText: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        color: '#BA3C2A',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});