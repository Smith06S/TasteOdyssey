package com.tasteOdyssey.world_recipe_api.controller;

import com.tasteOdyssey.world_recipe_api.DTO.DishResponse;
import com.tasteOdyssey.world_recipe_api.DTO.LikeDishResponse;
import com.tasteOdyssey.world_recipe_api.service.LikeDishService;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/like-dishes")
public class LikeDishController {

    private final LikeDishService likeDishService;

    public LikeDishController(LikeDishService likeDishService) {
        this.likeDishService = likeDishService;
    }

    @PostMapping("/toggle/{dishId}")
    public ResponseEntity<String> toggleLike(@PathVariable Long dishId) {
        boolean isLiked = likeDishService.toggleLike(dishId);
        if (isLiked) {
            return ResponseEntity.ok("Plat ajouté aux favoris (Liked).");
        } else {
            return ResponseEntity.ok("Plat retiré des favoris (Unliked).");
        }
    }

    @GetMapping("/my-favorites")
    public ResponseEntity<List<EntityModel<LikeDishResponse>>> getMyFavoriteDishes() {
        List<EntityModel<LikeDishResponse>> favorites = likeDishService.getLikedDishesByUser();
        return ResponseEntity.ok(favorites);
    }
}