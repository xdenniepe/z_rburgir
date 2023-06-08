package com.roboburger.vendingmachine.mapper;

import com.roboburger.core.dto.VendingMachineDTO;
import com.roboburger.vendingmachine.entity.VendingMachine;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-03-27T18:20:28+0800",
    comments = "version: 1.5.3.Final, compiler: Eclipse JDT (IDE) 3.33.0.v20230218-1114, environment: Java 17.0.6 (Eclipse Adoptium)"
)
public class VendingMachineMapperImpl implements VendingMachineMapper {

    @Override
    public VendingMachineDTO entityToDTO(VendingMachine entity) {
        if ( entity == null ) {
            return null;
        }

        VendingMachineDTO vendingMachineDTO = new VendingMachineDTO();

        vendingMachineDTO.setAddress( entity.getAddress() );
        vendingMachineDTO.setCity( entity.getCity() );
        vendingMachineDTO.setCountry( entity.getCountry() );
        vendingMachineDTO.setId( entity.getId() );
        vendingMachineDTO.setLatitude( entity.getLatitude() );
        vendingMachineDTO.setLocation( entity.getLocation() );
        vendingMachineDTO.setLongitude( entity.getLongitude() );
        vendingMachineDTO.setOpeningHours( entity.getOpeningHours() );
        vendingMachineDTO.setPostalCode( entity.getPostalCode() );
        vendingMachineDTO.setPrice( entity.getPrice() );
        vendingMachineDTO.setState( entity.getState() );
        vendingMachineDTO.setVendingMachineId( entity.getVendingMachineId() );

        return vendingMachineDTO;
    }
}
