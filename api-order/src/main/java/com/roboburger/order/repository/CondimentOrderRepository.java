package com.roboburger.order.repository;

import com.roboburger.order.entity.CondimentOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface CondimentOrderRepository extends JpaRepository<CondimentOrder, Integer> {
    
}
