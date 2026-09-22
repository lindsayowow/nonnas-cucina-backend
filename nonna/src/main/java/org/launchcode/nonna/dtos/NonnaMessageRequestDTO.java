package org.launchcode.nonna.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/* Request DTO sent from the frontend to ask Nonna/Gemini for a message. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NonnaMessageRequestDTO {

    private String state;
    private int ingredientCount;
    private List<String> ingredients;
}