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
    private List<Integer> dishIds;

    public PastOrderDTO(PastOrder pastOrder) {
        this.id = pastOrder.getId();
        this.orderTimeStamp = pastOrder.getOrderTimeStamp();
        this.orderTotal = pastOrder.getOrderTotal();
        this.userId = pastOrder.getUser().getId();
        this.dishIds = pastOrder.getDishes().stream()
                .map(d -> d.getId())
                .toList();
    }
}
