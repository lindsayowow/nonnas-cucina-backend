package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.PastOrder;

import java.sql.Timestamp;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PastOrderDTO {

    private int id;
    private Timestamp orderTimeStamp;
    private double orderTotal;
    private Integer userId;
    private List<DishDTO> dishes;

    public PastOrderDTO(PastOrder pastOrder, List<DishDTO> dishes) {
        this.id = pastOrder.getId();
        this.orderTimeStamp = pastOrder.getOrderTimeStamp();
        this.orderTotal = pastOrder.getOrderTotal();
        this.userId = pastOrder.getUser() != null
                ? pastOrder.getUser().getId()
                : null;
        this.dishes = dishes == null ? List.of() : dishes;
    }
}