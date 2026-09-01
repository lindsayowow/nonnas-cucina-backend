package org.launchcode.nonna.dtos;

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

