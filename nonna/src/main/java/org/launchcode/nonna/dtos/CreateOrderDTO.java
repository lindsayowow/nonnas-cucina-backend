package org.launchcode.nonna.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderDTO {

    private Integer userId;
    private List<CreateDishDTO> dishes;

}
