package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.CreateOrderDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.repositories.DishRepository;
import org.launchcode.nonna.repositories.PastOrderRepository;
import org.launchcode.nonna.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final DishRepository dishRepository;
    private final PastOrderRepository pastOrderRepository;

    public OrderService(UserRepository userRepository,
                        DishRepository dishRepository,
                        PastOrderRepository pastOrderRepository) {
        this.userRepository = userRepository;
        this.dishRepository = dishRepository;
        this.pastOrderRepository = pastOrderRepository;
    }

    public PastOrder createOrder(CreateOrderDTO dto) {

        // 1. Load user
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Create PastOrder
        PastOrder order = new PastOrder();
        order.setUser(user);
        order.setOrderTimeStamp(new Timestamp(System.currentTimeMillis()));

        PastOrder savedOrder = pastOrderRepository.save(order);

        // 3. Attach dishes
        List<Dish> dishes = dishRepository.findAllById(dto.getDishIds());

        double total = 0;
        for (Dish dish : dishes) {
            dish.setPastOrder(savedOrder);
            savedOrder.getDishes().add(dish);
            dishRepository.save(dish);
            total += dish.getDishCost();
        }

        // 4. Save total
        savedOrder.setOrderTotal(total);
        return pastOrderRepository.save(savedOrder);
    }
}
