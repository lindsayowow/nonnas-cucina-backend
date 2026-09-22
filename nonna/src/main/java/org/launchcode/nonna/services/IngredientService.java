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

    // READ all ingredients from db
    public List<IngredientDTO> getAllIngredientDTOs() {
        List<Ingredient> ingredients = ingredientRepository.findAll();

        // Convert each Ingredient into DTO
        return ingredients.stream()
                .map(IngredientDTO::new)
                .toList();
    }

    // READ ingredient by id and convert to DTO
    public IngredientDTO getByIngredientDTOId(int id) {
          return ingredientRepository.findById(id)
                .map(IngredientDTO::new)
                .orElse(null);
    }

    // CREATE - new ingredient - admin only future use
    public Ingredient saveIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    // CREATE - bulk insert - admin only future use
    public List<Ingredient> saveAll(List<Ingredient> ingredients) {
        return ingredientRepository.saveAll(ingredients);
    }

    // UPDATE ingredient or throw error - admin only future use
    public Ingredient updateIngredient(Integer id, Ingredient updatedIngredient) {
        Ingredient existing = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        // Apply updates to ingredients - admin only
        existing.setIngredientName(updatedIngredient.getIngredientName());
        existing.setIngredientCost(updatedIngredient.getIngredientCost());
        existing.setEmoji(updatedIngredient.getEmoji());

        // Save ingredient back to database
        return ingredientRepository.save(existing);
    }

    // DELETE ingredient - admin only
    public void deleteIngredient(int id) {
        ingredientRepository.deleteById(id);
    }
}
