package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.dtos.UpdateFavoriteDTO;
import org.launchcode.nonna.services.DishService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dishes")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    // toggle a dish's favorite flag.
    @PutMapping("/{id}/favorite")
    public DishDTO updateFavorite(@PathVariable Integer id,
                                  @RequestBody UpdateFavoriteDTO dto) {
        return dishService.updateFavorite(id, dto.getIsFavorite());
    }

    // DELETE -- remove a dish by id. - currently unused, future feature for admin
    @DeleteMapping("/{id}")
    public void deleteDish(@PathVariable Integer id) {
        dishService.deleteDish(id);
    }
}
