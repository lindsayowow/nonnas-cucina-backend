package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.CreateDishDTO;
import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.dtos.UpdateFavoriteDTO;
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
    public DishDTO getByDishDTOId(@PathVariable Integer id) {
        return dishService.getByDishDTOId(id);
    }

    @PostMapping
    public DishDTO createDish(@RequestBody CreateDishDTO dto) {
        return dishService.createDish(dto);
    }

    @PutMapping("/{id}/favorite")
    public DishDTO updateFavorite(@PathVariable Integer id,
                                  @RequestBody UpdateFavoriteDTO dto) {
        return dishService.updateFavorite(id, dto.getIsFavorite());
    }

    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable Integer id) {
        dishService.deleteDish(id);
    }
}
