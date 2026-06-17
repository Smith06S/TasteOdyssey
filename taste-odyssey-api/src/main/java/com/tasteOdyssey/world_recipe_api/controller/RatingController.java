package com.tasteOdyssey.world_recipe_api.controller;

import com.tasteOdyssey.world_recipe_api.DTO.CommentRequest;
import com.tasteOdyssey.world_recipe_api.DTO.CommentResponse;
import com.tasteOdyssey.world_recipe_api.DTO.RatingRequest;
import com.tasteOdyssey.world_recipe_api.DTO.RatingResponse;
import com.tasteOdyssey.world_recipe_api.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/{id}")
    public EntityModel<RatingResponse> getRatingById(@PathVariable("id") Long id) {
        return ratingService.getRatingById(id);
    }

    @GetMapping("/dish/{dishId}/user-rating")
    public ResponseEntity<Integer> getUserRatingForDish(@PathVariable Long dishId) {
        return ResponseEntity.ok(ratingService.getUserRatingForDish(dishId));
    }

    @PostMapping("/rating")
    public ResponseEntity<EntityModel<RatingResponse>> addOrUpdateRating(@RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.addOrUpdateRating(request));
    }

    @PatchMapping("/{id}")
    public EntityModel<RatingResponse> updateRating(@Valid @PathVariable("id") Long id, @RequestBody RatingRequest request) {
        return ratingService.updateRating(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
    }

    @GetMapping("/dish/{dishId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long dishId) {
        return ResponseEntity.ok(ratingService.getAverageRating(dishId));
    }

    @GetMapping("/user/{userId}") ///user/{userId}?limit=nb pour avoir un nombre limité
    public ResponseEntity<List<RatingResponse>> getUserRatings(
            @PathVariable Long userId,
            @RequestParam(value = "limit", required = false) Integer limit) {

        return ResponseEntity.ok(ratingService.getUserRatings(userId, Optional.ofNullable(limit)));
    }

    @GetMapping("/top5")
    public ResponseEntity<List<RatingResponse>> getTop5() {
        return ResponseEntity.ok(ratingService.getTop5Ratings());
    }

}
