package com.roboburger.auth.service;

import java.util.Optional;

import com.roboburger.auth.entity.Verification;
import com.roboburger.auth.repository.VerificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    @Autowired
    private VerificationRepository verificationRepository;

    public Verification setVerification(Verification verification) {
        return verificationRepository.save(verification);
    }

    public Optional<Verification> findByUserId(Integer userId) {
        return verificationRepository.findByUserId(userId);
    }

    public Optional<Verification> findUserFPCode(Integer userId) {
        return verificationRepository.findUserFPCode(userId);
    }

    public Optional<Verification> findByCode(String code) {
        return verificationRepository.findByCode(code);
    }

    public Optional<Verification> findByUserIdAndStatus(Integer userId, String activeCode, String type) {
        return verificationRepository.findUserCode(userId, activeCode ,type);
    }
}
