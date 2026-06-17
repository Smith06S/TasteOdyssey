package com.tasteOdyssey.world_recipe_api.service;

import com.tasteOdyssey.world_recipe_api.DTO.CommentRequest;
import com.tasteOdyssey.world_recipe_api.DTO.CommentResponse;
import com.tasteOdyssey.world_recipe_api.DTO.DishRequest;
import com.tasteOdyssey.world_recipe_api.DTO.DishResponse;
import com.tasteOdyssey.world_recipe_api.controller.CommentController;
import com.tasteOdyssey.world_recipe_api.controller.DishController;
import com.tasteOdyssey.world_recipe_api.entity.comment.Comment;
import com.tasteOdyssey.world_recipe_api.entity.country.Country;
import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.ingredient.DishIngredient;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.DishTool;
import com.tasteOdyssey.world_recipe_api.entity.user.Role;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import com.tasteOdyssey.world_recipe_api.repository.CommentRepository;
import com.tasteOdyssey.world_recipe_api.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final DishRepository dishRepository;

    @Transactional(readOnly = true)
    public EntityModel<CommentResponse> getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        CommentResponse response = CommentResponse.fromEntity(comment);

        return EntityModel.of(response,
                linkTo(methodOn(CommentController.class).getCommentById(id)).withSelfRel());

    }

    public EntityModel<CommentResponse> addComment(CommentRequest request) {
        User currentUser = getCurrentAuthenticatedUser();

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found: " + request.getDishId()));

        Comment comment = Comment.builder()
                .user(currentUser)
                .dish(dish)
                .message(request.getMessage())
                .createdAt(LocalDateTime.now())
                .build();


        Comment savedComment = commentRepository.save(comment);

        CommentResponse response = CommentResponse.fromEntity(savedComment);

        return EntityModel.of(response)
                .add(linkTo(methodOn(CommentController.class).getCommentById(savedComment.getId())).withSelfRel());
    }

    public EntityModel<CommentResponse> updateComment(Long id, CommentRequest request) {

        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = existingComment.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (request.getMessage() != null) existingComment.setMessage(request.getMessage());

        Comment updatedComment = commentRepository.save(existingComment);
        CommentResponse response = CommentResponse.fromEntity(updatedComment);

        return EntityModel.of(response,
                linkTo(methodOn(CommentController.class).getCommentById(id)).withSelfRel());
    }

    public void deleteComment(Long id) {
        Comment commentToDelete = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = commentToDelete.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this dish.");
        }

        commentRepository.delete(commentToDelete);
    }

    @Transactional(readOnly = true)
    public List<EntityModel<CommentResponse>> getCommentsByDishId(Long dishId) {
        if (!dishRepository.existsById(dishId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dish not found");
        }

        return commentRepository.findByDishId(dishId).stream()
                .map(comment -> EntityModel.of(CommentResponse.fromEntity(comment),
                        linkTo(methodOn(CommentController.class).getCommentById(comment.getId())).withSelfRel()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EntityModel<CommentResponse>> getCommentsByUserId(Long userId) {

        return commentRepository.findByUserId(userId).stream()
                .map(comment -> EntityModel.of(CommentResponse.fromEntity(comment),
                        linkTo(methodOn(CommentController.class).getCommentById(comment.getId())).withSelfRel()))
                .toList();
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        return (User) principal;
    }
}
