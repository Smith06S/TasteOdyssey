package com.tasteOdyssey.world_recipe_api.repository;

import com.tasteOdyssey.world_recipe_api.entity.dish.Dish;
import com.tasteOdyssey.world_recipe_api.entity.dish.LikeDish;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "likeDishes", path = "like-dishes", exported = false)
public interface LikeDishRepository extends JpaRepository<LikeDish, Long>, JpaSpecificationExecutor<LikeDish> {
    Optional<LikeDish> findByUserAndDish(User user, Dish dish);

    List<LikeDish> findByUser(User user);
}
