package com.tasteOdyssey.world_recipe_api.entity.dish.ingredient;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingredient", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "ingredient_name", nullable = false, length = 50)
    private String ingredientName;
}
