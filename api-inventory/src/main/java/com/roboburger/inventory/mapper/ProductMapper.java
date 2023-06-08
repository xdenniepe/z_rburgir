package com.roboburger.inventory.mapper;

import com.roboburger.core.dto.ProductDTO;
import com.roboburger.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    ProductDTO entityToDTO(Product entity);

}
