package org.launchcode.nonna.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import org.launchcode.nonna.models.Dish;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DishDTO {

    private Integer id;
    private String dishName;
    private double dishCost;
    private Boolean isFavorite;
    private List<Integer> ingredientIds;

    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishName = dish.getDishName();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.getIsFavorite();
        this.ingredientIds = dish.getDishIngredients().stream()
                .map(di -> di.getIngredient().getId())
                .toList();
    }
}
