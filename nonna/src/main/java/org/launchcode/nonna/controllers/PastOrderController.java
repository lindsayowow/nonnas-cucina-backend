package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.CreateOrderDTO;
import org.launchcode.nonna.dtos.PastOrderDTO;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.services.PastOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pastorders")
public class PastOrderController {

    private final PastOrderService pastOrderService;

    public PastOrderController(PastOrderService pastOrderService) {
        this.pastOrderService = pastOrderService;
    }

    // CREATE ORDER
    @PostMapping
    public ResponseEntity<PastOrderDTO> createOrder(@RequestBody CreateOrderDTO dto) {
        PastOrder order = pastOrderService.createOrder(dto);
        return ResponseEntity.ok(new PastOrderDTO(order));
    }

    // GET ALL ORDERS
    @GetMapping
    public List<PastOrderDTO> getAllPastOrders() {
        return pastOrderService.getAllPastOrderDTOs();
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public PastOrderDTO getByPastOrderDTOId(@PathVariable int id) {
        return pastOrderService.getByPastOrderDTOId(id);
    }

    // GET ORDERS BY USER
    @GetMapping("/user/{userId}")
    public List<PastOrderDTO> getOrdersByUser(@PathVariable Integer userId) {
        return pastOrderService.getOrdersByUserId(userId);
    }

    // UPDATE ORDER
    @PutMapping("/{id}")
    public PastOrder updatePastOrder(@PathVariable Integer id, @RequestBody PastOrder pastOrder) {
        return pastOrderService.updatePastOrder(id, pastOrder);
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public void deletePastOrder(@PathVariable int id) {
        pastOrderService.deletePastOrder(id);
    }
}
