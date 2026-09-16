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

    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.getIsFavorite();

        this.ingredients = dish.getDishIngredients().stream()
                .map(di -> new IngredientDTO(di.getIngredient()))
                .toList();
    }
}