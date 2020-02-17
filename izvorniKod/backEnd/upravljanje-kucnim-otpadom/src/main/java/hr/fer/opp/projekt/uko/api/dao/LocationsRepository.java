package hr.fer.opp.projekt.uko.api.dao;

import hr.fer.opp.projekt.uko.api.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationsRepository extends JpaRepository<Location, Integer> {
    Location findByCityAndStreetAndNumber(String city, String street, Integer number);
}