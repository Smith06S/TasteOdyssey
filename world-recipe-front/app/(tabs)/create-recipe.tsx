import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert, FlatList, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Footer from "../../components/Footer";

interface CountrySuggestion {
    id: number;
    countryName: string;
}

interface IngredientSuggestion{
    id: number;
    ingredientName: string;
}

interface ToolSuggestion {
    id: number;
    toolName: string;
}

interface IngredientLine {
    name: string;
    ingredientId: number | null;
    quantity: string;
    unit: string;
}

interface ToolLine {
    name: string;
    toolId: number | null;
}

export default function CreateRecipeScreen() {
    const router = useRouter();
    const { userToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const [dishName, setDishName] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [cost, setCost] = useState('');
    const [ease, setEase] = useState('FACILE');
    const [dishType, setDishType] = useState('PLAT');
    const [dietsType, setDietsType] = useState<string[]>(['AUCUN']);
    const [numberOfPerson, setNumberOfPerson] = useState('1');
    const [selectedCountry, setSelectedCountry] = useState<CountrySuggestion | null>(null);
    const [countryInput, setCountryInput] = useState('');
    const [countriesList, setCountriesList] = useState<CountrySuggestion[]>([]);
    const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
    const [ingredientsList, setIngredientsList] = useState<IngredientSuggestion[]>([]);
    const [toolsList, setToolsList] = useState<ToolSuggestion[]>([]);

    const [ingredients, setIngredients] = useState<IngredientLine[]>([
        { name: '', ingredientId: null, quantity: '', unit: '' }
    ]);
    const [tools, setTools] = useState<ToolLine[]>([{ name: '', toolId: null }]);
    const [recipeSteps, setRecipeSteps] = useState(['']);
    const [listImage, setListImage] = useState(['']);

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

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://localhost:8090/ingredients', {
                    headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
                });
                if (response.ok) {
                    const data = await response.json();
                    const list = Array.isArray(data) ? data : (data._embedded?.ingredientsList || []);
                    setIngredientsList(list);
                }
            } catch (err) {
                console.error("Erreur chargement ingrédients :", err);
            }
        };
        fetchIngredients();
    }, [userToken]);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('http://localhost:8090/tools', {
                    headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
                });
                if (response.ok) {
                    const data = await response.json();
                    const list = Array.isArray(data) ? data : (data._embedded?.toolsList || []);
                    setToolsList(list);
                }
            } catch (err) {
                console.error("Erreur chargement ingrédients :", err);
            }
        };
        fetchTools();
    }, [userToken]);

    const handleCreate = async () => {
        const payload = {
            dishName,
            cookingTime: parseInt(cookingTime) || 0,
            cost: parseInt(cost) || 0,
            ease: ease,
            dishType: dishType,
            dietsType: dietsType.filter(d => d !== 'AUCUN'),
            numberOfPerson: parseInt(numberOfPerson) || 1,
            country: selectedCountry ? selectedCountry.countryName : '',
            ingredients: ingredients
                .filter(i => i.ingredientId !== null)
                .map(i => ({
                    ingredientId: i.ingredientId,
                    quantity: parseFloat(i.quantity) || 0,
                    unit: i.unit
                })),
            tools: tools
                .filter(t => t.toolId !== null)
                .map(t => ({ toolId: t.toolId })),
            recipeSteps: recipeSteps.filter(s => s.trim() !== ''),
            listImage: listImage.filter(i => i.trim() !== '')
        };

        console.log("Payload envoyé au serveur :", JSON.stringify(payload, null, 2));

        try {
            setLoading(true);
            const res = await fetch('http://localhost:8090/dishes/dish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                Alert.alert("Succès", "Recette créée !");
                router.push('/recipes');
            } else {
                console.error("Erreur API :", res.status, data);
                Alert.alert("Erreur", `Le serveur a renvoyé : ${res.status}`);
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
            Alert.alert("Erreur", "Impossible de joindre le serveur. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = countriesList.filter(c =>
        (c.countryName || '').toLowerCase().includes(countryInput.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Créer une recette</Text>

                <TextInput style={styles.input} placeholder="Nom" value={dishName} onChangeText={setDishName} />
                <TextInput style={styles.input} placeholder="Temps (min)" keyboardType="numeric" value={cookingTime} onChangeText={setCookingTime} />
                <TextInput style={styles.input} placeholder="Coût (€)" keyboardType="numeric" value={cost} onChangeText={setCost} />
                <TextInput style={styles.input} placeholder="Nombre de personnes" keyboardType="numeric" value={numberOfPerson} onChangeText={setNumberOfPerson} />

                <Text style={styles.label}>Difficulté</Text>
                <View style={styles.optionsRow}>
                    {['FACILE', 'MOYEN', 'DIFFICILE'].map(e => (
                        <Pressable
                            key={e}
                            style={[styles.optionBadge, ease === e && styles.optionBadgeActive]}
                            onPress={() => setEase(e)}
                        >
                            <Text style={ease === e ? styles.optionBadgeTextActive : styles.optionBadgeText}>
                                {e}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Type de recette</Text>
                <View style={styles.optionsRow}>
                    {['ENTREE', 'PLAT', 'DESSERT', 'BOISSON'].map(d => (
                        <Pressable
                            key={d}
                            style={[styles.optionBadge, dishType === d && styles.optionBadgeActive]}
                            onPress={() => setDishType(d)}
                        >
                            <Text style={dishType === d ? styles.optionBadgeTextActive : styles.optionBadgeText}>
                                {d}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Régimes</Text>
                <View style={styles.optionsRow}>
                    {['AUCUN', 'VEGETARIEN', 'VEGAN', 'SANS_GLUTEN', 'HALAL', 'SANS_LACTOSE'].map(d => (
                        <Pressable key={d} style={[styles.optionBadge, dietsType.includes(d) && styles.optionBadgeActive]}
                                   onPress={() => setDietsType(prev => d === 'AUCUN' ? ['AUCUN'] : prev.includes(d) ? prev.filter(x => x !== d) : [...prev.filter(x => x !== 'AUCUN'), d])}>
                            <Text style={dietsType.includes(d) ? styles.optionBadgeTextActive : styles.optionBadgeText}>{d}</Text>
                        </Pressable>
                    ))}
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

                {ingredients.map((item, index) => (
                    <View key={index} style={[styles.row, { marginBottom: 10 }]}>
                        <View style={[styles.inputGroupAdvanced, { flex: 3 }]}>
                            <Text style={styles.filterLabel}>Ingrédient {index + 1}</Text>

                            {item.ingredientId ? (
                                <View style={styles.selectedCountryContainer}>
                                    <View style={styles.selectedCountryLeft}>
                                        <Text style={styles.selectedCountryText}>{item.name}</Text>
                                    </View>
                                    <Pressable onPress={() => {
                                        const n = [...ingredients];
                                        n[index] = { ...n[index], name: '', ingredientId: null };
                                        setIngredients(n);
                                    }}>
                                        <Ionicons name="close-circle" size={18} color="#BA3C2A" />
                                    </Pressable>
                                </View>
                            ) : (
                                <>
                                    <TextInput
                                        style={styles.advancedTextInput}
                                        value={item.name}
                                        onChangeText={(val) => {
                                            const n = [...ingredients];
                                            n[index] = { ...n[index], name: val };
                                            setIngredients(n);
                                        }}
                                        placeholder="Rechercher..."
                                        placeholderTextColor="#999"
                                    />
                                    {item.name.length > 0 && !item.ingredientId && (
                                        <View style={styles.suggestionsBox}>
                                            {ingredientsList
                                                .filter(i => i.ingredientName.toLowerCase().includes(item.name.toLowerCase()))
                                                .slice(0, 3)
                                                .map((s) => (
                                                    <Pressable
                                                        key={s.id}
                                                        style={styles.suggestionItem}
                                                        onPress={() => {
                                                            const n = [...ingredients];
                                                            n[index] = { ...n[index], name: s.ingredientName, ingredientId: s.id };
                                                            setIngredients(n);
                                                        }}
                                                    >
                                                        <Text style={styles.suggestionItemText}>{s.ingredientName}</Text>
                                                    </Pressable>
                                                ))}
                                        </View>
                                    )}
                                </>
                            )}
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.filterLabel}>Quantité</Text>
                            <TextInput
                                style={[styles.advancedTextInput]}
                                placeholder="0"
                                keyboardType="numeric"
                                value={item.quantity}
                                onChangeText={(v) => {
                                    const n = [...ingredients];
                                    n[index] = { ...n[index], quantity: v };
                                    setIngredients(n);
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.filterLabel}>Unité</Text>
                            <TextInput
                                style={[styles.advancedTextInput]}
                                placeholder="ml, g"
                                value={item.unit}
                                onChangeText={(v) => {
                                    const n = [...ingredients];
                                    n[index] = { ...n[index], unit: v };
                                    setIngredients(n);
                                }}
                            />
                        </View>
                    </View>
                ))}
                <Pressable
                    onPress={() => {
                        setIngredients([...ingredients, { name: '', ingredientId: null, quantity: '', unit: '' }]);
                    }}
                >
                    <Text style={styles.add}>+ Ingrédient</Text>
                </Pressable>

                {/* Ustensiles */}
                <Text style={styles.label}>Ustensiles</Text>
                {tools.map((t, index) => (
                    <View key={index} style={styles.inputGroupAdvanced}>
                        {t.toolId ? (
                            <View style={styles.selectedCountryContainer}>
                                <View style={styles.selectedCountryLeft}>
                                    <MaterialCommunityIcons name="tools" size={13} color="#2F2214" />
                                    <Text style={styles.selectedCountryText}>{t.name}</Text>
                                </View>
                                <Pressable onPress={() => {
                                    const n = [...tools];
                                    n[index] = { ...n[index], name: '', toolId: null };
                                    setTools(n);
                                }}>
                                    <Ionicons name="close-circle" size={18} color="#BA3C2A" />
                                </Pressable>
                            </View>
                        ) : (
                            <>
                                <TextInput
                                    style={styles.advancedTextInput}
                                    placeholder="Choisir un ustensile..."
                                    placeholderTextColor="#999"
                                    value={t.name}
                                    onChangeText={(val) => {
                                        const n = [...tools];
                                        n[index] = { ...n[index], name: val };
                                        setTools(n);
                                    }}
                                />
                                {t.name.length > 0 && !t.toolId && (
                                    <View style={styles.suggestionsBox}>
                                        {toolsList
                                            .filter(item => item.toolName.toLowerCase().includes(t.name.toLowerCase()))
                                            .slice(0, 3)
                                            .map((item) => (
                                                <Pressable
                                                    key={item.id}
                                                    style={styles.suggestionItem}
                                                    onPress={() => {
                                                        const n = [...tools];
                                                        n[index] = { name: item.toolName, toolId: item.id };
                                                        setTools(n);
                                                    }}
                                                >
                                                    <Text style={styles.suggestionItemText}>{item.toolName}</Text>
                                                </Pressable>
                                            ))}
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                ))}

                <Pressable onPress={() => setTools([...tools, { name: '', toolId: null }])}>
                    <Text style={styles.add}>+ Ustensile</Text>
                </Pressable>

                <Text style={styles.label}>Étapes</Text>
                {recipeSteps.map((s, idx) => <TextInput key={idx} style={styles.advancedTextInput} placeholder={`Étape ${idx+1}`} onChangeText={(v) => { const n = [...recipeSteps]; n[idx] = v; setRecipeSteps(n); }} />)}
                <Pressable onPress={() => setRecipeSteps([...recipeSteps, ''])}><Text style={styles.add}>+ Étape</Text></Pressable>

                <Text style={styles.label}>Images (URLs)</Text>
                {listImage.map((i, idx) => <TextInput key={idx} style={styles.advancedTextInput} placeholder="http://..." onChangeText={(v) => { const n = [...listImage]; n[idx] = v; setListImage(n); }} />)}
                <Pressable onPress={() => setListImage([...listImage, ''])}><Text style={styles.add}>+ Image</Text></Pressable>

                <Pressable style={styles.btn} onPress={handleCreate} disabled={loading}>
                    <Text style={styles.btnText}>VALIDER LA RECETTE</Text>
                </Pressable>

                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF6EE' },
    scroll: { padding: 20 },
    title: { fontSize: 24, fontWeight: '700', color: '#2F2214', marginBottom: 20 },
    input: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', height: 44, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#FFFFFF', marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#C05A32', marginBottom: 8, marginTop: 10, textTransform: 'uppercase' },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
        marginBottom: 10
    },    add: { color: '#C05A32', fontWeight: '600', marginBottom: 20 },
    btn: { backgroundColor: '#C05A32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    optionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', backgroundColor: '#FFFFFF' },
    optionBadgeActive: { backgroundColor: '#C05A32', borderColor: '#C05A32' },
    optionBadgeText: { fontSize: 11, color: '#2F2214' },
    optionBadgeTextActive: { fontSize: 11, color: '#FFFFFF' },
    suggestionItem: { padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#EEE' },
    selectedCountryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(122, 155, 107, 0.15)',
        borderWidth: 1,
        borderColor: '#7A9B6B',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 16
    },
    selectedCountryLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    selectedCountryText: { fontSize: 14, color: '#2F2214', fontWeight: '600' },
    inputGroupAdvanced: { marginTop: 0, flex: 2, color: '#2F2214'},
    suggestionsBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(47, 34, 20, 0.15)', borderRadius: 8, marginTop: 4, overflow: 'hidden' },
    filterLabel: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 11, fontWeight: '700', color: '#2F2214', textTransform: 'uppercase', marginBottom: 6, marginTop: 10, letterSpacing: 0.5 },
    advancedTextInput: {
        height: 44,
        borderWidth: 1,
        borderColor: 'rgba(47, 34, 20, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 13
    },
    suggestionItemText: { fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif', fontSize: 13, color: '#2F2214' },
});