package com.tasteOdyssey.world_recipe_api.entity.dish.ingredient;

import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "DISH_INGREDIENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dish_ingredient")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id")
    private Dish dish;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @Column(precision = 6, scale = 2)
    private BigDecimal quantity;

    @Column(length = 20)
    private String unit;
}