package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.CreateOrderDTO;
import org.launchcode.nonna.dtos.CreateDishDTO;
import org.launchcode.nonna.models.Dish;
import org.launchcode.nonna.models.DishIngredient;
import org.launchcode.nonna.models.Ingredient;
import org.launchcode.nonna.models.PastOrder;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.repositories.DishIngredientRepository;
import org.launchcode.nonna.repositories.DishRepository;
import org.launchcode.nonna.repositories.IngredientRepository;
import org.launchcode.nonna.repositories.PastOrderRepository;
import org.launchcode.nonna.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final PastOrderRepository pastOrderRepository;
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final DishIngredientRepository dishIngredientRepository;

    public OrderService(UserRepository userRepository,
                        PastOrderRepository pastOrderRepository,
                        DishRepository dishRepository,
                        IngredientRepository ingredientRepository,
                        DishIngredientRepository dishIngredientRepository) {
        this.userRepository = userRepository;
        this.pastOrderRepository = pastOrderRepository;
        this.dishRepository = dishRepository;
        this.ingredientRepository = ingredientRepository;
        this.dishIngredientRepository = dishIngredientRepository;
    }

    public PastOrder createOrder(CreateOrderDTO dto) {

        //  Validate user
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PastOrder order = new PastOrder();
        order.setUser(user);
        order.setOrderTimeStamp(new Timestamp(System.currentTimeMillis()));

        PastOrder savedOrder = pastOrderRepository.save(order);

        double total = 0;


        for (CreateDishDTO dishDTO : dto.getDishes()) {
            Dish dish = new Dish();

            dish.setDishCost(dishDTO.getDishCost());
            dish.setPastOrder(savedOrder);

            Dish savedDish = dishRepository.save(dish);

            // Create DishIngredient rows
            for (Integer ingredientId : dishDTO.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                DishIngredient di = new DishIngredient();
                di.setDish(savedDish);
                di.setIngredient(ingredient);

                dishIngredientRepository.save(di);
            }

            savedOrder.getDishes().add(savedDish);

            total += dishDTO.getDishCost();
        }

        savedOrder.setOrderTotal(total);
        return pastOrderRepository.save(savedOrder);
    }
}
