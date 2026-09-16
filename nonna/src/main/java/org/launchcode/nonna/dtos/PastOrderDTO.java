package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.Dish;
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

    public PastOrderDTO(PastOrder pastOrder) {

        // Basic fields
        this.id = pastOrder.getId();
        this.orderTimeStamp = pastOrder.getOrderTimeStamp();
        this.orderTotal = pastOrder.getOrderTotal();

        // Null‑safe user
        this.userId = pastOrder.getUser() != null
                ? pastOrder.getUser().getId()
                : null;

        // Null‑safe dishes
        List<Dish> dishList = pastOrder.getDishes();
        this.dishes = (dishList == null
                ? List.of()
                : dishList.stream()
                .map(DishDTO::new)
                .toList());
    }
}
