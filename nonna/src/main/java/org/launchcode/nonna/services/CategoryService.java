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

    public List<CategoryDTO> getAllCategoryDTOs() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryDTO::new)
                .toList();
    }

    public CategoryDTO getByCategoryDTOId(int id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::new)
                .orElse(null);
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Integer id, Category updatedCategory) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategoryName(updatedCategory.getCategoryName());
        existing.setCategoryMap(updatedCategory.getCategoryMap());

        return categoryRepository.save(existing);
    }

    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(category);
    }
}
