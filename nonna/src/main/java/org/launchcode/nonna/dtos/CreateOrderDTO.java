package org.launchcode.nonna.dtos;

import java.util.List;

public class CreateOrderDTO {

    private Integer userId;
    private List<Integer> dishIds;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public List<Integer> getDishIds() {
        return dishIds;
    }

    public void setDishIds(List<Integer> dishIds) {
        this.dishIds = dishIds;
    }
}
