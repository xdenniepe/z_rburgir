package com.roboburger.vendingmachine.repository;

import com.roboburger.vendingmachine.entity.VendingMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VendingMachineRepository  extends JpaRepository<VendingMachine, Integer> {

    public static final String DISTANCECOMP = "(SELECT *, (((acos (sin(( :lat * pi() / 180)) * sin(( [locationlatitude] * pi() / 180)) + cos(( :lat * pi() /180 )) * cos(( [locationlatitude] * pi() / 180)) * cos((( :lng - [locationlongitude]) * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344)";

    @Query(value = "SELECT TOP 1 * FROM "+DISTANCECOMP+" as distance FROM [units]) locationTable ORDER BY distance ASC", nativeQuery = true)
    Optional<VendingMachine> findNearestVM(Double lat, Double lng);

    @Query(value = "SELECT * FROM "+DISTANCECOMP+" as distance FROM [units]) locationTable WHERE distance <= 40.2336 and unitID > 0 ORDER BY distance ASC", nativeQuery = true)
    List<VendingMachine> findByBoundary(Double lat, Double lng);

    @Query(value = "SELECT * FROM "+DISTANCECOMP+" as distance FROM [units]) locationTable WHERE distance <= 999999999 and unitID > 0 ORDER BY distance ASC", nativeQuery = true)
    List<VendingMachine> findAllVms(Double lat, Double lng);

    @Query(value = "SELECT (((acos (sin(( :sourceLat * pi() / 180)) * sin(( :pointLat * pi() / 180)) + cos(( :sourceLat * pi() /180 )) * cos(( :pointLat * pi() / 180)) * cos((( :sourceLng - :pointLng ) * pi()/180)))) * 180/pi()) * 60 * 1.1515 * 1.609344)", nativeQuery = true)
    Optional<Double> getLongDistance(Double sourceLat, Double sourceLng, Double pointLat, Double pointLng);

    @Query(value = "DECLARE @source geography = 'POINT('+ CAST(:sourceLat as VARCHAR(20)) +' '+ CAST(:sourceLng AS VARCHAR(20)) +')' DECLARE @target geography = 'POINT('+ CAST(:pointLat as VARCHAR(20)) +' '+ CAST(:pointLng AS VARCHAR(20)) +')' SELECT (@source.STDistance(@target) / 1000) * 0.62137119", nativeQuery = true)
    Optional<Double> getDistance(Double sourceLat, Double sourceLng, Double pointLat, Double pointLng);

    @Query(value = "SELECT * FROM [units] WHERE [unitID]= :vendingMachineId", nativeQuery = true)
    Optional<VendingMachine> findByVendingMachineId(Integer vendingMachineId);
}
