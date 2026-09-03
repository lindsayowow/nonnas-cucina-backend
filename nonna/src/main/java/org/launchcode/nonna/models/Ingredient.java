package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String ingredientName;
    private double ingredientCost;
    private String emoji;

//    @OneToMany(mappedBy = "ingredient")
//    @JsonIgnore
//    private List<DishIngredient> dishIngredients;

    //    @OneToMany(mappedBy = "ingredient")
//    @JsonIgnore
//    private List<IngredientFilter> ingredientFilters;

    //    @OneToMany(mappedBy = "ingredient")
//    @JsonIgnore
//    private List<IngredientCategory> ingredientCategories;


}
