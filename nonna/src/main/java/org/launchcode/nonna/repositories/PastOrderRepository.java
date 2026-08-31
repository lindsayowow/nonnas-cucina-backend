package org.launchcode.nonna.repositories;

import org.launchcode.nonna.models.PastOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PastOrderRepository extends JpaRepository<PastOrder, Integer> {
}
