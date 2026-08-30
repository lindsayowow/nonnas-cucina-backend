package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "filters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filter {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String filterName;

    //    @OneToMany(mappedBy = "filter")
//    @JsonIgnore
//    private List<Tag> tags;
}
