package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.Ingredient;

public class IngredientDTO {

    private int id;
    private String ingredientName;
    private double ingredientCost;
    private String emoji;

    public IngredientDTO() {}

    public IngredientDTO(int id, String ingredientName, double ingredientCost, String emoji) {
        this.id = id;
        this.ingredientName = ingredientName;
        this.ingredientCost = ingredientCost;
        this.emoji = emoji;
    }

    public IngredientDTO(Ingredient ingredient) {
        this.id = ingredient.getId();
        this.ingredientName = ingredient.getIngredientName();
        this.ingredientCost = ingredient.getIngredientCost();
        this.emoji = ingredient.getEmoji();
    }

    public int getId() {
        return id;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public double getIngredientCost() {
        return ingredientCost;
    }

}

