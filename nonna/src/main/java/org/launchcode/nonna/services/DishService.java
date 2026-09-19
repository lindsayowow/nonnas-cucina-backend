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

    // DELETE
    public void deleteDish(Integer id) {
        dishRepository.deleteById(id);
    }

    // UPDATE -- toggle favorite flag
    public DishDTO updateFavorite(Integer dishId, Boolean isFavorite) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Dish not found: " + dishId));

        dish.setIsFavorite(isFavorite);
        Dish saved = dishRepository.save(dish);

        return new DishDTO(saved);
    }
}