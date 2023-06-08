package com.roboburger.auth.repository;

import java.util.Optional;

import com.roboburger.auth.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [email] = :email AND [phone_number] = :phoneNumber AND [status] = 'INA' AND [email_status] = 'INA' AND [phone_number_status] = 'INA' ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActiveEmailandPhone(String email, String phoneNumber);

    @Query(value = "SELECT a FROM User a WHERE a.email = :email AND a.emailStatus = 'ACT' AND (a.status = 'ACT' OR a.status = 'EXT')")
    Optional<User> findActiveEmail(String email);

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [email] = :email AND [status] = 'INA' AND [email_status] = 'INA' ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActiveEmail(String email);
    
    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [email] = :email AND [status] = 'ACT' AND [email_status] = 'INA' ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActiveEmailOnActiveUser(String email);

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [email] = :email AND [email_status] = 'INA' AND [user_id] != :userId ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActiveDuplicateEmail(String email, Integer userId);

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [phone_number] = :phoneNumber AND [status] = 'INA' AND [phone_number_status] = 'INA' ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActivePhone(String phoneNumber);

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [phone_number] = :phoneNumber AND [status] = 'ACT' AND [phone_number_status] = 'INA' ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActivePhoneOnActiveUser(String phoneNumber);

    @Query(value = "SELECT a FROM User a WHERE a.phoneNumber = :phoneNumber AND a.phoneNumberStatus = 'ACT' AND (a.status = 'ACT' OR a.status = 'EXT')")
    Optional<User> findActivePhoneNumber(String phoneNumber);

    @Query(value = "SELECT TOP 1 * FROM [user] WHERE [phone_number] = :phoneNumber AND [phone_number_status] = 'INA' AND [user_id] != :userId ORDER BY [user_id] DESC", nativeQuery = true)
    Optional<User> findInActiveDuplicatePhoneNumber(String phoneNumber, Integer userId);

    Optional<User> findByUserId(Integer userId);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = "SELECT COUNT(*) FROM [user]", nativeQuery = true)
    long count();
}
