package com.tasteOdyssey.world_recipe_api.service;

import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient;
import com.tasteOdyssey.world_recipe_api.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    @Transactional(readOnly = true)
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }
}