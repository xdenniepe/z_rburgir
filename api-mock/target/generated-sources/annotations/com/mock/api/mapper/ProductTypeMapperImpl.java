package com.mock.api.mapper;

import com.mock.api.entity.ProductTypes;
import com.roboburger.core.dto.ProductDTO;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2022-09-22T10:20:49+0800",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 18.0.2.1 (Homebrew)"
)
public class ProductTypeMapperImpl implements ProductTypeMapper {

    @Override
    public ProductDTO entityToDTO(ProductTypes entity) {
        if ( entity == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setProductId( entity.getProductId() );
        productDTO.setName( entity.getName() );
        productDTO.setPrice( entity.getPrice() );
        productDTO.setDescription( entity.getDescription() );

        return productDTO;
    }
}
