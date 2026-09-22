package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.CategoryDTO;
import org.launchcode.nonna.models.Category;
import org.launchcode.nonna.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // READ -- all categories, as DTOs
    public List<CategoryDTO> getAllCategoryDTOs() {
        List<Category> categories = categoryRepository.findAll();

        // Convert each Category into a CategoryDTO
        return categories.stream()
                .map(CategoryDTO::new)
                .toList();
    }

    // Look up category by ID and convert to DTO if present
    public CategoryDTO getByCategoryDTOId(int id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::new)
                .orElse(null);
    }

    // CREATE a new Category entity
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // UPDATE - Retrieve existing category or error if not found
    public Category updateCategory(Integer id, Category updatedCategory) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Apply updates
        existing.setCategoryName(updatedCategory.getCategoryName());
        existing.setCategoryMap(updatedCategory.getCategoryMap());

        // Save  back to database
        return categoryRepository.save(existing);
    }

    // DELETE category by ID
    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }
}
