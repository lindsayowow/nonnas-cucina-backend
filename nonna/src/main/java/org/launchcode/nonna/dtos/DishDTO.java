package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.Dish;

public class DishDTO {

    private int id;
    private String dishName;
    private double dishCost;
    private boolean isFavorite;

    public DishDTO() {}

    public DishDTO(int id, String dishName, double dishCost, boolean isFavorite) {
        this.id = id;
        this.dishName = dishName;
        this.dishCost = dishCost;
        this.isFavorite = isFavorite;
    }

    public DishDTO(Dish dish){
        this.id = dish.getId();
        this.dishName = dish.getDishName();
        this.dishCost = dish.getDishCost();
        this.isFavorite = dish.isFavorite();
    }

    public int getId() {return id;}

    public String getDishName() {return dishName;}

    public double getDishCost() {return dishCost;}

    public boolean isFavorite() {return isFavorite;}

}
