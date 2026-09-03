package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.PastOrder;
import java.sql.Timestamp;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PastOrderDTO {

    private int id;
    private Timestamp orderTimeStamp;
    private double orderTotal;

    public PastOrderDTO(PastOrder pastorder) {
        this.id = pastorder.getId();
        this.orderTimeStamp = pastorder.getOrderTimeStamp();
        this.orderTotal = pastorder.getOrderTotal();
    }
}
