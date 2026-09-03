package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.repositories.DishRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {

    private final DishRepository dishRepository;

    public DishService(DishRepository dishRepository)
    {this.dishRepository = dishRepository;}

    public List<DishDTO> getAllDishDTOs() {
        List<Dish> dishes = dishRepository.findAll();
        return dishes.stream()
                .map(DishDTO::new)
                .toList();
    }

    public DishDTO getByDishDTOId(int id) {
        return dishRepository.findById(id)
                .map(DishDTO::new)
                .orElse(null);
    }

    public Dish saveDish(Dish dish)
    {
        return dishRepository.save(dish);
    }

    public Dish updateDish(Integer id, Dish updatedDish) {
        Dish existing = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        existing.setDishName(updatedDish.getDishName());
        existing.setDishCost(updatedDish.getDishCost());
        existing.setFavorite(updatedDish.isFavorite());

        return dishRepository.save(existing);
    }


    public void deleteDish(int id)
    {
        dishRepository.deleteById(id);
    }

    private DishDTO convertToDTO(Dish dish) {
        return new DishDTO(dish);
    }

}
