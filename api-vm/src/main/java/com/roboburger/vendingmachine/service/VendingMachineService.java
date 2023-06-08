package com.roboburger.vendingmachine.service;

import com.roboburger.core.dto.VendingMachineDTO;
import com.roboburger.vendingmachine.entity.VendingMachine;
import com.roboburger.vendingmachine.mapper.VendingMachineMapper;
import com.roboburger.vendingmachine.repository.VendingMachineRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Calendar;
import java.util.stream.Collectors;

import java.time.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.core.JsonProcessingException;

@Slf4j
@Service
public class VendingMachineService {

    @Autowired
    VendingMachineRepository vmRepository;

    private final VendingMachineMapper vendingMachineMapper = VendingMachineMapper.INSTANCE;

    public String toPropperCasing (String request) {
        return request.substring(0, 1).toUpperCase() + request.substring(1).toLowerCase();
    }

    public ResponseEntity<List<VendingMachineDTO>> findVmByBoundary(Double lat, Double lng) {

        List<VendingMachine> vmList = vmRepository.findByBoundary(lat, lng);

        List<VendingMachineDTO> vmListDTO = vmList.stream().map(vendingMachineMapper::entityToDTO).collect(Collectors.toList());

        DayOfWeek day =  LocalDate.now().getDayOfWeek();

        List<VendingMachineDTO> vmListWithDistance = vmListDTO.stream().map(vm -> {
            VendingMachineDTO vmDTO = new VendingMachineDTO();
            vmDTO = vm;

            ObjectMapper objectMapper = new ObjectMapper();
            String json = vm.getOpeningHours();
            
            JsonNode jsonNode;

            try {
                jsonNode = objectMapper.readTree(json);
                String open = jsonNode.get(toPropperCasing(day.toString())).asText();
               
                vmDTO.setOpeningHours(open);
            } catch (JsonMappingException e) {
                e.printStackTrace();
                vmDTO.setOpeningHours("");

            } catch (JsonProcessingException e) {
                vmDTO.setOpeningHours("");
                e.printStackTrace();
            }

            Double distance = vmRepository.getDistance(lat, lng, vm.getLatitude(), vm.getLongitude()).orElse(0.00) * 0.621371;
            vmDTO.setDistance(distance);
            return vmDTO;
        }).collect(Collectors.toList());

        HttpStatus status;
        if (vmList.isEmpty()) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(vmListWithDistance, status);
    }

    public ResponseEntity<List<VendingMachineDTO>> findAllVm(Double lat, Double lng) {

        List<VendingMachine> vmList = vmRepository.findAllVms(lat, lng);

        List<VendingMachineDTO> vmListDTO = vmList.stream().map(vendingMachineMapper::entityToDTO).collect(Collectors.toList());

        List<VendingMachineDTO> vmListWithDistance = vmListDTO.stream().map(vm -> {
            VendingMachineDTO vmDTO = new VendingMachineDTO();
            vmDTO = vm;
            Double distance = vmRepository.getLongDistance(lat, lng, vm.getLatitude(), vm.getLongitude()).orElse(0.00) * 0.621371;
            vmDTO.setDistance(distance);
            return vmDTO;
        }).collect(Collectors.toList());

        HttpStatus status;
        if (vmList.isEmpty()) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(vmListWithDistance, status);
    }

    public ResponseEntity<VendingMachineDTO> findNearestVm(Double lat, Double lng) {

        VendingMachine nearestVm = vmRepository.findNearestVM(lat, lng).orElse(null);

        VendingMachineDTO vendingMachineDTO = VendingMachineMapper.INSTANCE.entityToDTO(nearestVm);

        HttpStatus status;
        if (nearestVm == null) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(vendingMachineDTO, status);
    }

    public VendingMachineDTO findByUnitId(Integer vmId) {
        VendingMachine vm =  vmRepository.findByVendingMachineId(vmId).orElse(null);
        VendingMachineDTO vmDto = new VendingMachineDTO();
        if (vm != null) {
            vmDto = VendingMachineMapper.INSTANCE.entityToDTO(vm);
        }
        return vmDto;
    }
}
