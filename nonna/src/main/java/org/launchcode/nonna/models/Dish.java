package org.launchcode.nonna.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private double dishCost;
    private Boolean isFavorite = false;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DishIngredient> dishIngredients = new ArrayList<>();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "past_order_id")
    private PastOrder pastOrder;
}