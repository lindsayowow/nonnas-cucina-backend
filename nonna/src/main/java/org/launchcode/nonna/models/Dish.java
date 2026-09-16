package org.launchcode.nonna.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

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

    @OneToMany(
            mappedBy = "dish",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<DishIngredient> dishIngredients = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "past_order_id", nullable = false)
    @JsonIgnore
    private PastOrder pastOrder;
}
