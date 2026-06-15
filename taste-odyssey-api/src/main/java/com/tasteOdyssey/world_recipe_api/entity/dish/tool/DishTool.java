package com.tasteOdyssey.world_recipe_api.entity.dish.tool;

import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "dish_tool")
public class DishTool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dish_tool", nullable = false, updatable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;

    @ManyToOne
    @JoinColumn(name = "tool_id")
    private Tool tool;
}