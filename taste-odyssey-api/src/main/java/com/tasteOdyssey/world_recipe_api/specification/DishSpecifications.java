package com.tasteOdyssey.world_recipe_api.specification;

import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface DishSpecifications {
    static Specification<Dish> withName(String name) {
        return ((root, query, cb) ->
                name == null ? null : cb.like(cb.lower(root.get("dishName")), "%" + name.toLowerCase() + "%"));
    }

    static Specification<Dish> hasMaxCookingTime(Integer maxTime) {
        return ((root, query, cb) ->
                maxTime == null ? null : cb.greaterThanOrEqualTo(root.get("cookingTime"), maxTime));
    }

    static Specification<Dish> hasMaxCost(Integer maxCost) {
        return ((root, query, cb) ->
                maxCost == null ? null : cb.greaterThanOrEqualTo(root.get("cost"), maxCost));
    }

    static Specification<Dish> hasEase(Ease ease) {
        return ((root, query, cb) ->
                ease == null ? null : cb.equal(root.get("ease"), ease));
    }

    static Specification<Dish> hasDishType(DishType type) {
        return ((root, query, cb) ->
                type == null ? null : cb.equal(root.get("dishType"), type));
    }

    static Specification<Dish> hasDishDiets(List<DietType> diets) {
        return ((root, query, cb) ->
                diets == null ? null : cb.equal(root.get("diets"), diets));
    }

    static Specification<Dish> hasCountryId(Integer countryId) {
        return ((root, query, cb) ->
                countryId == null ? null : cb.equal(root.get("country").get("id"), countryId));
    }

    static Specification<Dish> hasIngredient(String ingredientName) {
        return ((root, query, cb) -> {
                if (ingredientName == null || ingredientName.isEmpty()) return null;

                Join<Dish, DishIngredient> dishIngredients = root.join("dishIngredients");
                Join<DishIngredient, Dish> ingredients = dishIngredients.join("ingredient");

                return cb.like(cb.lower(ingredients.get("ingredientName")), "%" + ingredientName.toLowerCase() + "%");
        });
    }

    static Specification<Dish> hasTools(String toolName) {
        return ((root, query, cb) -> {
            if (toolName == null || toolName.isEmpty()) return null;

            Join<Dish, DishTool> dishTools = root.join("dishTools");
            Join<DishTool, Tool> tools = dishTools.join("tool");

            return cb.like(cb.lower(tools.get("toolName")), "%" + toolName.toLowerCase() + "%");
        });
    }

}
