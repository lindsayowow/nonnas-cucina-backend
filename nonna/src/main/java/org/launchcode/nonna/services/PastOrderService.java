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

    // Build a DishDTO with ingredients
    private DishDTO buildDishDTO(Dish dish) {
        // get all ingredients, then convert to DTO
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
                            List.of(),   // categories and filters not needed for order display
                            List.of()
                    );
                })
                .toList();

        // Constructor
        return new DishDTO(dish, ingredients);
    }

    // Builds PastOrderDTO with every dish's ingredients
    private PastOrderDTO buildPastOrderDTO(PastOrder order) {

        List<DishDTO> dishDTOs = order.getDishes().stream()
                .map(this::buildDishDTO)
                .toList();

        // Constructor
        return new PastOrderDTO(order, dishDTOs);
    }

    // CREATE ORDER - returns PastOrderDTO with ingredients
    @Transactional
    public PastOrderDTO createOrder(CreateOrderDTO dto) {

        // verify user exists
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create PastOrder
        PastOrder order = new PastOrder();
        order.setUser(user);
        order.setOrderTimeStamp(new Timestamp(System.currentTimeMillis()));

        // Save order before attaching dishes
        PastOrder savedOrder = pastOrderRepository.save(order);

        double total = 0;

        // create each dish in the order
        for (CreateDishDTO dishDTO : dto.getDishes()) {

            Dish dish = new Dish();
            dish.setDishCost(dishDTO.getDishCost());
            dish.setPastOrder(savedOrder);

            // Save dish before attaching ingredients
            Dish savedDish = dishRepository.save(dish);

            // Attach each ingredient
            for (Integer ingredientId : dishDTO.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                DishIngredient di = new DishIngredient();
                di.setDish(savedDish);
                di.setIngredient(ingredient);

                dishIngredientRepository.save(di);
            }

            // Add dish to array
            savedOrder.getDishes().add(savedDish);

            // calculate total
            total += dishDTO.getDishCost();
        }

        // Save total
        savedOrder.setOrderTotal(total);
        PastOrder finalOrder = pastOrderRepository.save(savedOrder);

        // Build DTO
        return buildPastOrderDTO(finalOrder);
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
    public PastOrderDTO updatePastOrder(Integer id, PastOrder updatedPastOrder) {
        PastOrder existing = pastOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Past order not found"));

        // Apply updates
        existing.setOrderTimeStamp(updatedPastOrder.getOrderTimeStamp());
        existing.setOrderTotal(updatedPastOrder.getOrderTotal());

        // Save updated order
        PastOrder saved = pastOrderRepository.save(existing);

        // Return fully resolved DTO
        return buildPastOrderDTO(saved);
    }

    // DELETE ORDER by id - admin future use
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
