package com.tasteOdyssey.world_recipe_api.repository;

import com.tasteOdyssey.world_recipe_api.entity.comment.Comment;
import com.tasteOdyssey.world_recipe_api.entity.dish.Rating;
import com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "ratings", path = "ratings", exported = false)
public interface RatingRepository extends JpaRepository<Rating, Long>, JpaSpecificationExecutor<Rating> {
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.dish.id = :dishId")
    Optional<Double> findAverageRatingByDishId(@Param("dishId") Long dishId);

    List<Rating> findByUserIdOrderByStarsDesc(Long userId);

    @Query("SELECT r.dish.id FROM Rating r GROUP BY r.dish.id ORDER BY AVG(r.stars) DESC")
    List<Long> findTop5DishIdsByAverageRating(Pageable pageable);

    Optional<Rating> findFirstByDishIdOrderByStarsDesc(Long dishId);

    Optional<Rating> findFirstByDishId(Long dishId);

    Optional<Rating> findByUserIdAndDishId(Long userId, Long dishId);

    Optional<Rating> findById(Long id);
}
