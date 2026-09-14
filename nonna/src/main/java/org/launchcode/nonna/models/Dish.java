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
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private double dishCost;
    private Boolean isFavorite = false;

    // Cascade and orphan ensure full line is deleted when a dish is deleted, including the join table entries
    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DishIngredient> dishIngredients = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "order_id")
    private PastOrder pastOrder;
}
