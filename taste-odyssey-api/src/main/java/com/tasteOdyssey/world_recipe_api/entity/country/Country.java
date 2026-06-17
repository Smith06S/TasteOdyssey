package com.tasteOdyssey.world_recipe_api.entity.country;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_country", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName;
}
