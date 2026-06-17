package com.tasteOdyssey.world_recipe_api.entity.dish.tool;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tool", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "tool_name", nullable = false, length = 50)
    private String toolName;
}
