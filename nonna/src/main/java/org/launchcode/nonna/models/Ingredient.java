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
    private int id;

    private String ingredientName;
    private double ingredientCost;

//    @OneToMany(mappedBy = "ingredient")
//    @JsonIgnore
//    private List<DishIngredient> dishIngredients;

    //    @OneToMany(mappedBy = "ingredient")
//    @JsonIgnore
//    private List<Tag> tags;


}
