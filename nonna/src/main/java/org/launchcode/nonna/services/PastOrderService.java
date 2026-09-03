package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.PastOrderDTO;
import org.launchcode.nonna.models.Filter;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.repositories.PastOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PastOrderService {

    private final PastOrderRepository pastOrderRepository;
    public PastOrderService(PastOrderRepository pastOrderRepository) {
        this.pastOrderRepository = pastOrderRepository;
    }

    public List<PastOrderDTO> getAllPastOrderDTOs() {
        List<PastOrder> pastOrders = pastOrderRepository.findAll();
        return pastOrders.stream()
                .map(PastOrderDTO::new)
                .toList();
    }

    public PastOrderDTO getByPastOrderDTOId(int id) {
        return pastOrderRepository.findById(id)
                .map(PastOrderDTO::new)
                .orElse(null);
    }

    public PastOrder savePastOrder(PastOrder pastOrder) {
        return pastOrderRepository.save(pastOrder);
    }

    public PastOrder updatePastOrder(Integer id, PastOrder updatedPastOrder) {
        PastOrder existing = pastOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setOrderTimeStamp(updatedPastOrder.getOrderTimeStamp());
        existing.setOrderTotal(updatedPastOrder.getOrderTotal());

        return pastOrderRepository.save(existing);
    }

    public void deletePastOrder(int id) {
        pastOrderRepository.deleteById(id);
    }

    private PastOrderDTO convertToDTO(PastOrder pastOrder) {
        return new PastOrderDTO(pastOrder);
    }
}
