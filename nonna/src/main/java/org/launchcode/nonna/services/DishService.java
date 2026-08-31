package org.launchcode.nonna.services;

import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.repositories.DishRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {

    private final DishRepository dishRepository;
    public DishService(DishRepository dishRepository)
    {this.dishRepository = dishRepository;}

    public List<Dish> getAllDishes()
    {
        return dishRepository.findAll();
    }

    public Dish getByDishId(int id)
    {
        return dishRepository.findById(id).orElse(null);
    }

    public Dish saveDish(Dish dish)
    {
        return dishRepository.save(dish);
    }

    public void deleteDish(int id)
    {
        dishRepository.deleteById(id);
    }

}
