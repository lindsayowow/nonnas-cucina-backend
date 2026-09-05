package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.User;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserDTO {

    private int id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;

    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
//        ---------saving for use in future feature ----------
//        this.role = user.getRole();
        this.streetAddress = user.getStreetAddress();
        this.city = user.getCity();
        this.state = user.getState();
        this.zipCode = user.getZipCode();
        this.phoneNumber = user.getPhoneNumber();
    }

}
