package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Integer> {

    // Direct query against dish_ingredients, independent of Dish.dishIngredients
    // collection traversal. Used to isolate whether the entity association
    // itself is broken, or only access-through-the-entity is broken.
    List<DishIngredient> findByDish_Id(Integer dishId);
}