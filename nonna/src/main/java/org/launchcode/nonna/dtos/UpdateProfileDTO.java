package org.launchcode.nonna.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
