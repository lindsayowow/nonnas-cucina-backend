package org.launchcode.nonna.services;

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

    public List<PastOrder> getPastOrders() {
        return pastOrderRepository.findAll();
    }

    public PastOrder getPastOrder(int id) {
        return pastOrderRepository.findById(id).orElse(null);
    }

    public PastOrder savePastOrder(PastOrder pastOrder) {
        return pastOrderRepository.save(pastOrder);
    }

    public void deletePastOrder(int id) {
        pastOrderRepository.deleteById(id);
    }
}
