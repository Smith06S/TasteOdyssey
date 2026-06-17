package com.tasteOdyssey.world_recipe_api.config;

import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import com.tasteOdyssey.world_recipe_api.entity.dish.LikeDish;
import com.tasteOdyssey.world_recipe_api.entity.user.AuthProvider;
import com.tasteOdyssey.world_recipe_api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Configuration pour l'initialisation de la base de données.
 * <p>
 * Cette classe est responsable de l'initialisation des données par défaut dans la base de données
 * au démarrage de l'application. Elle définit des beans CommandLineRunner qui s'exécutent
 * lors du lancement de l'application pour peupler les tables avec des données initiales.
 * </p>
 */
@Configuration
public class InitDB {

    /**
     * Initialise des utilisateurs par défaut dans la base de données si aucun n'existe déjà.
     * <p>
     * Ce bean crée quatre utilisateurs avec différents rôles (User, Admin, AuthService, Organizer)
     * et les enregistre dans la base de données uniquement si celle-ci est vide.
     * Les mots de passe sont encodés avant d'être stockés.
     * </p>
     *
     * @param userRepository  Le repository pour accéder aux données des utilisateurs
     * @param passwordEncoder L'encodeur utilisé pour sécuriser les mots de passe
     * @return Un CommandLineRunner qui initialise les utilisateurs
     */
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                DishRepository dishRepository,
                                ToolRepository toolRepository,
                                CountryRepository countryRepository,
                                IngredientRepository ingredientRepository,
                                CommentRepository commentRepository,
                                RatingRepository ratingRepository,
                                LikeDishRepository likeDishRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                List<com.tasteOdyssey.world_recipe_api.entity.user.User> users = List.of(
                        com.tasteOdyssey.world_recipe_api.entity.user.User.builder()
                                .username("ssmith")
                                .email("ssmith@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("ssmith")
                                .biography("Passionate home cook and food lover. Sharing my culinary adventures and recipes from around the world.")
                                .role(com.tasteOdyssey.world_recipe_api.entity.user.Role.User)
                                .build(),
                        com.tasteOdyssey.world_recipe_api.entity.user.User.builder()
                                .username("xelea")
                                .email("xelea@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("k"))
                                .slug("xelea")
                                .biography("Food enthusiast and recipe creator. Exploring global cuisines and sharing delicious recipes with")
                                .role(com.tasteOdyssey.world_recipe_api.entity.user.Role.User)
                                .build(),
                        com.tasteOdyssey.world_recipe_api.entity.user.User.builder()
                                .username("accoow")
                                .email("accoow@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("accoow")
                                .biography("Chef and food blogger. Sharing my culinary creations and recipes inspired by world flavors.")
                                .role(com.tasteOdyssey.world_recipe_api.entity.user.Role.Admin)
                                .build(),
                        com.tasteOdyssey.world_recipe_api.entity.user.User.builder()
                                .username("auth")
                                .email("auth@example.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("auth")
                                .biography("Authentication service account. Used for managing authentication and authorization in the application.")
                                .role(com.tasteOdyssey.world_recipe_api.entity.user.Role.AuthService)
                                .build()
                );
                userRepository.saveAll(users);

            }

            if (countryRepository.count() == 0) {
                List<com.tasteOdyssey.world_recipe_api.entity.country.Country> countries = List.of(

                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Albanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Allemagne").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Andorre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Autriche").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Belgique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Biélorussie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bosnie-Herzégovine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bulgarie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Chypre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Croatie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Danemark").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Espagne").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Estonie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Finlande").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("France").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Grèce").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Hongrie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Irlande").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Islande").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Italie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Lettonie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Liechtenstein").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Lituanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Luxembourg").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Macédoine du Nord").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Malte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Moldavie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Monaco").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Monténégro").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Norvège").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Pays-Bas").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Pologne").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Portugal").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Roumanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Royaume-Uni").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Russie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Saint-Marin").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Serbie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Slovaquie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Slovénie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Suède").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Suisse").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tchéquie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Ukraine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Vatican").build(),

                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Antigua-et-Barbuda").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Argentine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bahamas").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Barbade").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Belize").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bolivie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Brésil").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Canada").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Chili").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Colombie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Costa Rica").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Cuba").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Dominique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Équateur").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("États-Unis").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Grenade").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Guatemala").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Guyana").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Haïti").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Honduras").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Jamaïque").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Mexique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Nicaragua").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Panama").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Paraguay").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Pérou").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("République Dominicaine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Saint-Christophe-et-Niévès").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Sainte-Lucie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Saint-Vincent-et-les-Grenadines").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Salvador").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Suriname").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Trinité-et-Tobago").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Uruguay").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Venezuela").build(),

                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Afrique du Sud").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Algérie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Angola").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bénin").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Botswana").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Burkina Faso").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Burundi").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Cameroun").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Cap-Vert").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Comores").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Congo-Brazzaville").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Congo-Kinshasa (RDC)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Côte d'Ivoire").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Djibouti").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Égypte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Érythrée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Eswatini (Swaziland)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Éthiopie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Gabon").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Gambie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Ghana").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Guinée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Guinée-Bissau").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Guinée équatoriale").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Kenya").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Lesotho").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Liberia").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Libye").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Madagascar").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Malawi").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Mali").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Maroc").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Maurice").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Mauritanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Mozambique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Namibie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Niger").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Nigeria").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Ouganda").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("République centrafricaine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Rwanda").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Sao Tomé-et-Principe").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Sénégal").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Seychelles").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Sierra Leone").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Somalie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Soudan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Soudan du Sud").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tanzanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tchad").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Togo").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tunisie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Zambie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Zimbabwe").build(),

                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Afghanistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Arabie Saoudite").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Arménie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Azerbaïdjan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bahreïn").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bangladesh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Bhoutan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Brunei").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Cambodge").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Chine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Corée du Nord").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Corée du Sud").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Émirats Arabes Unis").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Géorgie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Inde").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Indonésie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Irak").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Iran").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Israël").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Japon").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Jordanie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Kazakhstan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Kirghizistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Koweït").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Laos").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Liban").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Malaisie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Maldives").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Birmanie (Myanmar)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Népal").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Oman").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Ouzbékistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Pakistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Palestine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Philippines").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Qatar").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Singapour").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Sri Lanka").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Syrie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tadjikistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Taïwan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Thaïlande").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Timor oriental").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Turquie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Turkménistan").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Viêt Nam").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Yémen").build(),

                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Australie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Fidji").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Kiribati").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Îles Marshall").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Micronésie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Nauru").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Nouvelle-Zélande").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Palaos").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Papouasie-Nouvelle-Guinée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Salomon").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Samoa").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tonga").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Tuvalu").build(),
                        com.tasteOdyssey.world_recipe_api.entity.country.Country.builder().countryName("Vanuatu").build()
                );

                countryRepository.saveAll(countries);
            }

            if (toolRepository.count() == 0) {
                List<com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool> tools = List.of(
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Cuillère en bois").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Spatule / Marise").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Fouet de cuisine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Louche").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Pince de cuisine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Écumoire").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Couteau de chef").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Couteau d'office").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Couteau à pain").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Éplucheur / Économe").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Planche à découper").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Rape à fromage / Zesteur").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Mandoline").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Poêle antiadhésive").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Casserole").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Marmite / Faitout").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Wok").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Plat à gratin / Plat allant au four").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Poêle en fonte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Cocotte en fonte").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Passoire").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Cul de poule / Saladier").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Verre doseur").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Balance de cuisine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Presse-ail").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Presse-agrume").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Ouvre-boîte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Pinceau de cuisine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Mortier et pilon").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Presse-purée").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Rouleau à pâtisserie").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Moule à gâteau").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Poche à douille").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Tamis").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Plaque de cuisson / Tapis en silicone").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Mixeur plongeant").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Blender").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Robot pâtissier / Batteur électrique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Grille-pain").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Balance électronique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Batteur électrique").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Four").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Plaque de cuisson (Induction/Gaz)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Micro-ondes").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool.builder().toolName("Friteuse").build()
                );

                toolRepository.saveAll(tools);
            }

            if (ingredientRepository.count() == 0) {
                List<com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient> ingredients = List.of(
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Oignon jaune").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Oignon rouge").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Ail").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Échalote").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Tomate").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Courgette").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Aubergine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Poivron rouge").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Poivron vert").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Carotte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Poireau").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pomme de terre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Navet").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Céleri-branche").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Épinard fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Laitue / Salade").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Chou blanc").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Chou-fleur").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Brocoli").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Haricot vert").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Petit pois").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Champignon de Paris").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Bambou (pousses)").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Blanc de poulet").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Cuisse de poulet").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Viande de Bœuf hachée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Steak de Bœuf").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Côte de Porc").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Lardon de porc").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Gigot d'Agneau").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Canard (magret)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Saucisse de Toulouse").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Chorizo").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pavé de Saumon").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Filet de Cabillaud").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Thon en boîte").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Crevette décortiquée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Gambas").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Moule fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Calamar / Poulpe").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Anchois").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Riz Blanc basmati").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Riz Rond à Sushi").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pâtes Spaghetti").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pâtes Penne").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Nouilles Udon / Ramen").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Semoule de Couscous").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Quinoa").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Lentilles vertes").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Lentilles corail").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pois chiches").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Haricots rouges").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sel").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Poivre noir").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Persil fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Basilic fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Coriandre fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Menthe fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Thym sésame").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Laurier (feuille)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Cumin en poudre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Paprika doux").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Curry en poudre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Gingembre fresh").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Piment en poudre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Cannelle en poudre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Noix de muscade").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Safran").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Beurre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Crème fraîche liquide").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Lait demi-écrémé").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Lait de coco").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Œuf").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Fromage Gruyère râpé").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Fromage Parmesan (Parmigiano)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Fromage Mozzarella").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Fromage de Chèvre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Fromage Comté AOP").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Feta").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Tofu ferme").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Huile d'olive").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Huile de tournesol").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Huile de sésame").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sauce Tomate cuisinée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Concentré de tomate").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sauce soja salée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sauce soja sucrée").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Vinaigre de vin blanc").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Vinaigre balsamique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Bouillon de Bœuf (cube)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Bouillon de Volaille (cube)").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Vin blanc de cuisine").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Vin rouge de cuisine").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Farine de blé T55").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sucre blanc en poudre").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Sucre roux / Cassonade").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Miel liquide").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Levure chimique").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Levure boulangère sèche").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Chocolat noir pâtissier").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Extrait de vanille liquide").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pain de campagne rassis").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Chapelure").build(),

                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Citron jaune").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Citron vert / Lime").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pomme").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Banane").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Orange").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Avocat").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Noix de cajou").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Amandes effilées").build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient.builder().ingredientName("Pignons de pin").build()
                );

                ingredientRepository.saveAll(ingredients);
            }

            if (dishRepository.count() == 0) {
                com.tasteOdyssey.world_recipe_api.entity.user.User creator = userRepository.findAll().stream()
                        .filter(u -> u.getRole() == com.tasteOdyssey.world_recipe_api.entity.user.Role.Admin)
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("No admin found for initialization"));

                com.tasteOdyssey.world_recipe_api.entity.country.Country france = countryRepository.findByCountryName("France")
                        .orElseThrow(() -> new RuntimeException("Country France not found"));

                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient oignon = ingredientRepository.findByIngredientName("Oignon jaune")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient beurre = ingredientRepository.findByIngredientName("Beurre")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient farine = ingredientRepository.findByIngredientName("Farine de blé T55")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient vinBlanc = ingredientRepository.findByIngredientName("Vin blanc de cuisine")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient bouillon = ingredientRepository.findByIngredientName("Bouillon de Bœuf (cube)")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient pain = ingredientRepository.findByIngredientName("Pain de campagne rassis")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient comte = ingredientRepository.findByIngredientName("Fromage Comté AOP")
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool couteau = toolRepository.findByToolName("Couteau de chef")
                        .orElseThrow(() -> new RuntimeException("Tool not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool marmite = toolRepository.findByToolName("Marmite / Faitout")
                        .orElseThrow(() -> new RuntimeException("Tool not found"));
                com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool four = toolRepository.findByToolName("Four")
                        .orElseThrow(() -> new RuntimeException("Tool not found"));

                com.tasteOdyssey.world_recipe_api.entity.dish.Dish soupeALOignon = com.tasteOdyssey.world_recipe_api.entity.dish.Dish.builder()
                        .dishName("Soupe à l'oignon gratinée")
                        .cookingTime(60)
                        .cost(6)
                        .ease(Ease.MOYEN)
                        .listImages(List.of(
                                "https://assets.afcdn.com/recipe/20181012/82641_w1024h576c1cx2136cy1424cxt0cyt0cxb4272cyb2848.jpg",
                                "https://brasseriemadeleine-orleans.fr/wp-content/uploads/2024/06/soupe-oignon-gratinee-delicieuse-et-reconfortante.webp"
                        ))
                        .dishType(DishType.PLAT)
                        .diets(List.of(DietType.VEGETARIEN))
                        .slug("soupe-a-l-oignon-gratinee")
                        .numberOfPerson(4)
                        .country(france)
                        .creator(creator)
                        .recipeSteps(List.of(
                                "Éplucher et émincer finement les oignons avec le couteau.",
                                "Dans une marmite, faire fondre le beurre et ajouter les oignons.",
                                "Laisser cuire à feu doux pendant 20 minutes en remuant jusqu'à ce qu'ils soient bien dorés et confits.",
                                "Saupoudrer de farine (singer) et remuer pendant 1 minute.",
                                "Déglacer avec le vin blanc puis ajouter 1,5 litre d'eau et le cube de bouillon de bœuf.",
                                "Laisser mijoter à couvert pendant 30 minutes.",
                                "Préchauffer le four en mode grill. Répartir la soupe dans des bols allant au four.",
                                "Déposer des tranches de pain de campagne sur le dessus et recouvrir généreusement de Comté râpé.",
                                "Passer au four sous le grill pendant 5 à 10 minutes jusqu'à ce que ce soit bien gratiné et doré."
                        ))
                        .dishIngredients(new java.util.ArrayList<>())
                        .dishTools(new java.util.ArrayList<>())
                        .build();

                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(oignon).quantity(java.math.BigDecimal.valueOf(1000)).unit("g").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(beurre).quantity(java.math.BigDecimal.valueOf(50)).unit("g").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(farine).quantity(java.math.BigDecimal.valueOf(20)).unit("g").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(vinBlanc).quantity(java.math.BigDecimal.valueOf(150)).unit("ml").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(bouillon).quantity(java.math.BigDecimal.valueOf(2)).unit("pièce").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(pain).quantity(java.math.BigDecimal.valueOf(4)).unit("tranche").build());
                soupeALOignon.getDishIngredients().add(com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient.builder().dish(soupeALOignon).ingredient(comte).quantity(java.math.BigDecimal.valueOf(150)).unit("g").build());

                soupeALOignon.getDishTools().add(com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool.builder().dish(soupeALOignon).tool(couteau).build());
                soupeALOignon.getDishTools().add(com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool.builder().dish(soupeALOignon).tool(marmite).build());
                soupeALOignon.getDishTools().add(com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool.builder().dish(soupeALOignon).tool(four).build());

                dishRepository.save(soupeALOignon);
            }

            if (commentRepository.count() == 0) {
                com.tasteOdyssey.world_recipe_api.entity.dish.Dish savedSoupe = dishRepository.findBySlug("soupe-a-l-oignon-gratinee")
                        .orElseThrow(() -> new RuntimeException("Saved dish not found for comments"));

                com.tasteOdyssey.world_recipe_api.entity.user.User ssmith = userRepository.findByUsername("ssmith")
                        .orElseThrow(() -> new RuntimeException("User ssmith not found"));
                com.tasteOdyssey.world_recipe_api.entity.user.User xelea = userRepository.findByUsername("xelea")
                        .orElseThrow(() -> new RuntimeException("User xelea not found"));

                List<com.tasteOdyssey.world_recipe_api.entity.comment.Comment> comments = List.of(
                        com.tasteOdyssey.world_recipe_api.entity.comment.Comment.builder()
                                .message("Une recette incroyable ! J'ai ajouté un tout petit peu plus de Comté sur le dessus et c'était parfait.")
                                .dish(savedSoupe)
                                .user(ssmith)
                                .createdAt(LocalDateTime.now().minusDays(2))
                                .build(),
                        com.tasteOdyssey.world_recipe_api.entity.comment.Comment.builder()
                                .message("C'est la vraie recette de ma grand-mère. Très réconfortante en hiver.")
                                .dish(savedSoupe)
                                .user(xelea)
                                .createdAt(LocalDateTime.now().minusHours(5))
                                .build()
                );

                commentRepository.saveAll(comments);
            }

            if (ratingRepository.count() == 0) {
                com.tasteOdyssey.world_recipe_api.entity.dish.Dish savedSoupe = dishRepository.findBySlug("soupe-a-l-oignon-gratinee")
                        .orElseThrow(() -> new RuntimeException("Saved dish not found for comments"));

                com.tasteOdyssey.world_recipe_api.entity.user.User ssmith = userRepository.findByUsername("ssmith")
                        .orElseThrow(() -> new RuntimeException("User ssmith not found"));
                com.tasteOdyssey.world_recipe_api.entity.user.User xelea = userRepository.findByUsername("xelea")
                        .orElseThrow(() -> new RuntimeException("User xelea not found"));

                List<com.tasteOdyssey.world_recipe_api.entity.dish.Rating> comments = List.of(
                        com.tasteOdyssey.world_recipe_api.entity.dish.Rating.builder()
                                .stars(4)
                                .dish(savedSoupe)
                                .user(ssmith)
                                .build(),
                        com.tasteOdyssey.world_recipe_api.entity.dish.Rating.builder()
                                .stars(5)
                                .dish(savedSoupe)
                                .user(xelea)
                                .build()
                );
                ratingRepository.saveAll(comments);
            }

            if (likeDishRepository.count() == 0) {
                com.tasteOdyssey.world_recipe_api.entity.dish.Dish savedSoupe = dishRepository.findBySlug("soupe-a-l-oignon-gratinee")
                        .orElseThrow(() -> new RuntimeException("Saved dish not found for likes"));

                com.tasteOdyssey.world_recipe_api.entity.user.User ssmith = userRepository.findByUsername("ssmith")
                        .orElseThrow(() -> new RuntimeException("User ssmith not found"));

                LikeDish defaultLike = LikeDish.builder()
                        .dish(savedSoupe)
                        .user(ssmith)
                        .build();

                likeDishRepository.save(defaultLike);
            }

        };
    }
}
