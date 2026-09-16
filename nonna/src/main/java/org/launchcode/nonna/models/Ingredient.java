package org.launchcode.nonna.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"dishIngredients", "ingredientFilters", "ingredientCategories"})
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String ingredientName;
    private double ingredientCost;
    private String emoji;

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnore
    private List<DishIngredient> dishIngredients;

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnore
    private List<IngredientFilter> ingredientFilters;

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnore
    private List<IngredientCategory> ingredientCategories;
}
