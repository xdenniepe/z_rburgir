package com.mock.api.mapper;

import com.mock.api.entity.OptionsType;
import com.roboburger.core.dto.ProductOptionsDTO;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2022-09-22T10:20:49+0800",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 18.0.2.1 (Homebrew)"
)
public class ProductOptionsMapperImpl implements ProductOptionsMapper {

    @Override
    public ProductOptionsDTO entityToDTO(OptionsType entity) {
        if ( entity == null ) {
            return null;
        }

        ProductOptionsDTO productOptionsDTO = new ProductOptionsDTO();

        productOptionsDTO.setOptionsTypeId( entity.getOptionsTypeId() );
        productOptionsDTO.setName( entity.getName() );

        return productOptionsDTO;
    }
}
