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

    @EntityGraph(attributePaths = {
            "dishes",
            "dishes.dishIngredients",
            "dishes.dishIngredients.ingredient"
    })
    @Query("SELECT p FROM PastOrder p WHERE p.user.id = :userId")
    List<PastOrder> findByUserId(@Param("userId") Integer userId);
}
