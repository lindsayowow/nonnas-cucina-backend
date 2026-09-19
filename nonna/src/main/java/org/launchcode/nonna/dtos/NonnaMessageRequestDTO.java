package org.launchcode.nonna.dtos;

import java.util.List;

/**
 * DTO sent from the frontend to request a Gemini-generated Nonna message.
 * Contains the current Nonna state, ingredient count, and ingredient names.
 */
public class NonnaMessageRequestDTO {

    private String state;
    private int ingredientCount;
    private List<String> ingredients;

    public NonnaMessageRequestDTO() {}

    public NonnaMessageRequestDTO(String state, int ingredientCount, List<String> ingredients) {
        this.state = state;
        this.ingredientCount = ingredientCount;
        this.ingredients = ingredients;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getIngredientCount() {
        return ingredientCount;
    }

    public void setIngredientCount(int ingredientCount) {
        this.ingredientCount = ingredientCount;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
}
