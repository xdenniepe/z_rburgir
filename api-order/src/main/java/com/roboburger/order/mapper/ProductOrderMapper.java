package com.roboburger.order.mapper;

import com.roboburger.core.dto.ProductOrderDTO;
import com.roboburger.order.entity.ProductOrder;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductOrderMapper {

    ProductOrderMapper INSTANCE = Mappers.getMapper(ProductOrderMapper.class);

    ProductOrder dtoToEntity(ProductOrderDTO dto);

    ProductOrderDTO entityToDTO(ProductOrder entity);

}
