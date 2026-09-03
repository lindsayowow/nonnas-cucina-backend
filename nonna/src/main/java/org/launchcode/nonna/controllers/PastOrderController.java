package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.PastOrderDTO;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.services.PastOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pastorders")
public class PastOrderController {

    private final PastOrderService pastOrderService;

    public PastOrderController(PastOrderService pastOrderService) {
        this.pastOrderService = pastOrderService;
    }

    @GetMapping
    public List<PastOrderDTO> getAllPastOrders() {
        return pastOrderService.getAllPastOrderDTOs();
    }

    @GetMapping("/{id}")
    public PastOrderDTO getByPastOrderDTOId(@PathVariable int id) {
        return pastOrderService.getByPastOrderDTOId(id);
    }

    @PostMapping
    public PastOrder createPastOrder(@RequestBody PastOrder pastOrder) {
        return pastOrderService.savePastOrder(pastOrder);
    }

    @PutMapping("/{id}")
    public PastOrder updatePastOrder(@PathVariable Integer id, @RequestBody PastOrder pastOrder) {
        return pastOrderService.updatePastOrder(id, pastOrder);
    }

    @DeleteMapping("/{id}")
    public void deletePastOrder(@PathVariable int id) {
        pastOrderService.deletePastOrder(id);
    }

}
