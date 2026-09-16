package org.launchcode.nonna.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProfileDTO {

    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    public ProfileDTO(Integer id,
                      String firstName,
                      String lastName,
                      String email,
                      String phoneNumber) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}
