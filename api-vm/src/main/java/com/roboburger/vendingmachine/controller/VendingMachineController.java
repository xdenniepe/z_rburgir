package com.roboburger.vendingmachine.controller;

import com.roboburger.core.dto.VendingMachineDTO;
import com.roboburger.vendingmachine.entity.VendingMachine;
import com.roboburger.vendingmachine.service.VendingMachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RepositoryRestController
public class VendingMachineController {

    @Autowired
    VendingMachineService vmService;

    @GetMapping("/api/vendingMachine/findByBoundary")
    @Transactional
    public ResponseEntity<List<VendingMachineDTO>> getVmByBoundary(@RequestParam("lat") Double lat,
                                                                @RequestParam("lng") Double lng) {
       return vmService.findVmByBoundary(lat, lng);
    }

    @GetMapping("/api/vendingMachine/nearest")
    @Transactional
    public ResponseEntity<VendingMachineDTO> getNearestVm(@RequestParam("lat") Double lat,
                                                          @RequestParam("lng") Double lng) {
        return vmService.findNearestVm(lat, lng);
    }

    @GetMapping("/api/vendingMachine/findByUnitId")
    @Transactional
    public VendingMachineDTO findByUnitId(@RequestParam("vmId") Integer vmId) {
        return vmService.findByUnitId(vmId);
    }
}
