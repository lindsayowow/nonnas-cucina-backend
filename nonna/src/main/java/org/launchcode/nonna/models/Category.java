package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String categoryName;

    //    @OneToMany(mappedBy = "category")
//    @JsonIgnore
//    private List<IngredientCategory> ingredientCategories;

}
