package com.tasteOdyssey.world_recipe_api.service;

import com.tasteOdyssey.world_recipe_api.DTO.DishResponse;
import com.tasteOdyssey.world_recipe_api.DTO.LikeDishResponse;
import com.tasteOdyssey.world_recipe_api.DTO.RatingResponse;
import com.tasteOdyssey.world_recipe_api.controller.DishController;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.LikeDish;
import com.tasteOdyssey.world_recipe_api.entity.dish.Rating;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import com.tasteOdyssey.world_recipe_api.repository.DishRepository;
import com.tasteOdyssey.world_recipe_api.repository.LikeDishRepository;
import com.tasteOdyssey.world_recipe_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
@RequiredArgsConstructor
public class LikeDishService {

    private final LikeDishRepository likeDishRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean toggleLike(Long dishId) {
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUserName)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le username : " + currentUserName));

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new IllegalArgumentException("Plat non trouvé avec l'id : " + dishId));

        Optional<LikeDish> existingLike = likeDishRepository.findByUserAndDish(user, dish);

        if (existingLike.isPresent()) {
            likeDishRepository.delete(existingLike.get());
            return false;
        } else {
            LikeDish newLike = LikeDish.builder()
                    .user(user)
                    .dish(dish)
                    .build();
            likeDishRepository.save(newLike);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<EntityModel<LikeDishResponse>> getLikedDishesByUser() { // <--- Changement de type ici
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUserName)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le username : " + currentUserName));

        List<LikeDish> userLikes = likeDishRepository.findByUser(user);

        return userLikes.stream()
                .map(like -> {
                    LikeDishResponse response = LikeDishResponse.fromEntity(like);

                    return EntityModel.of(response,
                            linkTo(methodOn(DishController.class).getDishById(like.getDish().getId())).withSelfRel(),
                            linkTo(methodOn(DishController.class).getAllDishes(0, 10, null)).withRel("dishes"));
                })
                .toList();
    }

}