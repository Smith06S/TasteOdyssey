import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Footer from "../../components/Footer";

interface DishSummary {
    id: number;
    dishName: string;
    listImages: string[];
    cost: number;
    ease: 'FACILE' | 'MOYEN' | 'DIFFICILE';
    diets: string[];
    dishType: 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';
    slug: string;
    countries: { id: number; name: string } | null;
}

interface CountrySuggestion {
    id: number;
    countryName: string;
}

export default function RecipesScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { userToken } = useAuth();

    const [dishes, setDishes] = useState<DishSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchName, setSearchName] = useState('');
    const [timeInput, setTimeInput] = useState('');
    const [costInput, setCostInput] = useState('');
    const [selectedEase, setSelectedEase] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');

    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

    const [countryInput, setCountryInput] = useState('');
    const [countriesList, setCountriesList] = useState<CountrySuggestion[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<CountrySuggestion | null>(null);
    const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);

    const [ingredientInput, setIngredientInput] = useState('');
    const [toolInput, setToolInput] = useState('');

    const [showFilters, setShowFilters] = useState<boolean>(false);

    useEffect(() => {
        if (params.country && countriesList.length > 0) {
            const targetName = (params.country as string).toLowerCase();
            const foundCountry = countriesList.find(
                c => c.countryName.toLowerCase() === targetName
            );

            if (foundCountry) {
                setSelectedCountry(foundCountry);
            }
        }
    }, [params.country, countriesList]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:8090/countries', {
                    headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
                });
                if (response.ok) {
                    const data = await response.json();
                    const list = Array.isArray(data) ? data : (data._embedded?.countryList || []);
                    setCountriesList(list);
                }
            } catch (err) {
                console.error("Erreur chargement pays :", err);
            }
        };
        fetchCountries();
    }, [userToken]);

    const fetchDishes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchName.trim()) params.append('name', searchName);

            const parsedTime = parseInt(timeInput, 10);
            const parsedCost = parseInt(costInput, 10);

            if (!isNaN(parsedTime) && parsedTime > 0) {
                params.append('maxTime', parsedTime.toString());
            }
            if (!isNaN(parsedCost) && parsedCost > 0) {
                params.append('maxCost', parsedCost.toString());
            }

            if (selectedEase) params.append('ease', selectedEase);
            if (selectedType) params.append('type', selectedType);

            if (selectedDiets.length > 0) {
                selectedDiets.forEach(diet => {
                    params.append('diets', diet);
                });
            }

            if (selectedCountry) {
                params.append('countryId', selectedCountry.id.toString());
            }
            if (ingredientInput.trim()) params.append('ingredientName', ingredientInput);
            if (toolInput.trim()) params.append('toolName', toolInput);

            params.append('page', '0');
            params.append('size', '12');

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

    useEffect(() => {
        fetchDishes();
    }, [selectedEase, selectedType, selectedDiets, selectedCountry, timeInput, costInput]);

    const toggleDiet = (diet: string) => {
        if (diet === 'AUCUN') {
            setSelectedDiets([]);
        } else {
            if (selectedDiets.includes(diet)) {
                setSelectedDiets(selectedDiets.filter(d => d !== diet));
            } else {
                setSelectedDiets([...selectedDiets, diet]);
            }
        }
    };

    const incrementTime = () => {
        const current = parseInt(timeInput) || 0;
        setTimeInput((current + 5).toString());
    };

    const decrementTime = () => {
        const current = parseInt(timeInput) || 0;
        if (current <= 5) setTimeInput('');
        else setTimeInput((current - 5).toString());
    };

    const incrementCost = () => {
        const current = parseInt(costInput) || 0;
        setCostInput((current + 1).toString());
    };

    const decrementCost = () => {
        const current = parseInt(costInput) || 0;
        if (current <= 1) setCostInput('');
        else setCostInput((current - 1).toString());
    };

    const filteredCountries = countriesList.filter(c =>
        (c.countryName || '').toLowerCase().includes(countryInput.toLowerCase())
    );

    const renderDishCard = ({ item }: { item: DishSummary }) => {
        const mainImage = item.listImages && item.listImages.length > 0 ? item.listImages[0] : null;
        return (
            <View style={styles.dishCard}>
                <View style={styles.imageWrapper}>
                    {mainImage ? (
                        <Image source={{ uri: mainImage }} style={styles.dishImageSimple} />
                    ) : (
                        <View style={styles.dishImagePlaceholder}>
                            <FontAwesome5 name="utensils" size={32} color="#C05A32" />
                        </View>
                    )}
                </View>

                <View style={styles.dishCardContent}>
                    <View>
                        <Text style={styles.dishName} numberOfLines={1}>{item.dishName}</Text>

                        <View style={styles.badgeRow}>
                            <Text style={styles.badge}>{item.dishType}</Text>
                            <Text style={[styles.badge, styles.badgeEase]}>{item.ease}</Text>
                            <Text style={styles.costText}>{item.cost} €</Text>
                        </View>

                        {item.countries && (
                            <View style={styles.countryContainer}>
                                <Ionicons name="location-sharp" size={13} color="#666" />
                                <Text style={styles.countryLabel}>{item.countries.name}</Text>
                            </View>
                        )}
                    </View>

                    <Pressable
                        style={styles.actionButton}
                        onPress={() => router.push(`/${item.slug}` as any)}
                    >
                        <Text style={styles.actionButtonText}>Voir la recette</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.searchHeader}>
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchBar}
                            value={searchName}
                            onChangeText={setSearchName}
                            placeholder="Rechercher une recette par son nom..."
                            placeholderTextColor="#888"
                            onSubmitEditing={fetchDishes}
                        />
                        <Pressable style={styles.btnSearch} onPress={fetchDishes}>
                            <Ionicons name="search" size={18} color="#FFFFFF" />
                        </Pressable>
                    </View>

                    {userToken && (
                        <Pressable
                            style={styles.btnCreate}
                            onPress={() => router.push('/create-recipe')}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.btnCreateText}>Créer une recette</Text>
                        </Pressable>
                    )}

                    <Pressable style={styles.btnToggleFilters} onPress={() => setShowFilters(!showFilters)}>
                        <Text style={styles.btnToggleFiltersText}>
                            {showFilters ? '▲ Masquer les filtres' : '▼ Filtres avancés'}
                        </Text>
                    </Pressable>
                </View>

                {/* Panneau de filtres avancés */}
                {showFilters && (
                    <View style={styles.filtersPanel}>
                        <View style={styles.filterRow}>
                            <View style={styles.numericFilterGroup}>
                                <Text style={styles.filterLabel}>Temps max (min)</Text>
                                <View style={styles.numericInputContainer}>
                                    <TextInput
                                        style={styles.numericInput}
                                        value={timeInput}
                                        onChangeText={setTimeInput}
                                        placeholder="0"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                    />
                                    <View style={styles.arrowContainer}>
                                        <Pressable style={styles.arrowButton} onPress={incrementTime}>
                                            <Text style={styles.arrowText}>▲</Text>
                                        </Pressable>
                                        <Pressable style={styles.arrowButton} onPress={decrementTime}>
                                            <Text style={styles.arrowText}>▼</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.numericFilterGroup}>
                                <Text style={styles.filterLabel}>Coût max (€)</Text>
                                <View style={styles.numericInputContainer}>
                                    <TextInput
                                        style={styles.numericInput}
                                        value={costInput}
                                        onChangeText={setCostInput}
                                        placeholder="0"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                    />
                                    <View style={styles.arrowContainer}>
                                        <Pressable style={styles.arrowButton} onPress={incrementCost}>
                                            <Text style={styles.arrowText}>▲</Text>
                                        </Pressable>
                                        <Pressable style={styles.arrowButton} onPress={decrementCost}>
                                            <Text style={styles.arrowText}>▼</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.filterLabel}>Difficulté</Text>
                        <View style={styles.optionsRow}>
                            {['', 'FACILE', 'MOYEN', 'DIFFICILE'].map((level) => (
                                <Pressable
                                    key={level}
                                    style={[styles.optionBadge, selectedEase === level && styles.optionBadgeActive]}
                                    onPress={() => setSelectedEase(level)}
                                >
                                    <Text style={[styles.optionBadgeText, selectedEase === level && styles.optionBadgeTextActive]}>
                                        {level === '' ? 'TOUTES' : level}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.filterLabel}>Type de plat</Text>
                        <View style={styles.optionsRow}>
                            {['', 'ENTREE', 'PLAT', 'DESSERT', 'BOISSON'].map((t) => (
                                <Pressable
                                    key={t}
                                    style={[styles.optionBadge, selectedType === t && styles.optionBadgeActive]}
                                    onPress={() => setSelectedType(t)}
                                >
                                    <Text style={[styles.optionBadgeText, selectedType === t && styles.optionBadgeTextActive]}>
                                        {t === '' ? 'TOUS' : t}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.filterLabel}>Régime spécifique</Text>
                        <View style={styles.optionsRow}>
                            <Pressable
                                style={[styles.optionBadge, selectedDiets.length === 0 && styles.optionBadgeActive]}
                                onPress={() => toggleDiet('AUCUN')}
                            >
                                <Text style={[styles.optionBadgeText, selectedDiets.length === 0 && styles.optionBadgeTextActive]}>
                                    AUCUN
                                </Text>
                            </Pressable>

                            {['VEGETARIEN', 'VEGAN', 'SANS_GLUTEN', 'HALAL', 'SANS_LACTOSE'].map((diet) => {
                                const isActive = selectedDiets.includes(diet);
                                return (
                                    <Pressable
                                        key={diet}
                                        style={[styles.optionBadge, isActive && styles.optionBadgeActive]}
                                        onPress={() => toggleDiet(diet)}
                                    >
                                        <Text style={[styles.optionBadgeText, isActive && styles.optionBadgeTextActive]}>
                                            {diet}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.inputGroupAdvanced}>
                            <Text style={styles.filterLabel}>Pays d'origine</Text>
                            {selectedCountry ? (
                                <View style={styles.selectedCountryContainer}>
                                    <View style={styles.selectedCountryLeft}>
                                        <Ionicons name="location-sharp" size={16} color="#7A9B6B" />
                                        <Text style={styles.selectedCountryText}>{selectedCountry.countryName}</Text>
                                    </View>
                                    <Pressable onPress={() => setSelectedCountry(null)}>
                                        <Ionicons name="close-circle" size={18} color="#BA3C2A" />
                                    </Pressable>
                                </View>
                            ) : (
                                <>
                                    <TextInput
                                        style={styles.advancedTextInput}
                                        value={countryInput}
                                        onChangeText={(val) => {
                                            setCountryInput(val);
                                            setShowCountrySuggestions(val.length > 0);
                                        }}
                                        placeholder="Choisir un pays existant..."
                                        placeholderTextColor="#999"
                                    />
                                    {showCountrySuggestions && countryInput.length > 0 && (
                                        <View style={styles.suggestionsBox}>
                                            {filteredCountries.slice(0, 3).map((c) => (
                                                <Pressable
                                                    key={c.id}
                                                    style={styles.suggestionItem}
                                                    onPress={() => {
                                                        setSelectedCountry(c);
                                                        setCountryInput('');
                                                        setShowCountrySuggestions(false);
                                                    }}
                                                >
                                                    <Text style={styles.suggestionItemText}>{c.countryName}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    )}
                                </>
                            )}
                        </View>

                        <Pressable style={styles.btnReset} onPress={() => {
                            setTimeInput(''); setCostInput(''); setSelectedEase(''); setSelectedType(''); setSelectedDiets([]);
                            setCountryInput(''); setSelectedCountry(null); setIngredientInput(''); setToolInput(''); setSearchName('');
                        }}>
                            <Text style={styles.btnResetText}>Réinitialiser tous les filtres</Text>
                        </Pressable>
                    </View>
                )}

                {/* Grille principale de résultats */}
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#C05A32" />
                    </View>
                ) : (
                    <FlatList
                        data={dishes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderDishCard}
                        numColumns={Platform.OS === 'web' ? 3 : 2}
                        key={Platform.OS === 'web' ? 'web-3-columns' : 'mobile-2-columns'}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Aucune recette ne correspond à vos critères de recherche.</Text>
                        }
                    />
                )}
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: 'rgba(47, 34, 20, 0.08)' },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    searchBar: { flex: 1, height: 44, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FAF6EE', fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif' },
    btnSearch: { backgroundColor: '#C05A32', height: 44, width: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    btnToggleFilters: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
    btnToggleFiltersText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', color: '#C05A32', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    filtersPanel: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(47, 34, 20, 0.08)', zIndex: 10 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, gap: 16 },
    numericFilterGroup: { flex: 1 },
    filterLabel: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 11, fontWeight: '700', color: '#2F2214', textTransform: 'uppercase', marginBottom: 6, marginTop: 10, letterSpacing: 0.5 },
    numericInputContainer: { flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, backgroundColor: '#FAF6EE', overflow: 'hidden', height: 40 },
    numericInput: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#2F2214' },
    arrowContainer: { width: 32, borderLeftWidth: 1, borderLeftColor: 'rgba(47, 34, 20, 0.15)' },
    arrowButton: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    arrowText: { fontSize: 9, color: '#2F2214' },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    optionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', backgroundColor: '#FFFFFF' },
    optionBadgeActive: { backgroundColor: '#C05A32', borderColor: '#C05A32' },
    optionBadgeText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 11, fontWeight: '600', color: '#2F2214' },
    optionBadgeTextActive: { color: '#FFFFFF' },
    inputGroupAdvanced: { marginTop: 6 },
    advancedTextInput: { height: 38, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FAF6EE', fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 13 },
    selectedCountryContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(122, 155, 107, 0.15)', borderWidth: 1, borderColor: '#7A9B6B', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
    selectedCountryLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    selectedCountryText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 14, color: '#2F2214', fontWeight: '600' },
    suggestionsBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, marginTop: 4, overflow: 'hidden' },
    suggestionItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(47, 34, 20, 0.05)' },
    suggestionItemText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 13, color: '#2F2214' },
    btnReset: { marginTop: 16, paddingVertical: 8, alignItems: 'center' },
    btnResetText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', color: '#BA3C2A', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },

    listContainer: {
        padding: 16,
        maxWidth: Platform.OS === 'web' ? 1200 : '100%',
        width: '100%',
        alignSelf: 'center'
    },
    dishCard: {
        flex: 1,
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
    dishName: { fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif', fontSize: 16, fontWeight: '700', color: '#2F2214', marginBottom: 4 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    badge: { fontSize: 10, fontWeight: '600', color: '#C05A32', backgroundColor: 'rgba(192, 90, 50, 0.08)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeEase: { color: '#7A9B6B', backgroundColor: 'rgba(122, 155, 107, 0.08)' },
    costText: { fontSize: 13, fontWeight: '700', color: '#2F2214', marginLeft: 'auto' },
    countryContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
    countryLabel: { fontSize: 11, color: '#666', fontStyle: 'italic' },

    actionButton: {
        backgroundColor: '#C05A32',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        width: '100%',
        ...Platform.select({
            web: { cursor: 'pointer' }
        })
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 0.3
    },
    emptyText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', textAlign: 'center', color: '#888', marginTop: 40, paddingHorizontal: 20 },
    btnCreate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7A9B6B',
        marginHorizontal: 16,
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
        ...Platform.select({
            web: { cursor: 'pointer' }
        })
    },
    btnCreateText: {
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: 13
    },
});