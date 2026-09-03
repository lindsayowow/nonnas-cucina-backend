package org.launchcode.nonna.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import org.launchcode.nonna.models.Dish;

@Getter
@NoArgsConstructor (access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DishDTO {

    private int id;
    private String dishName;
    private double dishCost;
    private boolean isFavorite;

    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishName = dish.getDishName();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.isFavorite();
    }

}
