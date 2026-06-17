import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <View style={styles.footer}>
            <View style={styles.footerContent}>
                <View style={styles.section}>
                    <Text style={styles.brandName}>TasteOdyssey</Text>
                    <Text style={styles.description}>
                        Découvrez les saveurs du monde à travers nos recettes authentiques.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Navigation</Text>
                    <Link href="/" asChild>
                        <Pressable><Text style={styles.link}>Accueil</Text></Pressable>
                    </Link>
                    <Link href="/recipes" asChild>
                        <Pressable><Text style={styles.link}>Toutes les recettes</Text></Pressable>
                    </Link>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Besoin d'aide ?</Text>
                    <Link href="/contact" asChild>
                        <Pressable style={styles.contactBtn}>
                            <Text style={styles.contactBtnText}>Nous contacter</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

            <View style={styles.bottomBar}>
                <Text style={styles.copyright}>© {currentYear} TasteOdyssey. Tous droits réservés.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#FAF6EE',
        paddingTop: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(47, 34, 20, 0.08)',
        marginTop: 70,
        marginBottom: 0,
        alignSelf: 'stretch',
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingBottom: 40,
        flexWrap: 'wrap',
        gap: 20,
        width: '100%',
    },
    section: {
        flex: 1,
        minWidth: 200,
        gap: 10,
    },
    brandName: {
        fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'serif',
        fontSize: 20,
        fontWeight: '700',
        color: '#2F2214',
    },
    description: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    sectionHeader: {
        fontFamily: Platform.OS === 'web' ? 'Montserrat' : 'sans-serif',
        fontSize: 14,
        fontWeight: '700',
        color: '#2F2214',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    link: {
        fontSize: 14,
        color: '#2F2214',
        paddingVertical: 4,
    },
    contactBtn: {
        backgroundColor: 'rgba(192, 90, 50, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    contactBtnText: {
        color: '#C05A32',
        fontWeight: '600',
        fontSize: 13,
    },
    bottomBar: {
        paddingVertical: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(47, 34, 20, 0.05)',
    },
    copyright: {
        fontSize: 12,
        color: '#888',
    },
});