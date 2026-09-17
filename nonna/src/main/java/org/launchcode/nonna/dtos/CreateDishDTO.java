package org.launchcode.nonna.dtos;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
public class CreateDishDTO {

    private double dishCost;
    private List<Integer> ingredients;

}
