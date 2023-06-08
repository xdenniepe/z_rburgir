package com.roboburger.inventory.mapper;

import com.roboburger.core.dto.CondimentDTO;
import com.roboburger.inventory.entity.Condiment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CondimentMapper {
    CondimentMapper INSTANCE = Mappers.getMapper(CondimentMapper.class);

    CondimentDTO entityToDTO(Condiment entity);

}
