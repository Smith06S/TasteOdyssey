package com.tasteOdyssey.world_recipe_api.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {
    @NotNull(message = "Le nombre d'étoiles est requis.")
    private Integer stars;

    @NotNull(message = "L'identifiant du plat est requis.")
    private Long dishId;
}
