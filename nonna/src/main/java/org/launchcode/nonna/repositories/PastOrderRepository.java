package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.PastOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PastOrderRepository extends JpaRepository<PastOrder, Integer> {

    // Only eager-fetch the single "dishes" collection. Do NOT add
    // "dishes.dishIngredients" or deeper here -- fetching two nested
    // *-to-many collections in one query causes a Cartesian product
    // that duplicates each dish once per ingredient it has.
    // dishIngredients/ingredient lazy-load per dish inside DishDTO/
    // IngredientDTO instead, which is safe under Spring's default
    // open-session-in-view.
    @EntityGraph(attributePaths = {"dishes"})
    @Query("SELECT p FROM PastOrder p WHERE p.user.id = :userId")
    List<PastOrder> findByUserId(@Param("userId") Integer userId);
}