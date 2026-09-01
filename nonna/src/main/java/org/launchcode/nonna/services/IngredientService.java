package org.launchcode.nonna.services;

import org.launchcode.nonna.models.Ingredient;
import org.launchcode.nonna.repositories.IngredientRepository;
import org.springframework.stereotype.Service;
import org.launchcode.nonna.dtos.IngredientDTO;


import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<IngredientDTO> getAllIngredientDTOs() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        return ingredients.stream()
                .map(IngredientDTO::new)
                .toList();
    }

    public IngredientDTO getByIngredientDTOId(int id) {
        return ingredientRepository.findById(id)
                .map(IngredientDTO::new)
                .orElse(null);
    }

    public Ingredient saveIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    public void deleteIngredient(int id) {
        ingredientRepository.deleteById(id);
    }

    private IngredientDTO convertToDTO(Ingredient ingredient) {
        return new IngredientDTO(ingredient);
    }

}
