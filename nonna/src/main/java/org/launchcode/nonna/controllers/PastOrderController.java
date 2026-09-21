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

    // CREATE ORDER -- the service now returns an already-built PastOrderDTO
    // (with ingredients safely resolved), so the controller just forwards it.
    @PostMapping
    public ResponseEntity<PastOrderDTO> createOrder(@RequestBody CreateOrderDTO dto) {
        PastOrderDTO order = pastOrderService.createOrder(dto);
        return ResponseEntity.ok(order);
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

    // UPDATE ORDER -- same as createOrder, service already returns the DTO
    @PutMapping("/{id}")
    public ResponseEntity<PastOrderDTO> updatePastOrder(@PathVariable Integer id, @RequestBody PastOrder pastOrder) {
        PastOrderDTO updated = pastOrderService.updatePastOrder(id, pastOrder);
        return ResponseEntity.ok(updated);
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public void deletePastOrder(@PathVariable int id) {
        pastOrderService.deletePastOrder(id);
    }
}