package org.launchcode.nonna.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "filters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filter {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String filterLabel;
    private String filterKey;
    private boolean excludesAllergen;


    @OneToMany(mappedBy = "filter")
    @JsonIgnore
    private List<IngredientFilter> ingredientFilters;
}
