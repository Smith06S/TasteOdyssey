package com.tasteOdyssey.world_recipe_api.DTO;

import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishResponse {
    private Long id;
    private String dishName;
    private List<String> listImages;
    private Integer cost;
    private Ease ease;
    private List<DietType> diets;
    private DishType dishType;
    private String slug;
    private Integer numberOfPerson;
    private CreatorResponse creator;
    private List<IngredientResponse> ingredients;
    private List<ToolResponse> tools;
    private CountryResponse countries;
    private List<String> recipeSteps;

    public static DishResponse fromEntity(Dish dish) {
        List<IngredientResponse> ingredientDTOs = Collections.emptyList();
        if (dish.getDishIngredients() != null) {
            ingredientDTOs = dish.getDishIngredients().stream()
                    .map(dishIng -> IngredientResponse.builder()
                            .id(dishIng.getIngredient().getId())
                            .name(dishIng.getIngredient().getIngredientName())
                            .quantity(dishIng.getQuantity())
                            .unit(dishIng.getUnit())
                            .build())
                    .toList();
        }

        List<ToolResponse> toolDTOs = Collections.emptyList();
        if (dish.getDishTools() != null) {
            toolDTOs = dish.getDishTools().stream()
                    .map(dishTool -> ToolResponse.builder()
                            .id(dishTool.getTool().getId())
                            .name(dishTool.getTool().getToolName())
                            .build())
                    .toList();
        }

        CountryResponse countryDTO = null;
        if (dish.getCountry() != null) {
            countryDTO = CountryResponse.builder()
                    .id(dish.getCountry().getId())
                    .name(dish.getCountry().getCountryName())
                    .build();
        }

        return DishResponse.builder()
                .id(dish.getId())
                .listImages(dish.getListImages())
                .dishName(dish.getDishName())
                .cost(dish.getCost())
                .ease(dish.getEase())
                .diets(dish.getDiets())
                .dishType(dish.getDishType())
                .numberOfPerson(dish.getNumberOfPerson())
                .slug(dish.getSlug())
                .recipeSteps(dish.getRecipeSteps())
                .creator(CreatorResponse.builder()
                        .id(dish.getCreator().getId())
                        .username(dish.getCreator().getUsername())
                        .build())
                .ingredients(ingredientDTOs)
                .tools(toolDTOs)
                .countries(countryDTO)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngredientResponse {
        private Long id;
        private String name;
        private java.math.BigDecimal quantity;
        private String unit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolResponse {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryResponse {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    public static class CreatorResponse {
        private Long id;
        private String username;
    }
}
