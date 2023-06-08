package com.mock.api.mapper;

import com.mock.api.entity.Product;
import com.roboburger.core.dto.ProductDTO;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2022-09-22T10:20:49+0800",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 18.0.2.1 (Homebrew)"
)
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductDTO entityToDTO(Product entity) {
        if ( entity == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setProductId( entity.getProductId() );
        productDTO.setVendingMachineID( entity.getVendingMachineID() );
        productDTO.setPrice( entity.getPrice() );

        return productDTO;
    }

    @Override
    public List<ProductDTO> entityListToDTO(List<Product> entity) {
        if ( entity == null ) {
            return null;
        }

        List<ProductDTO> list = new ArrayList<ProductDTO>( entity.size() );
        for ( Product product : entity ) {
            list.add( entityToDTO( product ) );
        }

        return list;
    }

    @Override
    public List<Product> dtoListToEntity(List<ProductDTO> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Product> list = new ArrayList<Product>( dto.size() );
        for ( ProductDTO productDTO : dto ) {
            list.add( productDTOToProduct( productDTO ) );
        }

        return list;
    }

    protected Product productDTOToProduct(ProductDTO productDTO) {
        if ( productDTO == null ) {
            return null;
        }

        Product product = new Product();

        product.setProductId( productDTO.getProductId() );
        product.setVendingMachineID( productDTO.getVendingMachineID() );
        product.setPrice( productDTO.getPrice() );

        return product;
    }
}
