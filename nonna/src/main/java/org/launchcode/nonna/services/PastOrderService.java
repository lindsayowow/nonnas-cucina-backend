package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.CreateOrderDTO;
import org.launchcode.nonna.dtos.CreateDishDTO;
import org.launchcode.nonna.dtos.DishDTO;
import org.launchcode.nonna.dtos.IngredientDTO;
import org.launchcode.nonna.dtos.PastOrderDTO;
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
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class PastOrderService {

    private final UserRepository userRepository;
    private final PastOrderRepository pastOrderRepository;
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final DishIngredientRepository dishIngredientRepository;

    public PastOrderService(UserRepository userRepository,
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

    // CREATE ORDER
    @Transactional
    public PastOrder createOrder(CreateOrderDTO dto) {

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

    // Build a DishDTO with ingredients resolved via a direct repository query,
    // bypassing the broken Dish.dishIngredients entity collection.
    private DishDTO buildDishDTO(Dish dish) {
        List<IngredientDTO> ingredients = dishIngredientRepository
                .findByDish_Id(dish.getId())
                .stream()
                .map(di -> {
                    Ingredient ing = di.getIngredient();
                    return new IngredientDTO(
                            ing.getId(),
                            ing.getIngredientName(),
                            ing.getIngredientCost(),
                            ing.getEmoji(),
                            List.of(),   // categoryIds not needed for order display
                            List.of()    // filterIds not needed for order display
                    );
                })
                .toList();

        return new DishDTO(dish, ingredients);
    }

    private PastOrderDTO buildPastOrderDTO(PastOrder order) {
        List<DishDTO> dishDTOs = order.getDishes().stream()
                .map(this::buildDishDTO)
                .toList();
        return new PastOrderDTO(order, dishDTOs);
    }

    // GET ALL ORDERS
    @Transactional(readOnly = true)
    public List<PastOrderDTO> getAllPastOrderDTOs() {
        return pastOrderRepository.findAll()
                .stream()
                .map(this::buildPastOrderDTO)
                .toList();
    }

    // GET ORDER BY ID
    @Transactional(readOnly = true)
    public PastOrderDTO getByPastOrderDTOId(int id) {
        return pastOrderRepository.findById(id)
                .map(this::buildPastOrderDTO)
                .orElse(null);
    }

    // UPDATE ORDER
    @Transactional
    public PastOrder updatePastOrder(Integer id, PastOrder updatedPastOrder) {
        PastOrder existing = pastOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Past order not found"));

        existing.setOrderTimeStamp(updatedPastOrder.getOrderTimeStamp());
        existing.setOrderTotal(updatedPastOrder.getOrderTotal());

        return pastOrderRepository.save(existing);
    }

    // DELETE ORDER
    @Transactional
    public void deletePastOrder(int id) {
        pastOrderRepository.deleteById(id);
    }

    // GET ORDERS BY USER
    @Transactional(readOnly = true)
    public List<PastOrderDTO> getOrdersByUserId(Integer userId) {
        return pastOrderRepository.findByUserId(userId)
                .stream()
                .map(this::buildPastOrderDTO)
                .toList();
    }
}