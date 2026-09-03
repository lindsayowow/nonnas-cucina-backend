package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.Ingredient;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IngredientDTO {

    private int id;
    private String ingredientName;
    private double ingredientCost;
    private String emoji;

    public IngredientDTO(Ingredient ingredient) {
        this.id = ingredient.getId();
        this.ingredientName = ingredient.getIngredientName();
        this.ingredientCost = ingredient.getIngredientCost();
        this.emoji = ingredient.getEmoji();
    }
}

