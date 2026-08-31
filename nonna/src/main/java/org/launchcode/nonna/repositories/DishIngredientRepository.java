package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Integer> {
}
