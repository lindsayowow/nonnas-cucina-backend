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

    @GetMapping
    public List<IngredientDTO> getAllIngredients() {
        return ingredientService.getAllIngredientDTOs();
    }

    @GetMapping("/{id}")
    public IngredientDTO getByIngredientDTOId(@PathVariable int id) {
        return ingredientService.getByIngredientDTOId(id);
    }

    @PostMapping
    public Ingredient createIngredient(@RequestBody Ingredient ingredient) {
        return ingredientService.saveIngredient(ingredient);
    }

    @PostMapping("/bulk")
    public List<Ingredient> createIngredients(@RequestBody List<Ingredient> ingredients) {
        return ingredientService.saveAll(ingredients);
    }

    @PutMapping("/{id}")
    public Ingredient updateIngredient(@PathVariable Integer id, @RequestBody Ingredient ingredient) {
        return ingredientService.updateIngredient(id, ingredient);
    }

    @DeleteMapping("/{id}")
    public void deleteIngredient(@PathVariable int id) {
        ingredientService.deleteIngredient(id);
    }
}
