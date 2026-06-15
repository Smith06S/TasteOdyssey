package com.tasteOdyssey.world_recipe_api.repository;

import com.tasteOdyssey.world_recipe_api.entity.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "comments", path = "comments", exported = false)
public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    Optional<Comment> findById(Long id);

    List<Comment> findByDishId(Long dishId);

    List<Comment> findByUserId(Long userId);
}
