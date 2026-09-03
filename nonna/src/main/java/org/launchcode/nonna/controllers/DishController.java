package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.services.DishService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dishes")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public List<DishDTO> getAllDishes() {
        return dishService.getAllDishDTOs();
    }

    @GetMapping("/{id}")
    public DishDTO getByDishDTOId(@PathVariable int id) {
        return dishService.getByDishDTOId(id);
    }

    @PostMapping
    public Dish createDish(@RequestBody Dish dish) {
        return dishService.saveDish(dish);
    }

    @PutMapping("/{id}")
    public Dish updateDish(@PathVariable Integer id, @RequestBody Dish dish) {
        return dishService.updateDish(id, dish);
    }

    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable int id) {
        dishService.deleteDish(id);
    }
}


