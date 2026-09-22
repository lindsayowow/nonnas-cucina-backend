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
        return categoryService.getAllCategoryDTOs(); // Convert entities → DTOs for safe output
    }

    @GetMapping("/{id}")                  // GET /categories/{id} — fetch category by ID
    public CategoryDTO getByCategoryId(@PathVariable int id) {
        return categoryService.getByCategoryDTOId(id); // Service handles lookup + DTO conversion
    }

    @PostMapping             // POST /categories — create a new category (future admin function)
    public CategoryDTO createCategory(@RequestBody Category category) {
        Category saved = categoryService.saveCategory(category);
        return new CategoryDTO(saved);                           // Return DTO of saved entity
    }

    @PutMapping("/{id}")    // PUT /categories/{id} — update an existing category (future admin function)
    public CategoryDTO updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        Category updated = categoryService.updateCategory(id, category);
        return new CategoryDTO(updated);                                 // Return updated DTO
    }

    @DeleteMapping("/{id}")  // DELETE /categories/{id} — remove category (future admin function)
    public void deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id); // Service handles deletion
    }
}
