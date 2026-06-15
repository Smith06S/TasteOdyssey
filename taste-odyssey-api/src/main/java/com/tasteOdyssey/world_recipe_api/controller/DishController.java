package com.tasteOdyssey.world_recipe_api.controller;

import com.tasteOdyssey.world_recipe_api.DTO.*;
import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import com.tasteOdyssey.world_recipe_api.service.DishService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dishes")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @PostMapping("/dish")
    public ResponseEntity<EntityModel<DishResponse>> createDish(@Valid @RequestBody DishRequest request) throws Exception {
        return ResponseEntity.ok(dishService.createDish(request));
    }

    @GetMapping
    public PagedModel<EntityModel<DishResponse>> getAllDishes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            PagedResourcesAssembler<Dish> assembler) {

        Pageable pageable = PageRequest.of(page, size);

        return dishService.getAllDishes(pageable, assembler);
    }

    @GetMapping("/{id}")
    public EntityModel<DishResponse> getDishById(@PathVariable("id") Long id) {
        return dishService.getDishById(id);
    }

    @GetMapping("/slug/{slug}")
    public EntityModel<DishResponse> findDishBySlug(@PathVariable("slug") String slug) {
        return dishService.findDishBySlug(slug);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DishResponse>> searchDishes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer maxTime,
            @RequestParam(required = false) Integer maxCost,
            @RequestParam(required = false) Ease ease,
            @RequestParam(required = false) DishType type,
            @RequestParam(required = false) List<DietType> diets,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) String ingredientName,
            @RequestParam(required = false) String toolName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(dishService.searchDishes(name, maxTime, maxCost, ease, type, diets, countryId, ingredientName, toolName, pageable));
    }

    @PatchMapping("/{id}")
    public EntityModel<DishResponse> updateDish(@Valid @PathVariable("id") Long id, @RequestBody DishRequest request) {
        return dishService.updateDish(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
    }

}
