package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Integer> {
    List<DishIngredient> findByDish_Id(Integer dishId);
}