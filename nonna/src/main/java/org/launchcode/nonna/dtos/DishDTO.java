package org.launchcode.nonna.dtos;

import lombok.*;
import org.launchcode.nonna.models.Dish;

import java.util.List;

@Data
@NoArgsConstructor
public class DishDTO {

    private Integer id;
    private double dishCost;
    private Boolean isFavorite;
    private List<Integer> ingredientIds;

    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.getIsFavorite();
        this.ingredientIds = dish.getDishIngredients().stream()
                .map(di -> di.getIngredient().getId())
                .toList();
    }
}
