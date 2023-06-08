package com.roboburger.inventory.mapper;

import com.roboburger.core.dto.CouponDTO;
import com.roboburger.inventory.entity.Coupon;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CouponCodeMapper {

    CouponCodeMapper INSTANCE = Mappers.getMapper(CouponCodeMapper.class);

    Coupon dtoToEntity(CouponDTO couponDTO);

    CouponDTO entityToDto(Coupon entity);
    
}
