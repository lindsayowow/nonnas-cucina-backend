package org.launchcode.nonna.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/* Response DTO returned to the frontend containing Nonna's message.*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NonnaMessageResponseDTO {

    private String message;
}