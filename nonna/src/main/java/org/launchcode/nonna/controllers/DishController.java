package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.services.DishService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public DishDTO getByDishDTOId(@PathVariable Integer id) {
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

    @PutMapping("/{id}/favorite")
    public Dish updateFavorite(@PathVariable Integer id, @RequestBody Map<String, Boolean> body) {
        Boolean isFavorite = body.get("isFavorite");
        return dishService.updateFavorite(id, isFavorite);
    }

    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable Integer id) {
        dishService.deleteDish(id);
    }
}
