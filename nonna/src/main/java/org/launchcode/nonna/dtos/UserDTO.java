package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.User;

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

    public UserDTO(){}

    public UserDTO(int id, String username, String email, String firstName, String lastName, String role, String streetAddress, String city, String state, String zipCode, String phoneNumber) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.phoneNumber = phoneNumber;
    }

    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.role = user.getRole();
        this.streetAddress = user.getStreetAddress();
        this.city = user.getCity();
        this.state = user.getState();
        this.zipCode = user.getZipCode();
        this.phoneNumber = user.getPhoneNumber();
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

}
