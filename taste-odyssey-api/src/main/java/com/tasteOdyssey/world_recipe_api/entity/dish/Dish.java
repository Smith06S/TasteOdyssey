package com.tasteOdyssey.world_recipe_api.entity.dish;

import com.tasteOdyssey.world_recipe_api.entity.country.Country;
import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "dish")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dish", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "dish_name", nullable = false, length = 100)
    private String dishName;

    @Column(name = "cooking_time", nullable = false)
    private Integer cookingTime;

    @ElementCollection
    @CollectionTable(name = "dish_recipe_steps", joinColumns = @JoinColumn(name = "dish_id"))
    @Column(name = "step", columnDefinition = "TEXT")
    @OrderColumn(name = "step_order")
    private List<String> recipeSteps;

    @Column(name = "cost", nullable = false)
    private Integer cost;

    @Enumerated(EnumType.STRING)
    @Column(name = "ease", nullable = false, length = 10)
    private Ease ease;

    @Column(name = "list_images", nullable = false, columnDefinition = "TEXT")
    private List<String> listImages;

    @Enumerated(EnumType.STRING)
    @Column(name = "dish_type", nullable = false, length = 50)
    private DishType dishType;

    @Enumerated(EnumType.STRING)
    @Column(name = "diets", nullable = false, length = 50)
    private List<DietType> diets;

    @Column(name = "slug", unique = true, nullable = false, length = 50)
    private String slug;

    @Column(name = "persons",  nullable = false, length = 50)
    private Integer numberOfPerson;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishIngredient> dishIngredients;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishTool> dishTools;

    @ManyToOne
    @JoinColumn(name = "id_country", nullable = false)
    private Country country;

    @ManyToOne
    @JoinColumn(name = "creator_user_id", nullable = false)
    private User creator;
}