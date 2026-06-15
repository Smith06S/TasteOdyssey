package com.tasteOdyssey.world_recipe_api.service;

import com.tasteOdyssey.world_recipe_api.entity.dish.tool.Tool;
import com.tasteOdyssey.world_recipe_api.repository.ToolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToolService {

    private final ToolRepository toolRepository;

    @Transactional(readOnly = true)
    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }
}