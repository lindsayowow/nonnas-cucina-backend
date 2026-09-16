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
    public CategoryDTO createCategory(@RequestBody Category category) {
        Category saved = categoryService.saveCategory(category);
        return new CategoryDTO(saved);
    }

    @PutMapping("/{id}")
    public CategoryDTO updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        Category updated = categoryService.updateCategory(id, category);
        return new CategoryDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
    }
}
