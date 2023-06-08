package com.roboburger.auth.repository;

import java.util.Optional;

import com.roboburger.auth.entity.Verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface VerificationRepository extends JpaRepository<Verification, Integer> {

    Optional<Verification> findByUserId(Integer userId);

    @Query(value = "SELECT a FROM Verification a WHERE a.userId = :userId and a.type='Forgot Password' and a.status = 'ACT'")
    Optional<Verification> findUserFPCode(Integer userId);

    // @Query("SELECT a FROM Verification a WHERE a.userId = :userId AND a.status = ':activeCode' AND a.type=':type'")
    // Optional<Verification> findUserCode(Integer userId, String activeCode, String type);

    @Query(value = "SELECT a FROM Verification a WHERE a.userId = :userId and a.type=:type and a.status = :activeCode")
    Optional<Verification> findUserCode(Integer userId, String activeCode ,String type);

    Optional<Verification> findByCode(String code); 


}
