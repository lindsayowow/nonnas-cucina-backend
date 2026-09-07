package org.launchcode.nonna.dtos;

import java.util.List;

public class CreateOrderDTO {

    private Integer userId;
    private List<Integer> dishIds;

    public Integer getUserId() {
        return userId;
    }

    public List<Integer> getDishIds() {
        return dishIds;
    }
}
