package com.roboburger.inventory.repository;

import com.roboburger.inventory.entity.Condiment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CondimentRepository extends JpaRepository<Condiment, Integer> {
}
