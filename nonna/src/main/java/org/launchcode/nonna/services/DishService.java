package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.CreateDishDTO;
import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.models.DishIngredient;
import org.launchcode.nonna.models.Ingredient;
import org.launchcode.nonna.repositories.DishIngredientRepository;
import org.launchcode.nonna.repositories.DishRepository;
import org.launchcode.nonna.repositories.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {

    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final DishIngredientRepository dishIngredientRepository;

    public DishService(DishRepository dishRepository,
                       IngredientRepository ingredientRepository,
                       DishIngredientRepository dishIngredientRepository) {
        this.dishRepository = dishRepository;
        this.ingredientRepository = ingredientRepository;
        this.dishIngredientRepository = dishIngredientRepository;
    }

    public List<DishDTO> getAllDishDTOs() {
        return dishRepository.findAll().stream()
                .map(DishDTO::new)
                .toList();
    }

    public DishDTO getByDishDTOId(Integer id) {
        return dishRepository.findById(id)
                .map(DishDTO::new)
                .orElse(null);
    }

    public DishDTO createDish(CreateDishDTO dto) {
        // 1. Create dish
        Dish dish = new Dish();
        dish.setDishCost(dto.getDishCost());

        Dish saved = dishRepository.save(dish);

        // 2. Create join rows
        for (Integer ingredientId : dto.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Ingredient not found"));

            DishIngredient di = new DishIngredient();
            di.setDish(saved);
            di.setIngredient(ingredient);
            dishIngredientRepository.save(di);
        }

        // 3. Reload dish so dishIngredients is populated
        Dish reloaded = dishRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Dish not found after save"));

        return new DishDTO(reloaded);
    }

    public void deleteDish(Integer id) {
        dishRepository.deleteById(id);
    }

    public DishDTO updateFavorite(Integer dishId, Boolean isFavorite) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found: " + dishId));

        dish.setIsFavorite(isFavorite);
        Dish saved = dishRepository.save(dish);

        return new DishDTO(saved);
    }
}
