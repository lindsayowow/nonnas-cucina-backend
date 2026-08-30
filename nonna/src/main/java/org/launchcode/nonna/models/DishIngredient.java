package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dish_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    //@ManyToOne
//    @JoinColumn(name = "dish_id")
//    private Dish dish;

}
