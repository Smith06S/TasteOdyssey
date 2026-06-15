package com.tasteOdyssey.world_recipe_api.repository;

import com.tasteOdyssey.world_recipe_api.entity.user.Role;
import com.tasteOdyssey.world_recipe_api.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", exported = false)
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    Optional<User> findBySlug(String slug);

    Optional<User> findByUsername(String username);

    Page<User> findByRole(Role role, Pageable pageable);
}
