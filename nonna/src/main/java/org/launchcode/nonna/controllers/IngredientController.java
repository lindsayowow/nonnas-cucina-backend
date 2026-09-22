package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.IngredientDTO;
import org.launchcode.nonna.models.Ingredient;
import org.launchcode.nonna.services.IngredientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping          // Retrieve all ingredients and convert them to DTOs
    public List<IngredientDTO> getAllIngredients() {
        return ingredientService.getAllIngredientDTOs();
    }

    @GetMapping("/{id}")      // get a single ingredient by ID and return its DTO
    public IngredientDTO getByIngredientDTOId(@PathVariable int id) {
        return ingredientService.getByIngredientDTOId(id);
    }

    @PostMapping         // Save a new ingredient entity to the database - future admin use
    public IngredientDTO createIngredient(@RequestBody Ingredient ingredient) {
        Ingredient saved = ingredientService.saveIngredient(ingredient);
        return new IngredientDTO(saved);
    }

    // Save multiple ingredients at once (bulk insert) - future admin use, used for initial setup
    @PostMapping("/bulk")
    public List<Ingredient> createIngredients(@RequestBody List<Ingredient> ingredients) {
        return ingredientService.saveAll(ingredients);
    }

    @PutMapping("/{id}")        // Update an existing ingredient with new values - future admin use
    public IngredientDTO updateIngredient(@PathVariable Integer id, @RequestBody Ingredient ingredient) {
        Ingredient updated = ingredientService.updateIngredient(id, ingredient);
        return new IngredientDTO(updated);
    }

    @DeleteMapping("/{id}")         // Remove ingredient from the database by ID - admin only future use
    public void deleteIngredient(@PathVariable int id) {
        ingredientService.deleteIngredient(id);
    }
}
