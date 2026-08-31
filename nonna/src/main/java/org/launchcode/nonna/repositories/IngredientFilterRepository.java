package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.IngredientFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientFilterRepository extends JpaRepository<IngredientFilter, Integer> {
}
