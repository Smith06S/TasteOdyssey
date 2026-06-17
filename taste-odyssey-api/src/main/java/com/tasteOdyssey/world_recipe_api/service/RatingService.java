package com.tasteOdyssey.world_recipe_api.service;

import com.tasteOdyssey.world_recipe_api.DTO.RatingRequest;
import com.tasteOdyssey.world_recipe_api.DTO.RatingResponse;
import com.tasteOdyssey.world_recipe_api.controller.RatingController;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.Rating;
import com.tasteOdyssey.world_recipe_api.entity.user.Role;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import com.tasteOdyssey.world_recipe_api.repository.DishRepository;
import com.tasteOdyssey.world_recipe_api.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final DishRepository dishRepository;

    @Transactional(readOnly = true)
    public EntityModel<RatingResponse> getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));

        RatingResponse response = RatingResponse.fromEntity(rating);

        return EntityModel.of(response,
                linkTo(methodOn(RatingController.class).getRatingById(id)).withSelfRel());

    }

    public EntityModel<RatingResponse> addOrUpdateRating(RatingRequest request) {
        User currentUser = getCurrentAuthenticatedUser();

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found: " + request.getDishId()));

        Optional<Rating> existingRating = ratingRepository.findByUserIdAndDishId(currentUser.getId(), dish.getId());

        Rating ratingToSave;
        if (existingRating.isPresent()) {
            ratingToSave = existingRating.get();
            ratingToSave.setStars(request.getStars());
        } else {
            ratingToSave = Rating.builder()
                    .user(currentUser)
                    .dish(dish)
                    .stars(request.getStars())
                    .build();
        }

        Rating savedRating = ratingRepository.save(ratingToSave);
        RatingResponse response = RatingResponse.fromEntity(savedRating);

        return EntityModel.of(response)
                .add(linkTo(methodOn(RatingController.class).getRatingById(savedRating.getId())).withSelfRel());
    }

    public EntityModel<RatingResponse> updateRating(Long id, RatingRequest request) {

        Rating existingRating = ratingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = existingRating.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (request.getStars() != null) existingRating.setStars(request.getStars());

        Rating updatedRating = ratingRepository.save(existingRating);
        RatingResponse response = RatingResponse.fromEntity(updatedRating);

        return EntityModel.of(response,
                linkTo(methodOn(RatingController.class).getRatingById(id)).withSelfRel());
    }

    public void deleteRating(Long id) {
        Rating ratingToDelete = ratingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rating not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = ratingToDelete.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this dish.");
        }

        ratingRepository.delete(ratingToDelete);
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return (User) principal;
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long dishId) {
        if (!dishRepository.existsById(dishId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found");
        }

        return ratingRepository.findAverageRatingByDishId(dishId)
                .orElse(0.0);
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getUserRatings(Long userId, Optional<Integer> limit) {
        List<Rating> ratings = ratingRepository.findByUserIdOrderByStarsDesc(userId);

        java.util.stream.Stream<Rating> ratingStream = ratings.stream();

        if (limit.isPresent() && limit.get() > 0) {
            ratingStream = ratingStream.limit(limit.get());
        }

        return ratingStream
                .map(RatingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getTop5Ratings() {
        List<Long> topDishIds = ratingRepository.findTop5DishIdsByAverageRating(PageRequest.of(0, 5));

        return topDishIds.stream()
                .map(dishId -> ratingRepository.findFirstByDishIdOrderByStarsDesc(dishId)
                        .map(RatingResponse::fromEntity)
                        .orElse(null))
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public Integer getUserRatingForDish(Long dishId) {
        User currentUser = getCurrentAuthenticatedUser();
        return ratingRepository.findByUserIdAndDishId(currentUser.getId(), dishId)
                .map(Rating::getStars)
                .orElse(0);
    }
}
