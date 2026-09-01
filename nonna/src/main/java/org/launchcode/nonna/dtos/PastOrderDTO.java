package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.PastOrder;

import java.sql.Timestamp;

public class PastOrderDTO {

    private int id;
    private Timestamp orderTimeStamp;
    private double orderTotal;

    public PastOrderDTO() {}

    public PastOrderDTO(int id, Timestamp orderTimeStamp, double orderTotal) {
        this.id = id;
        this.orderTimeStamp = orderTimeStamp;
        this.orderTotal = orderTotal;
    }

    public PastOrderDTO(PastOrder pastorder) {
        this.id = pastorder.getId();
        this.orderTimeStamp = pastorder.getOrderTimeStamp();
        this.orderTotal = pastorder.getOrderTotal();
    }

    public int getId() { return id;}

    public Timestamp getOrderTimeStamp() { return orderTimeStamp; }

    public double getOrderTotal() { return orderTotal; }

}
