package com.tasteOdyssey.world_recipe_api.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Le contenu du commentaire ne peut pas être vide.")
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 2000 caractères.")
    private String message;

    @NotNull(message = "L'identifiant du plat est requis.")
    private Long dishId;
}
