package org.launchcode.nonna.services;

import org.launchcode.nonna.models.Category;
import org.launchcode.nonna.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository)
    {this.categoryRepository=categoryRepository;}

    public List<Category> getAllCategories()
    {return categoryRepository.findAll();}

    public Category getByCategoryId(int id)
    {return categoryRepository.findById(id).orElse(null);}

    public Category saveCategory(Category category)
    {return categoryRepository.save(category);}

    public void deleteCategory(int id)
    {categoryRepository.deleteById(id);}
}
