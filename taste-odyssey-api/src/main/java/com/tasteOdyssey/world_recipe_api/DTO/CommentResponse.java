package com.tasteOdyssey.world_recipe_api.DTO;

import com.tasteOdyssey.world_recipe_api.entity.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String message;
    private LocalDateTime createdAt;
    private UserSummaryResponse user;
    private DishSummaryResponse dish;

    public static CommentResponse fromEntity(Comment comment) {
        UserSummaryResponse userDTO = null;
        if (comment.getUser() != null) {
            userDTO = UserSummaryResponse.builder()
                    .id(comment.getUser().getId())
                    .username(comment.getUser().getUsername())
                    .build();
        }

        DishSummaryResponse dishDTO = null;
        if (comment.getDish() != null) {
            dishDTO = DishSummaryResponse.builder()
                    .id(comment.getDish().getId())
                    .dishName(comment.getDish().getDishName())
                    .slug(comment.getDish().getSlug())
                    .build();
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .user(userDTO)
                .dish(dishDTO)
                .message(comment.getMessage())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummaryResponse {
        private Long id;
        private String username;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DishSummaryResponse {
        private Long id;
        private String dishName;
        private String slug;
    }
}
