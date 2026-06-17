package com.tasteOdyssey.world_recipe_api.DTO;

import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DishRequest {
    @NotBlank(message = "Le nom de la recette est requis.")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-.\\s]+$", message = "Le nom de la recette peut seulement contenir des lettres, des nombres, des espaces, des tirets, des underscores, et des points.")
    @Size(max = 100, message = "Le nom ne peut pas excéder 100 caractères.")
    private String dishName;

    @NotNull(message = "Le temps de préparation est requis.")
    private Integer cookingTime;

    @NotNull(message = "Le coût est requis.")
    private Integer cost;

    @NotNull(message = "La difficulté est requis.")
    private Ease ease;

    @NotNull(message = "Le type de recette est requis.")
    private DishType dishType;

    @NotEmpty(message = "Les régimes spéciaux de la recette sont requis.")
    private List<DietType> dietsType;

    @NotNull(message = "Le nombre de personnes est requis.")
    private Integer numberOfPerson;

    @Data
    public static class IngredientQuantiteRequest {
        private Long ingredientId;
        private BigDecimal quantity;
        private String unit;
    }

    @NotEmpty(message = "Les ingrédients sont requis.")
    private List<IngredientQuantiteRequest> ingredients;

    @Data
    public static class ToolRequest {
        private Long toolId;
    }

    @NotEmpty(message = "Les étapes de la recette sont requis.")
    private List<String> recipeSteps;

    @NotEmpty(message = "Les ustensiles sont requis.")
    private List<ToolRequest> tools;

    @NotBlank(message = "Le pays est requis.")
    private String country;

    private List<@Pattern(regexp = "^(http|https)://.*", message = "Chaque image doit avoir une URL valide commançant par http ou https.") String> listImage;
}
