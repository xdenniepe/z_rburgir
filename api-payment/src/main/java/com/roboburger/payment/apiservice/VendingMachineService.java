package com.roboburger.payment.apiservice;

import com.roboburger.core.dto.VendingMachineDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class VendingMachineService {

    @Autowired
    @Qualifier("vendingMachine")
    private WebClient vmClient;

    public VendingMachineDTO findByUnitId(Integer vmId) {
        return vmClient.get().uri(uriBuilder -> uriBuilder.path("/api/vendingMachine/findByUnitId")
                .queryParam("vmId", vmId).build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<VendingMachineDTO>() {})
                .block();

    }
}
