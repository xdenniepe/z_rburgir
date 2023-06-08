package com.roboburger.order.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.roboburger.core.dto.CondimentOrderDTO;
import com.roboburger.order.entity.CondimentOrder;

@Mapper 
public interface CondimentOrderMapper {
 
    CondimentOrderMapper INSTANCE = Mappers.getMapper(CondimentOrderMapper.class);

    CondimentOrderDTO entityToDTO(CondimentOrder entity);
    CondimentOrder dtoToEntity(CondimentOrderDTO dto);
    
}
