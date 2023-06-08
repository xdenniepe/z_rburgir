package com.roboburger.order.service;

import com.roboburger.order.apiservice.ProductApiService;
import com.roboburger.order.entity.CondimentOrder;
import com.roboburger.order.mapper.CondimentOrderMapper;
import com.roboburger.core.dto.CondimentOrderDTO;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CondimentOrderService {

    @Autowired
    private ProductApiService productApiService;

    private static final CondimentOrderMapper condimentOrderMapper = CondimentOrderMapper.INSTANCE;

    public List<CondimentOrderDTO> condimentEntityToDto(List<CondimentOrder> entities) {
        List<CondimentOrderDTO> condimentOrderList = entities.stream().map(condimentOrderMapper::entityToDTO).collect(Collectors.toList());

        condimentOrderList = condimentOrderList.stream().map(con -> {
            CondimentOrderDTO condimentOrderDTO;
            condimentOrderDTO = con;
            condimentOrderDTO.setName(productApiService.getCondimentsById(con.getOptionsTypeId()).getName());
            
            return condimentOrderDTO;
        }).collect(Collectors.toList());
        
        return condimentOrderList;
    }

}
