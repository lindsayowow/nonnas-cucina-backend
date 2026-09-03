package org.launchcode.nonna.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Entity
@Table(name = "past_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PastOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Timestamp orderTimeStamp;
    private double orderTotal;

    //@OneToMany(mappedBy = "pastOrder")
//    @JsonIgnore
//    private List<Dish> dishes = new ArrayList<>();

//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;

}
