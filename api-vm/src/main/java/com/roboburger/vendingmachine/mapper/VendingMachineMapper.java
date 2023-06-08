package com.roboburger.vendingmachine.mapper;

import com.roboburger.core.dto.VendingMachineDTO;
import com.roboburger.vendingmachine.entity.VendingMachine;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface VendingMachineMapper {

    VendingMachineMapper INSTANCE = Mappers.getMapper((VendingMachineMapper.class));

    VendingMachineDTO entityToDTO(VendingMachine entity);

}
