package com.tasteOdyssey.world_recipe_api.repository;

import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "ingredients", path = "ingredients", exported = false)
public interface IngredientRepository extends JpaRepository<Ingredient, Long>, JpaSpecificationExecutor<Ingredient> {
    Optional<Ingredient> findByIngredientName(String ingredientName);
}
