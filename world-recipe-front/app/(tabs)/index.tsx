import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Pressable,
    Image,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {useEffect, useState} from "react";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {useAuth} from "../../context/AuthContext";
import Footer from "../../components/Footer";

const COUNTRIES = [
    { id: '1', name: 'Mexique', image: require('../../assets/images/imageMexique.webp') },
    { id: '2', name: 'Italie', image: require('../../assets/images/imageItalie.webp') },
    { id: '3', name: 'Japon', image: require('../../assets/images/imageJapon.webp') },
    { id: '4', name: 'France', image: require('../../assets/images/imageFrance.webp') },
    { id: '5', name: 'Chine', image: require('../../assets/images/imageChine.webp') },
    { id: '6', name: 'Egypte', image: require('../../assets/images/imageEgypte.webp') },
    { id: '7', name: 'Espagne', image: require('../../assets/images/imageEspagne.webp') },
    { id: '8', name: 'Grece', image: require('../../assets/images/imageGrece.webp') },
    { id: '9', name: 'Inde', image: require('../../assets/images/imageInde.webp') },
    { id: '10', name: 'Liban', image: require('../../assets/images/imageLiban.webp') },
    { id: '11', name: 'Thailande', image: require('../../assets/images/imageThailande.webp') },
    { id: '12', name: 'Tunisie', image: require('../../assets/images/imageTunisie.webp') },
];


export default function HomeScreen() {
    const router = useRouter();
    const { userToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [averageRatings, setAverageRatings] = useState<Record<number, number>>({});
    const [dishes, setDishes] = useState<any[]>([]);const [topDishes, setTopDishes] = useState<any[]>([]);
    const [loadingTop, setLoadingTop] = useState(true);

        const fetchDishes = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();


                params.append('page', '0');
                params.append('size', '6');

                const url = `http://localhost:8090/dishes/search?${params.toString()}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
                    }
                });

                if (!response.ok) throw new Error('Échec du chargement des recettes.');
                const data = await response.json();
                setDishes(data.content || []);
            } catch (error) {
                console.error('Erreur lors du filtrage :', error);
            } finally {
                setLoading(false);
            }
        };

    const renderCountry = ({ item }: { item: typeof COUNTRIES[0] }) => (
        <Pressable style={styles.countryContainer} onPress={() => router.push({ pathname: '/recipes', params: { country: item.name } })}>
            <Text style={styles.countryText}>{item.name}</Text>
            <Image source={item.image} style={styles.countryCircle} />
        </Pressable>
    );

    const fetchTopDishes = async () => {
        setLoadingTop(true);
        try {
            const url = `http://localhost:8090/ratings/top5`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
                }
            });

            if (!response.ok) throw new Error('Échec du chargement des ratings.');
            const data = await response.json();

            setTopDishes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erreur lors de la récupération :', error);
        } finally {
            setLoadingTop(false);
        }
    };

    const fetchAverageRating = async (dishId: number) => {
        try {
            const response = await fetch(`http://localhost:8090/ratings/dish/${dishId}/average`, {
                method: 'GET'
            });
            if (response.ok) {
                const avg = await response.json();
                setAverageRatings(prev => ({ ...prev, [dishId]: Number(avg) }));
            }
        } catch (err) {
            console.error("Erreur récup note moyenne:", err);
        }
    };

    useEffect(() => {
        fetchDishes();
        fetchTopDishes();
    }, []);

    useEffect(() => {
        if (topDishes.length > 0) {
            topDishes.forEach(item => {
                if (item.dish?.id) {
                    fetchAverageRating(item.dish.id);
                }
            });
        }
    }, [topDishes]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <ImageBackground
                source={require('../../assets/images/TasteOdysseyBanner.webp')}
                style={styles.banner}
            >
                <View style={styles.darkOverlay}>
                    <Text style={styles.title}>TasteOdyssey</Text>
                    <Text style={styles.subtitle}>RECETTE DU MONDE</Text>
                </View>
            </ImageBackground>

            <View style={styles.listContainer}>
                <FlatList
                    data={COUNTRIES}
                    renderItem={renderCountry}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                />
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Recettes populaires</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#C05A32" />
            ) : (
                <View>
                    <View style={styles.gridContainer}>
                        {dishes.map((item) => (
                            <View key={item.id.toString()} style={styles.dishCard}>
                                <View style={styles.imageWrapper}>
                                    {item.listImages?.[0] ? (
                                        <Image source={{ uri: item.listImages[0] }} style={styles.dishImageSimple} />
                                    ) : (
                                        <View style={styles.dishImagePlaceholder}>
                                            <FontAwesome5 name="utensils" size={32} color="#C05A32" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.dishCardContent}>
                                    <Text style={styles.dishName} numberOfLines={1}>{item.dishName}</Text>

                                    <View style={styles.badgeRow}>
                                        <Text style={styles.badge}>{item.dishType}</Text>
                                        <Text style={[styles.badge, styles.badgeEase]}>{item.ease}</Text>
                                        <Text style={styles.costText}>{item.cost} €</Text>
                                    </View>

                                    {item.countries && (
                                        <View style={styles.cardCountryContainer}>
                                            <Ionicons name="location-sharp" size={12} color="#666" />
                                            <Text style={styles.countryLabel}>{item.countries.name}</Text>
                                        </View>
                                    )}

                                    <Pressable style={styles.actionButton} onPress={() => router.push(`/${item.slug}` as any)}>
                                        <Text style={styles.actionButtonText}>Voir</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Les 5 recettes les mieux notées</Text>
            {loadingTop ? (
                <ActivityIndicator size="large" color="#C05A32" />
            ) : (
                <View>
                    <View style={styles.topGridContainer}>
                        {topDishes.map((item) => (
                            <View key={item.id.toString()} style={styles.topDishCard}>
                                <View style={styles.imageWrapper}>
                                    {item.dish?.imageUrl ? (
                                        <Image source={{ uri: item.dish.imageUrl }} style={styles.dishImageSimple} />
                                    ) : (
                                        <View style={styles.dishImagePlaceholder}>
                                            <FontAwesome5 name="utensils" size={32} color="#C05A32" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.dishCardContent}>
                                    <Text style={styles.dishName} numberOfLines={1}>{item.dish?.dishName}</Text>

                                    <View style={styles.badgeRow}>
                                        <Text style={[styles.badge, {marginBottom: 10}]}>Note: {averageRatings[item.dish?.id] !== undefined
                                            ? averageRatings[item.dish.id].toFixed(1)
                                            : "N/A"} ⭐</Text>
                                    </View>

                                    <Pressable
                                        style={styles.actionButton}
                                        onPress={() => router.push(`/${item.dish?.slug}` as any)}
                                    >
                                        <Text style={styles.actionButtonText}>Voir le plat</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                    <Pressable
                        style={styles.btnShowAll}
                        onPress={() => router.push('/recipes')}
                    >
                        <Text style={styles.btnShowAllText}>Voir toutes les recettes</Text>
                    </Pressable>
                </View>
            )}
            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    scrollContent: { paddingBottom: 40 },
    banner: { width: '100%', height: 250, justifyContent: 'center' },
    overlay: { alignItems: 'center' },
    title: { fontFamily: 'serif', fontSize: 40, fontWeight: '700', color: '#FFF' },
    subtitle: { fontSize: 16, color: '#FFF', letterSpacing: 2 },

    listContainer: { marginTop: 20 },
    listPadding: { paddingHorizontal: 16 },

    darkOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    countryContainer: {
        alignItems: 'center',
        marginRight: 20,
    },
    cardCountryContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, marginBottom: 8 },
    countryCircle: {
        width: 106,
        height: 106,
        borderRadius: 66,
        borderWidth: 2,
        borderColor: '#C05A32',
    },
    countryText: {
        marginTop: 8,
        marginBottom: 8,
        fontFamily: 'sans-serif',
        fontSize: 12,
        fontWeight: '600',
        color: '#2F2214',
        textTransform: 'uppercase',
    },
    countryLabel: { fontSize: 11, color: '#666', fontStyle: 'italic' },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: '#2F2214', marginTop: 45, marginLeft: 16, marginBottom: 30, fontFamily: 'serif', textAlign: 'center' },
    badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    badge: { fontSize: 10, fontWeight: '600', color: '#C05A32', backgroundColor: 'rgba(192, 90, 50, 0.08)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeEase: { color: '#7A9B6B', backgroundColor: 'rgba(122, 155, 107, 0.08)' },
    costText: { fontSize: 13, fontWeight: '700', color: '#2F2214', marginLeft: 'auto' },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 200,
        justifyContent: 'space-between'
    },
    dishCard: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 8,
        overflow: 'hidden',
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        maxWidth: Platform.OS === 'web' ? '31.3%' : '46%'
    },
    imageWrapper: {
        width: '100%',
        height: 240,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dishImageSimple: {
        width: 250,
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover'
    },
    dishName: { fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif', fontSize: 16, fontWeight: '700', color: '#2F2214', marginBottom: 4 },
    actionButton: {
        backgroundColor: '#C05A32',
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center'
    },
    dishImagePlaceholder: {
        width: 250,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dishCardContent: {
        padding: 12,
        flex: 1,
        justifyContent: 'flex-start'
    },
    actionButtonText: { color: '#FFF', fontSize: 11, fontWeight: '600' },btnShowAll: {
        backgroundColor: '#FAF6EE',
        borderWidth: 2,
        borderColor: '#C05A32',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20,
        ...Platform.select({
            web: { cursor: 'pointer' }
        })
    },
    btnShowAllText: {
        color: '#C05A32',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    topGridContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    topDishCard: {
        width: '18%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#2F2214',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#D1CCC0',
        marginVertical: 40,
        marginHorizontal: 40,
        marginBottom: 0,
    },
});