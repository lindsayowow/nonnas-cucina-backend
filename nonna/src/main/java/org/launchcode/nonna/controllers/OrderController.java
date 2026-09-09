package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.CreateOrderDTO;
import org.launchcode.nonna.dtos.PastOrderDTO;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.services.OrderService;
import org.launchcode.nonna.services.PastOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;


    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<PastOrderDTO> createOrder(@RequestBody CreateOrderDTO dto) {
        PastOrder order = orderService.createOrder(dto);
        return ResponseEntity.ok(new PastOrderDTO(order));
    }

}

