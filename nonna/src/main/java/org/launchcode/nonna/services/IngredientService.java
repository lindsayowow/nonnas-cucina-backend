package org.launchcode.nonna.services;

import org.launchcode.nonna.models.Ingredient;
import org.launchcode.nonna.repositories.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    public Ingredient getIngredientById(int id) {
        return ingredientRepository.findById(id).orElse(null);
    }

    public Ingredient saveIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    public void deleteIngredient(int id) {
        ingredientRepository.deleteById(id);
    }


}
