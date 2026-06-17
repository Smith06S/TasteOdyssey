import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    ScrollView,
    Platform,
    FlatList,
    Dimensions,
    Pressable,
    TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useLocalSearchParams, Stack, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from "../../components/Footer";

interface IngredientResponse {
    id: number;
    name: string;
    quantity: number;
    unit: string | null;
}

interface ToolResponse {
    id: number;
    name: string;
}

interface CountryResponse {
    id: number;
    name: string;
}

interface CommentResponse {
    id: number;
    username: string;
    content: string;
    createdAt: string;
}

interface CompleteDish {
    id: number;
    dishName: string;
    listImages: string[];
    cost: number;
    ease: 'FACILE' | 'MOYEN' | 'DIFFICILE';
    diets: string[];
    dishType: 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';
    slug: string;
    numberOfPerson: number;
    ingredients: IngredientResponse[];
    tools: ToolResponse[];
    countries: CountryResponse | null;
    recipeSteps: string[];
    creatorId: number;
    creatorUsername: string;
}

export default function DishDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string; }>();
    const { userToken} = useAuth();

    const [dish, setDish] = useState<CompleteDish | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [userRating, setUserRating] = useState<number>(0);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [commentText, setCommentText] = useState<string>('');
    const [submittingComment, setSubmittingComment] = useState<boolean>(false);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
    const flatListRef = useRef<FlatList>(null);

    const [isOwner, setIsOwner] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchDishDetail = async () => {
                if (!slug) return;
                setLoading(true);
                setError(null);
                try {
                    const url = `http://localhost:8090/dishes/slug/${slug}`;
                    const dishRes = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {})
                        }
                    });

                    if (!dishRes.ok) {
                        console.log("Le serveur a répondu avec une erreur :", dishRes.status);

                        setError("Erreur serveur : " + dishRes.status);

                        setLoading(false);

                        return;
                    }
                    const dishData = await dishRes.json();
                    setDish(dishData);

                    // Vérification du propriétaire
                    if (userToken) {
                        const userRes = await fetch('http://localhost:8090/users/me', {
                            headers: { 'Authorization': `Bearer ${userToken}` }
                        });
                        if (userRes.ok) {
                            const userData = await userRes.json();
                            const isCreator = dishData.creator?.id === userData.id;
                            const isAdmin = userData.role === 'Admin';
                            setIsOwner(isCreator || isAdmin);
                        }
                    }

                    if (dishData.id) {
                        await fetchFavoriteStatus(dishData.id);
                        await fetchAverageRating(dishData.id);
                        await fetchUserRatingStatus(dishData.id);
                        await fetchComments(dishData.id);
                    }
                } catch (err: any) {
                    setError(err.message || "Une erreur est survenue");
                } finally {
                    setLoading(false);
                }
            };

            fetchDishDetail();
        }, [slug, userToken])
    );

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setContainerWidth(window.width);
        });
        return () => subscription.remove();
    }, []);

    const fetchFavoriteStatus = async (dishId: number) => {
        if (!userToken) return;
        try {
            const response = await fetch(`http://localhost:8090/like-dishes/my-favorites`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (response.ok) {
                const favorites = await response.json();
                if (Array.isArray(favorites)) {
                    const found = favorites.some((fav: any) => {
                        const actualFav = fav.content || fav;
                        return actualFav.dish && actualFav.dish.id === dishId;
                    });
                    setIsFavorite(found);
                }
            }
        } catch (err) {
            console.error("Erreur statut favoris backend:", err);
        }
    };

    const fetchAverageRating = async (dishId: number) => {
        try {
            const response = await fetch(`http://localhost:8090/ratings/dish/${dishId}/average`, {
                method: 'GET'
            });
            if (response.ok) {
                const avg = await response.json();
                setAverageRating(Number(avg) || 0);
            }
        } catch (err) {
            console.error("Erreur récup note moyenne:", err);
        }
    };

    const fetchUserRatingStatus = async (dishId: number) => {
        if (!userToken) return;
        try {
            const response = await fetch(`http://localhost:8090/ratings/dish/${dishId}/user-rating`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (response.ok) {
                const starsCount = await response.json();
                setUserRating(Number(starsCount) || 0);
            }
        } catch (err) {
            console.warn("Pas de note utilisateur trouvée au chargement");
        }
    };

    const fetchComments = async (dishId: number) => {
        try {
            const response = await fetch(`http://localhost:8090/comments/dish/${dishId}`, {
                method: 'GET'
            });
            if (response.ok) {
                const list = await response.json();
                if (Array.isArray(list)) {
                    const formatted: CommentResponse[] = list.map((item: any) => {
                        const c = item.content || item;
                        return {
                            id: c.id,
                            username: c.user?.username || "Anonyme",
                            content: c.message || "",
                            createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : "Récemment"
                        };
                    });
                    setComments(formatted);
                }
            }
        } catch (err) {
            console.error("Erreur récup commentaires backend:", err);
        }
    };

    const toggleFavorite = async () => {
        if (!dish || !userToken) return;
        try {
            const response = await fetch(`http://localhost:8090/like-dishes/toggle/${dish.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });
            if (response.ok) {
                setIsFavorite(!isFavorite);
            }
        } catch (err) {
            console.error("Erreur mutation favoris backend:", err);
        }
    };

    const handleSelectRating = async (ratingValue: number) => {
        if (!dish || !userToken) return;
        const previousRating = userRating;
        setUserRating(ratingValue); // Feedback immédiat
        try {
            const response = await fetch(`http://localhost:8090/ratings/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    stars: ratingValue,
                    dishId: dish.id
                })
            });
            if (!response.ok) {
                setUserRating(previousRating);
            } else {
                await fetchAverageRating(dish.id);
            }
        } catch (err) {
            setUserRating(previousRating);
            console.error("Erreur envoi de la note:", err);
        }
    };

    const submitComment = async () => {
        if (!dish || !userToken || !commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const response = await fetch(`http://localhost:8090/comments/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    message: commentText,
                    dishId: dish.id
                })
            });

            if (response.ok) {
                setCommentText('');
                await fetchComments(dish.id);
            }
        } catch (err) {
            console.error("Erreur envoi commentaire backend:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const pageMaxWidth = 900;
    const currentViewWidth = Platform.OS === 'web' ? Math.min(containerWidth - 40, pageMaxWidth) : containerWidth;

    const scrollToImage = (index: number) => {
        if (!dish || !flatListRef.current) return;
        let targetIndex = index;
        if (index < 0) targetIndex = dish.listImages.length - 1;
        if (index >= dish.listImages.length) targetIndex = 0;

        setActiveImageIndex(targetIndex);
        flatListRef.current.scrollToOffset({
            offset: targetIndex * currentViewWidth,
            animated: true
        });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#C05A32" />
            </View>
        );
    }

    if (error || !dish) {
        return (
            <View style={styles.centerContainer}>
                <Text style={{
                    fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
                    fontSize: 20,
                    fontWeight: '800',
                    color: '#C05A32',
                    letterSpacing: 2,
                    marginBottom: 20
                }}>
                    PAGE INTROUVABLE
                </Text>

                <Text style={{
                    fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
                    fontSize: 64,
                    fontWeight: '700',
                    color: '#2F2214',
                    marginBottom: 10
                }}>
                    404
                </Text>

                <Text style={{
                    fontSize: 16,
                    color: '#4A3B32',
                    marginBottom: 30,
                    textAlign: 'center',
                    paddingHorizontal: 40
                }}>
                    {error || "La recette que vous cherchez n'est plus dans nos fourneaux."}
                </Text>

                <Pressable
                    style={styles.actionButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.actionButtonText}>Retourner à l'accueil</Text>
                </Pressable>
            </View>
        );
    }

    const hasImages = dish.listImages && dish.listImages.length > 0;

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen options={{ title: dish.dishName, headerTintColor: '#C05A32' }} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.mainWrapper, { width: currentViewWidth }]}>

                    <View style={[styles.carouselContainer, { width: currentViewWidth }]}>
                        {hasImages ? (
                            <>
                                <FlatList
                                    ref={flatListRef}
                                    data={dish.listImages}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    getItemLayout={(_, index) => ({
                                        length: currentViewWidth,
                                        offset: currentViewWidth * index,
                                        index,
                                    })}
                                    onScroll={(e) => {
                                        if (Platform.OS !== 'web') {
                                            const offset = e.nativeEvent.contentOffset.x;
                                            const index = Math.round(offset / currentViewWidth);
                                            setActiveImageIndex(index);
                                        }
                                    }}
                                    scrollEventThrottle={16}
                                    renderItem={({ item }) => (
                                        <View style={[styles.imageSlideWrapper, { width: currentViewWidth }]}>
                                            <Image source={{ uri: item }} style={styles.mainImage} />
                                        </View>
                                    )}
                                />

                                {dish.listImages.length > 1 && (
                                    <>
                                        <Pressable style={[styles.arrowNav, styles.arrowLeft]} onPress={() => scrollToImage(activeImageIndex - 1)}>
                                            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
                                        </Pressable>
                                        <Pressable style={[styles.arrowNav, styles.arrowRight]} onPress={() => scrollToImage(activeImageIndex + 1)}>
                                            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                                        </Pressable>
                                    </>
                                )}

                                {dish.listImages.length > 1 && (
                                    <View style={styles.paginationDots}>
                                        {dish.listImages.map((_, index) => (
                                            <Pressable
                                                key={index}
                                                onPress={() => scrollToImage(index)}
                                                style={[
                                                    styles.dot,
                                                    activeImageIndex === index ? styles.activeDot : styles.inactiveDot
                                                ]}
                                            />
                                        ))}
                                    </View>
                                )}
                            </>
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <FontAwesome5 name="utensils" size={48} color="#C05A32" />
                            </View>
                        )}
                    </View>

                    <View style={styles.contentContainer}>

                        <View style={styles.actionHeaderRow}>
                            <Pressable
                                style={[styles.actionHeaderButton, isFavorite && styles.actionButtonActive]}
                                onPress={toggleFavorite}
                            >
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={16}
                                    color={isFavorite ? "#BA3C2A" : "#C05A32"}
                                />
                                <Text style={[styles.actionHeaderButtonText, isFavorite && styles.actionButtonActiveText]}>
                                    {isFavorite ? "Favori" : "Ajouter aux favoris"}
                                </Text>
                            </Pressable>

                            {isOwner && (
                                <Pressable
                                    style={styles.actionHeaderButton}
                                    onPress={() => router.push(`/update-recipe?id=${dish.id}` as any)}
                                >
                                    <Ionicons name="pencil-outline" size={16} color="#C05A32" />
                                    <Text style={styles.actionHeaderButtonText}>Modifier</Text>
                                </Pressable>
                            )}
                        </View>

                        <Text style={styles.dishName}>{dish.dishName}</Text>

                        <View style={styles.metaMetricsGrid}>
                            <View style={styles.metricCard}>
                                <Ionicons name="time-outline" size={20} color="#C05A32" />
                                <Text style={styles.metricLabel}>Temps</Text>
                                <Text style={styles.metricValue}>25 min</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Ionicons name="people-outline" size={20} color="#C05A32" />
                                <Text style={styles.metricLabel}>Portions</Text>
                                <Text style={styles.metricValue}>{dish.numberOfPerson || 4} pers.</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <MaterialCommunityIcons name="chef-hat" size={20} color="#C05A32" />
                                <Text style={styles.metricLabel}>Difficulté</Text>
                                <Text style={styles.metricValue}>{dish.ease}</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Ionicons name="star-outline" size={20} color="#C05A32" />
                                <Text style={styles.metricLabel}>Note Global</Text>
                                <Text style={styles.metricValue}>{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}/5</Text>
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            <Text style={styles.badge}>{dish.dishType}</Text>
                            <Text style={styles.costText}>{dish.cost} €</Text>
                        </View>

                        {dish.countries && (
                            <View style={styles.countryRow}>
                                <Ionicons name="location-sharp" size={14} color="#666" />
                                <Text style={styles.countryLabel}>Origine : {dish.countries.name}</Text>
                            </View>
                        )}

                        {dish.diets && dish.diets.length > 0 && (
                            <View style={styles.dietRow}>
                                {dish.diets.map((diet) => (
                                    <View key={diet} style={styles.dietBadge}>
                                        <Text style={styles.dietBadgeText}>{diet}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.separator} />

                        <View style={styles.recipeLayoutContainer}>

                            <View style={styles.ingredientsSectionBlock}>
                                <Text style={styles.sectionTitle}>Ingrédients</Text>
                                {dish.ingredients && dish.ingredients.length > 0 ? (
                                    <View style={styles.ingredientsListVertical}>
                                        {dish.ingredients.map((ing) => (
                                            <View key={ing.id} style={styles.ingredientLineCard}>
                                                <View style={styles.ingredientBullet} />
                                                <Text style={styles.ingredientLineText}>
                                                    <Text style={styles.ingredientLineWeight}>{ing.quantity} {ing.unit || ''}</Text> de {ing.name}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ) : null}

                                {dish.tools && dish.tools.length > 0 && (
                                    <View style={{ marginTop: 30 }}>
                                        <Text style={styles.sectionTitle}>Ustensiles</Text>
                                        <View style={styles.toolsRow}>
                                            {dish.tools.map((tool) => (
                                                <View key={tool.id} style={styles.toolBadge}>
                                                    <MaterialCommunityIcons name="tools" size={13} color="#2F2214" />
                                                    <Text style={styles.toolBadgeText}>{tool.name}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View style={styles.stepsSectionBlock}>
                                <Text style={styles.sectionTitle}>Étapes de préparation</Text>
                                {dish.recipeSteps && dish.recipeSteps.length > 0 ? (
                                    <View>
                                        {dish.recipeSteps.map((step, index) => (
                                            <View key={index} style={styles.stepContainer}>
                                                <View style={styles.stepNumberCircle}>
                                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                                </View>
                                                <Text style={styles.stepText}>{step}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ) : null}
                            </View>

                        </View>

                        <View style={styles.separator} />

                        <View style={styles.interactionSection}>
                            <Text style={styles.sectionTitle}>
                                {userRating > 0 ? `Votre note actuelle : ${userRating}/5` : "Notez cette recette"}
                            </Text>

                            <View style={styles.ratingStarsRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Pressable
                                        key={star}
                                        onPress={() => handleSelectRating(star)}
                                        style={styles.starPadding}
                                    >
                                        <Ionicons
                                            name={star <= userRating ? "star" : "star-outline"}
                                            size={32}
                                            color="#C05A32"
                                        />
                                    </Pressable>
                                ))}
                            </View>

                            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Commentaires</Text>

                            <View style={styles.commentInputBox}>
                                <TextInput
                                    style={styles.inputArea}
                                    multiline
                                    numberOfLines={3}
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    placeholder="Partagez votre expérience avec cette recette..."
                                    placeholderTextColor="#999"
                                />
                                <Pressable
                                    style={styles.publishButton}
                                    onPress={submitComment}
                                    disabled={submittingComment}
                                >
                                    {submittingComment ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.publishButtonText}>Publier</Text>
                                    )}
                                </Pressable>
                            </View>

                            <View style={styles.commentsListContainer}>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <View key={comment.id} style={styles.commentCard}>
                                            <View style={styles.commentUserRow}>
                                                <View style={styles.avatarPlaceholder}>
                                                    <Ionicons name="person" size={16} color="#666" />
                                                </View>
                                                <View>
                                                    <Text style={styles.commentUsername}>{comment.username}</Text>
                                                    <View style={styles.commentStarsRow}>
                                                        <Text style={styles.commentDate}>{comment.createdAt}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={styles.commentBody}>{comment.content}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noCommentsText}>Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</Text>
                                )}
                            </View>
                        </View>

                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF6EE' },
    scrollContainer: { paddingBottom: 40, width: '100%', alignItems: 'center' },
    mainWrapper: { backgroundColor: '#FAF6EE', alignSelf: 'center' },
    carouselContainer: {
        height: 400,
        position: 'relative',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        alignSelf: 'center',
        borderRadius: 12,
        marginTop: Platform.OS === 'web' ? 20 : 0,
        borderWidth: 1,
        borderColor: 'rgba(47, 34, 20, 0.06)'
    },
    imageSlideWrapper: { height: 400, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    mainImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    imagePlaceholder: { width: '100%', height: 400, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    arrowNav: { position: 'absolute', top: '50%', marginTop: -22, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(47, 34, 20, 0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 15 },
    arrowLeft: { left: 16 },
    arrowRight: { right: 16 },
    paginationDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, zIndex: 10 },
    dot: { height: 8, borderRadius: 4 },
    activeDot: { width: 18, backgroundColor: '#C05A32' },
    inactiveDot: { width: 8, backgroundColor: 'rgba(255, 255, 255, 0.6)' },
    contentContainer: { paddingVertical: 20, width: '100%', marginTop: 10 },
    actionHeaderRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    actionHeaderButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.12)' },
    actionButtonActive: { backgroundColor: 'rgba(47, 34, 20, 0.02)', borderColor: 'rgba(47, 34, 20, 0.15)' },
    actionHeaderButtonText: { fontSize: 13, fontWeight: '600', color: '#2F2214', fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif' },
    actionButtonActiveText: { color: '#2F2214' },
    dishName: { fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif', fontSize: 36, fontWeight: '700', color: '#2F2214', marginBottom: 16 },
    metaMetricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
    metricCard: { flex: 1, minWidth: 100, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.05)' },
    metricLabel: { fontSize: 11, color: '#666', marginTop: 4, textTransform: 'uppercase', fontWeight: '500' },
    metricValue: { fontSize: 14, fontWeight: '700', color: '#2F2214', marginTop: 2 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    badge: { fontSize: 11, fontWeight: '600', color: '#C05A32', backgroundColor: 'rgba(192, 90, 50, 0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    costText: { fontSize: 22, fontWeight: '700', color: '#2F2214', marginLeft: 'auto' },
    countryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    countryLabel: { fontSize: 14, color: '#666', fontStyle: 'italic' },
    dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    dietBadge: { backgroundColor: 'rgba(122, 155, 107, 0.15)', borderWidth: 1, borderColor: '#7A9B6B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    dietBadgeText: { color: '#3B5232', fontSize: 11, fontWeight: '600' },
    separator: { height: 1, backgroundColor: 'rgba(47, 34, 20, 0.08)', marginVertical: 30 },
    recipeLayoutContainer: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', gap: 40, alignItems: 'flex-start' },
    ingredientsSectionBlock: { width: Platform.OS === 'web' ? '35%' : '100%', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.05)' },
    stepsSectionBlock: { flex: 1, width: '100%', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.05)' },
    sectionTitle: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 18, fontWeight: '700', color: '#2F2214', marginBottom: 20, letterSpacing: 0.3 },
    ingredientsListVertical: { flexDirection: 'column', gap: 14 },
    ingredientLineCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    ingredientBullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#C05A32' },
    ingredientLineText: { fontSize: 14, color: '#4A3B32', lineHeight: 20 },
    ingredientLineWeight: { fontWeight: '700', color: '#C05A32' },
    toolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    toolBadge: { backgroundColor: '#FAF6EE', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    toolBadgeText: { fontSize: 13, color: '#2F2214', fontWeight: '500' },
    stepContainer: { flexDirection: 'row', marginBottom: 20, gap: 16, alignItems: 'flex-start' },
    stepNumberCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#C05A32', justifyContent: 'center', alignItems: 'center' },
    stepNumberText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    stepText: { flex: 1, fontSize: 14, color: '#4A3B32', lineHeight: 24 },
    interactionSection: { width: '100%' },
    ratingStarsRow: { flexDirection: 'row', marginTop: 8 },
    starPadding: { padding: 4 },
    commentInputBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.1)', marginTop: 12, alignItems: 'flex-start' },
    inputArea: { width: '100%', minHeight: 80, fontSize: 14, color: '#2F2214', textAlignVertical: 'top', fontFamily: 'sans-serif', paddingBottom: 10 },
    publishButton: { backgroundColor: '#C05A32', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start', marginTop: 6 },
    publishButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    commentsListContainer: { marginTop: 24, gap: 16 },
    commentCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.05)' },
    commentUserRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FAF6EE', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.1)' },
    commentUsername: { fontSize: 14, fontWeight: '700', color: '#2F2214' },
    commentStarsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    commentDate: { fontSize: 11, color: '#999', marginLeft: 6 },
    commentBody: { fontSize: 14, color: '#4A3B32', lineHeight: 22 },
    noCommentsText: { fontSize: 14, color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
    errorText: { color: '#BA3C2A', fontWeight: '600', fontSize: 16 },actionButton: {
        backgroundColor: '#C05A32',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        minWidth: 150,
        ...Platform.select({
            web: { cursor: 'pointer' }
        })
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
});