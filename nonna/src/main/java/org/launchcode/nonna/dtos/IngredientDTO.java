package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.Ingredient;

public class IngredientDTO {

    private int id;
    private String ingredientName;
    private double ingredientCost;

    public IngredientDTO() {}

    public IngredientDTO(int id, String ingredientName, double ingredientCost) {
        this.id = id;
        this.ingredientName = ingredientName;
        this.ingredientCost = ingredientCost;
    }

    public IngredientDTO(Ingredient ingredient) {
        this.id = ingredient.getId();
        this.ingredientName = ingredient.getIngredientName();
        this.ingredientCost = ingredient.getIngredientCost();
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

