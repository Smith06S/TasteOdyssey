package com.tasteOdyssey.world_recipe_api.DTO;

import com.tasteOdyssey.world_recipe_api.entity.dish.LikeDish;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeDishResponse {
    private DishSummaryResponse dish;

    public static LikeDishResponse fromEntity(LikeDish likeDish) {

        DishSummaryResponse dishDTO = null;
        if (likeDish.getDish() != null) {
            String mainImage = (likeDish.getDish().getListImages() != null && !likeDish.getDish().getListImages().isEmpty())
                    ? likeDish.getDish().getListImages().getFirst()
                    : null;

            dishDTO = DishSummaryResponse.builder()
                    .id(likeDish.getDish().getId())
                    .dishName(likeDish.getDish().getDishName())
                    .slug(likeDish.getDish().getSlug())
                    .imageUrl(mainImage)
                    .build();
        }
        return LikeDishResponse.builder()
                .dish(dishDTO)
                .build();
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
