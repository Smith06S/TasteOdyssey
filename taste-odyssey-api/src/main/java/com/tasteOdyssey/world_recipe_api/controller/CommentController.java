package com.tasteOdyssey.world_recipe_api.controller;

import com.tasteOdyssey.world_recipe_api.DTO.CommentRequest;
import com.tasteOdyssey.world_recipe_api.DTO.CommentResponse;
import com.tasteOdyssey.world_recipe_api.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public EntityModel<CommentResponse> getCommentById(@PathVariable("id") Long id) {
        return commentService.getCommentById(id);
    }

    @PostMapping("/comment")
    public ResponseEntity<EntityModel<CommentResponse>> addComment(@Valid @RequestBody CommentRequest request) throws Exception {
        return ResponseEntity.ok(commentService.addComment(request));
    }

    @PatchMapping("/{id}")
    public EntityModel<CommentResponse> updateComment(@Valid @PathVariable("id") Long id, @RequestBody CommentRequest request) {
        return commentService.updateComment(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }

    @GetMapping("/dish/{dishId}")
    public ResponseEntity<List<EntityModel<CommentResponse>>> getCommentsByDishId(@PathVariable("dishId") Long dishId) {
        return ResponseEntity.ok(commentService.getCommentsByDishId(dishId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EntityModel<CommentResponse>>> getCommentsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(commentService.getCommentsByUserId(userId));
    }
}
