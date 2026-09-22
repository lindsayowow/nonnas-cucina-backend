package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.repositories.DishRepository;
import org.springframework.stereotype.Service;

@Service
public class DishService {

    private final DishRepository dishRepository;

    public DishService(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    // delete dish from the database by ID
    public void deleteDish(Integer id) {
        dishRepository.deleteById(id);
    }

    // UPDATE -- toggle favorite flag
    public DishDTO updateFavorite(Integer dishId, Boolean isFavorite) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found: " + dishId));

        // Apply favorite flag value
        dish.setIsFavorite(isFavorite);

        // save the updated dish
        Dish saved = dishRepository.save(dish);

        // Return updated dish as a DTO
        return new DishDTO(saved);
    }
}
