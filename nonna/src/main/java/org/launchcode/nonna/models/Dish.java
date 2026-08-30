package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String dishName;
    private double dishCost;
    private boolean isFavorite;

    //@OneToMany(mappedBy = "dish")
//    @JsonIgnore
//    private List<DishIngredient> listIngredients = new ArrayList<>();

//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private PastOrder pastOrder;

}
