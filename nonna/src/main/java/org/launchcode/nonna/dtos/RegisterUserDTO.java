package org.launchcode.nonna.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterUserDTO {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
