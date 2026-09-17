package org.launchcode.nonna.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.Dish;

import java.util.List;

@Data
@NoArgsConstructor
public class DishDTO {

    private Integer id;
    private double dishCost;
    private Boolean isFavorite;
    private List<IngredientDTO> ingredients;

    // Existing constructor -- relies on Dish.dishIngredients (entity collection
    // traversal). Confirmed broken for PastOrders; left as-is here since other
    // callers (DishController/DishService) still use it and are out of scope
    // for this fix.
    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.getIsFavorite();

        this.ingredients = dish.getDishIngredients() == null
                ? List.of()
                : dish.getDishIngredients().stream()
                .map(di -> new IngredientDTO(di.getIngredient()))
                .toList();
    }

    // New constructor -- takes ingredients built explicitly from a direct
    // repository query, bypassing the broken Dish.dishIngredients collection.
    // Used by PastOrderService.
    public DishDTO(Dish dish, List<IngredientDTO> ingredients) {
        this.id = dish.getId();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.getIsFavorite();
        this.ingredients = ingredients == null ? List.of() : ingredients;
    }
}