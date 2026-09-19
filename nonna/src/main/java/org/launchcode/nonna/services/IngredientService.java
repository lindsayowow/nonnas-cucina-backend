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

    // READ -- all ingredients, as DTOs
    public List<IngredientDTO> getAllIngredientDTOs() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        return ingredients.stream()
                .map(IngredientDTO::new)
                .toList();
    }

    // READ -- single ingredient by id, as a DTO
    public IngredientDTO getByIngredientDTOId(int id) {
        return ingredientRepository.findById(id)
                .map(IngredientDTO::new)
                .orElse(null);
    }

    // CREATE -- single ingredient
    public Ingredient saveIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    // CREATE -- bulk insert
    public List<Ingredient> saveAll(List<Ingredient> ingredients) {
        return ingredientRepository.saveAll(ingredients);
    }

    // UPDATE
    public Ingredient updateIngredient(Integer id, Ingredient updatedIngredient) {
        Ingredient existing = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        existing.setIngredientName(updatedIngredient.getIngredientName());
        existing.setIngredientCost(updatedIngredient.getIngredientCost());
        existing.setEmoji(updatedIngredient.getEmoji());

        return ingredientRepository.save(existing);
    }

    // DELETE
    public void deleteIngredient(int id) {
        ingredientRepository.deleteById(id);
    }
}