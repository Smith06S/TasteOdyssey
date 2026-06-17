# TasteOdyssey - Plateforme de partage de recettes du monde

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.1-blue.svg)](https://www.postgresql.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-black.svg)](https://expo.dev/)

## Table des matières

* [Présentation du projet](https://www.google.com/search?q=%23-pr%C3%A9sentation-du-projet)
* [Installation et initialisation locale](https://www.google.com/search?q=%23-installation-et-initialisation-locale)
* [Fonctionnalités clés](https://www.google.com/search?q=%23-fonctionnalit%C3%A9s-cl%C3%A9s)
* [Architecture du projet](https://www.google.com/search?q=%23-architecture-du-projet)

## Présentation du projet

**TasteOdyssey** est une application collaborative dédiée à la découverte et au partage de recettes culinaires internationales. Le projet propose une interface mobile moderne construite avec **React Native (Expo)** et une API robuste basée sur **Spring Boot**, offrant une expérience utilisateur fluide pour explorer, noter et commenter des plats venus du monde entier.

## Installation et initialisation locale

### 1. Backend (Spring Boot)

Assurez-vous d'avoir **Java 17+** et **Maven** installés sur votre machine.

#### Configuration de la base de données (PostgreSQL 18.1)

1. **Préparation du fichier de configuration :**
   Ouvrez le fichier `src/main/resources/application.yaml`. Modifiez les propriétés `username` et `password` pour qu'elles correspondent à vos identifiants PostgreSQL locaux (typiquement : utilisateur `postgres`, mot de passe `postgres`).
2. **Création de la base via IntelliJ :**
* Dans IntelliJ, allez dans la barre latérale droite et cliquez sur **Database**.
* Cliquez sur **+** -> **Data Source** -> **PostgreSQL**.
* Remplissez les champs avec :
* **Host :** `localhost`
* **User :** `postgres`
* **Password :** `postgres` (ou celui défini lors de l'installation).


* Cliquez sur **Apply** et **OK**.


3. **Initialisation du schéma :**
* Une fois connecté, faites un clic droit sur votre nouvelle connexion dans la fenêtre Database.
* Sélectionnez **"Open Console"**.
* Tapez la commande suivante et exécutez-la (Ctrl+Enter) :
```sql
CREATE DATABASE recipes;

```


* Assurez-vous que le schéma par défaut est bien sur `public`.
*  ouvrez une **nouvelle console** dans la base `recipes` nouvellement créée, copiez-collez le contenu du script `recipes.sql`,  et exécutez-le pour peupler les tables.


4. **Lancement du projet :**
* Dans le terminal IntelliJ (ou via le menu Maven à droite), exécutez les commandes suivantes pour compiler et lancer l'application :
```bash
# Nettoyage et compilation du projet
./mvnw clean install

# Lancement de l'application
./mvnw spring-boot:run

```

*Note : Veillez à ce qu'aucune autre application n'utilise déjà le port 5432 (PostgreSQL) ou le port de votre serveur Spring Boot (généralement 8080) avant de lancer le projet.*


### 2. Frontend (React Native/Expo)

Assurez-vous d'avoir **Node.js** installé.

```bash
cd ../world-recipe-front

# Installation des dépendances
npm install

# Lancement de l'application
npx expo start

```

#### Important : Lancement sur appareil mobile (via Wi-Fi)

Pour que votre application mobile puisse communiquer avec votre backend Spring Boot depuis un téléphone ou une tablette, vous devez remplacer `localhost` par votre **adresse IP locale** (celle attribuée par votre routeur Wi-Fi) dans tous vos fichiers de services/requêtes API.

1. **Trouver votre IP locale :**
* Sous Windows : ouvrez un terminal et tapez `ipconfig`. Cherchez "Adresse IPv4" (ex: `192.168.1.XX`).
* Sous macOS/Linux : tapez `ifconfig` ou `ip addr` dans le terminal.


2. **Mise à jour des requêtes :**
* Parcourez votre dossier `world-recipe-front/` et remplacez chaque occurrence de `http://localhost:8080` (ou le port utilisé) par `http://192.168.1.XX:8080`.
* **Note :** Il est fortement recommandé d'utiliser une variable d'environnement ou une constante centrale pour définir l'URL de base de l'API afin de ne pas avoir à modifier chaque fichier individuellement.


3. **Lancement :**
* Assurez-vous que votre ordinateur et votre téléphone sont sur le **même réseau Wi-Fi**.
* Exécutez `npx expo start`.
* Scannez le QR Code qui s'affiche dans votre terminal avec l'application **Expo Go** sur votre téléphone.


*Conseil : Si vous utilisez des outils comme Axios, vérifiez bien que le port (ex: 8080) est conservé intact lors de la modification de l'IP.*


## Fonctionnalités clés

* **Exploration Gastronomique :**
* Visualisation des recettes par pays (images haute qualité, détails par ingrédient).
* Moteur de recherche par type de régime (DietType) et niveau de difficulté.


* **Interaction Communautaire :**
* Système de notation et commentaires sur les recettes.
* Gestion des "Likes" pour sauvegarder ses plats favoris.


* **Gestion de Profil :**
* Authentification sécurisée par JWT (JSON Web Token).
* Gestion du profil utilisateur et historique des contributions.


* **Contribution :**
* Interface dédiée pour la création de nouvelles recettes (CRUD).



## Architecture du projet

Le projet suit une architecture multicouche pour séparer la logique métier de la présentation :

```text
TasteOdyssey/
├── taste-odyssey-api/          # Backend Java Spring Boot
│   ├── src/main/java/com/tasteOdyssey/world_recipe_api/
│   │   ├── controller/         # Endpoints REST
│   │   ├── service/            # Logique métier
│   │   ├── repository/         # Accès aux données (Spring Data JPA)
│   │   ├── entity/             # Modèles de données (Dish, User, Comment, etc.)
│   │   └── config/             # Sécurité (JWT, AuthFilter)
│   └── src/main/resources/     # Configuration (application.yaml)
└── world-recipe-front/         # Frontend React Native
    ├── app/                    # Navigation et routes (Tabs, Auth)
    ├── components/             # Composants UI (Navbar, Footer)
    ├── context/                # Gestion d'état (AuthContext)
    └── assets/                 # Images et ressources statiques

```


**Développé par l'équipe TasteOdyssey**

*Dernière mise à jour : Juin 2026*