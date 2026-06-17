package com.tasteOdyssey.world_recipe_api.DTO;

import com.tasteOdyssey.world_recipe_api.entity.dish.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {

    private Long id;
    private Integer stars;
    private UserSummaryResponse user;
    private DishSummaryResponse dish;

    public static RatingResponse fromEntity(Rating rating) {
        UserSummaryResponse userDTO = null;
        if (rating.getUser() != null) {
            userDTO = UserSummaryResponse.builder()
                    .id(rating.getUser().getId())
                    .username(rating.getUser().getUsername())
                    .build();
        }

        DishSummaryResponse dishDTO = null;
        if (rating.getDish() != null) {
        String mainImage = (rating.getDish().getListImages() != null && !rating.getDish().getListImages().isEmpty())
                ? rating.getDish().getListImages().getFirst()
                : null;

            dishDTO = DishSummaryResponse.builder()
                    .id(rating.getDish().getId())
                    .dishName(rating.getDish().getDishName())
                    .slug(rating.getDish().getSlug())
                    .imageUrl(mainImage)
                    .build();
        }

        return RatingResponse.builder()
                .id(rating.getId())
                .user(userDTO)
                .dish(dishDTO)
                .stars(rating.getStars())
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
        private String imageUrl;
    }
}
