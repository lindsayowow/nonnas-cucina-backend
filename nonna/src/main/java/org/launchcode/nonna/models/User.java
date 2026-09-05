package org.launchcode.nonna.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String username;
    private String passwordHash;
    private String email;
    private String firstName;
    private String lastName;
//    private String role;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<PastOrder> pastOrders = new ArrayList<>();


}
