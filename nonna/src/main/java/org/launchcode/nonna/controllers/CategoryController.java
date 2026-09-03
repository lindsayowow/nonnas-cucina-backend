package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.CategoryDTO;
import org.launchcode.nonna.models.Category;
import org.launchcode.nonna.services.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategoryDTOs();
    }

    @GetMapping("/{id}")
    public CategoryDTO getByCategoryId(@PathVariable int id) {
        return categoryService.getByCategoryDTOId(id);
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return  categoryService.saveCategory(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
    }
}
