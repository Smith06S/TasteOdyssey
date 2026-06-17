package com.tasteOdyssey.world_recipe_api.service;

import com.github.slugify.Slugify;
import com.tasteOdyssey.world_recipe_api.DTO.DishRequest;
import com.tasteOdyssey.world_recipe_api.DTO.DishResponse;
import com.tasteOdyssey.world_recipe_api.controller.DishController;
import com.tasteOdyssey.world_recipe_api.entity.country.Country;
import com.tasteOdyssey.world_recipe_api.entity.dish.DietType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.DishType;
import com.tasteOdyssey.world_recipe_api.entity.dish.Ease;
import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient;
import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.Ingredient;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool;
import com.tasteOdyssey.world_recipe_api.entity.user.Role;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import com.tasteOdyssey.world_recipe_api.repository.*;
import com.tasteOdyssey.world_recipe_api.specification.DishSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
@RequiredArgsConstructor
public class DishService {
    private final DishRepository dishRepository;
    private final CountryRepository countryRepository;
    private final IngredientRepository ingredientRepository;
    private final ToolRepository toolRepository;
    private final Slugify slugify = Slugify.builder().build();

    @Transactional(readOnly = true)
    public EntityModel<DishResponse> getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found"));

        DishResponse response = DishResponse.fromEntity(dish);

        return EntityModel.of(response,
                linkTo(methodOn(DishController.class).getDishById(id)).withSelfRel(),
                linkTo(methodOn(DishController.class).getAllDishes(0, 10, null)).withRel("dishes"));

    }

    @Transactional(readOnly = true)
    public PagedModel<EntityModel<DishResponse>> getAllDishes(Pageable pageable, PagedResourcesAssembler<Dish> assembler) {
        Page<Dish> dishPage = dishRepository.findAll(pageable);

        return assembler.toModel(dishPage, dish ->
                EntityModel.of(DishResponse.fromEntity(dish),
                        linkTo(methodOn(DishController.class).getDishById(dish.getId())).withSelfRel()));
    }

    public EntityModel<DishResponse> findDishBySlug(String slug) {
        Dish dish = dishRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No dish found with the slug: " + slug));

        DishResponse response = DishResponse.fromEntity(dish);

        return EntityModel.of(response,
                linkTo(methodOn(DishController.class).getDishById(dish.getId())).withSelfRel(),
                linkTo(methodOn(DishController.class).getAllDishes(0, 10, null)).withRel("dishes"));

    }

    public EntityModel<DishResponse> createDish(DishRequest request) {
        dishRepository.findByDishName(request.getDishName()).ifPresent(
                dish -> {
                    throw new RuntimeException("This dish already exists");
                }
        );

        String generatedSlug = slugify.slugify(request.getDishName());

        User currentUser = getCurrentAuthenticatedUser();

        Country country = countryRepository.findByCountryName(request.getCountry())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found: " + request.getCountry()));

        Dish dish = Dish.builder()
                .dishName(request.getDishName())
                .cookingTime(request.getCookingTime())
                .cost(request.getCost())
                .ease(request.getEase())
                .listImages(request.getListImage())
                .slug(generatedSlug)
                .dishType(request.getDishType())
                .diets(request.getDietsType())
                .country(country)
                .numberOfPerson(request.getNumberOfPerson())
                .recipeSteps(request.getRecipeSteps())
                .creator(currentUser)
                .build();

        dish.setDishIngredients(getIngredients(dish, request));

        dish.setDishTools(getTools(dish, request));

        Dish savedDish = dishRepository.save(dish);

        DishResponse response = DishResponse.fromEntity(savedDish);

        return EntityModel.of(response)
                .add(linkTo(methodOn(DishController.class).getDishById(savedDish.getId())).withSelfRel());
    }

    public EntityModel<DishResponse> updateDish(Long id, DishRequest request) {

        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = existingDish.getCreator().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (request.getDishName() != null) {
            existingDish.setDishName(request.getDishName());
            String newSlug = slugify.slugify(request.getDishName());
            existingDish.setSlug(newSlug);
        }

        if (request.getCookingTime() != null) existingDish.setCookingTime(request.getCookingTime());
        if (request.getCost() != null) existingDish.setCost(request.getCost());
        if (request.getEase() != null) existingDish.setEase(request.getEase());
        if (request.getDishType() != null) existingDish.setDishType(request.getDishType());
        if (request.getDietsType() != null) existingDish.setDiets(request.getDietsType());
        if (request.getListImage() != null) existingDish.setListImages(request.getListImage());
        if (request.getNumberOfPerson() != null) existingDish.setNumberOfPerson(request.getNumberOfPerson());
        if (request.getRecipeSteps() != null) existingDish.setRecipeSteps(request.getRecipeSteps());

        if (request.getCountry() != null) {
            Country country = countryRepository.findByCountryName(request.getCountry())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found"));
            existingDish.setCountry(country);
        }

        if (request.getIngredients() != null) {
            List<DishIngredient> newIngredients = getIngredients(existingDish, request);
            existingDish.getDishIngredients().clear();
            existingDish.getDishIngredients().addAll(newIngredients);
        }

        if (request.getTools() != null) {
            List<DishTool> newTools = getTools(existingDish, request);
            existingDish.getDishTools().clear();
            existingDish.getDishTools().addAll(newTools);
        }

        Dish updatedDish = dishRepository.save(existingDish);
        DishResponse response = DishResponse.fromEntity(updatedDish);

        return EntityModel.of(response,
                linkTo(methodOn(DishController.class).getDishById(id)).withSelfRel());
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return (User) principal;
    }

    public void deleteDish(Long id) {
        Dish dishToDelete = dishRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = dishToDelete.getCreator().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this dish.");
        }

        dishRepository.delete(dishToDelete);
    }

    @Transactional(readOnly = true)
    public Page<DishResponse> searchDishes(String name, Integer maxTime, Integer maxCost, Ease ease, DishType type, List<DietType> diets, Integer countryId, String ingredientName, String toolName, Pageable pageable) {
        Specification<Dish> spec = Specification.where(DishSpecifications.withName(name))
                .and(DishSpecifications.hasMaxCookingTime(maxTime))
                .and(DishSpecifications.hasMaxCost(maxCost))
                .and(DishSpecifications.hasEase(ease))
                .and(DishSpecifications.hasDishType(type))
                .and(DishSpecifications.hasDishDiets(diets))
                .and(DishSpecifications.hasCountryId(countryId))
                .and(DishSpecifications.hasIngredient(ingredientName))
                .and(DishSpecifications.hasTools(toolName));

        Page<Dish> dishPage = dishRepository.findAll(spec, pageable);

        return dishPage.map(DishResponse::fromEntity);
    }

    public List<DishIngredient> getIngredients(Dish dish, DishRequest request) {
        if (request.getIngredients() == null) return new ArrayList<>();
        return request.getIngredients().stream().map(ingReq -> {
            Ingredient ingredient = ingredientRepository.findById(ingReq.getIngredientId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found ID: " + ingReq.getIngredientId()));
            return DishIngredient.builder()
                    .dish(dish)
                    .ingredient(ingredient)
                    .quantity(ingReq.getQuantity())
                    .unit(ingReq.getUnit())
                    .build();
        }).collect(Collectors.toList());
    }

    private List<DishTool> getTools(Dish dish, DishRequest request) {
        if (request.getTools() == null) return new ArrayList<>();
        return request.getTools().stream().map(toolReq -> {
            Tool tool = toolRepository.findById(toolReq.getToolId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tool not found ID: " + toolReq.getToolId()));
            return DishTool.builder()
                    .dish(dish)
                    .tool(tool)
                    .build();
        }).collect(Collectors.toList());
    }
}
