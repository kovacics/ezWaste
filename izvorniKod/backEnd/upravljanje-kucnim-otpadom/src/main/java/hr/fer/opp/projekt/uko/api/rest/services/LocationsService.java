package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.dao.LocationsRepository;
import hr.fer.opp.projekt.uko.api.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationsService {

    @Autowired
    private LocationsRepository locationsRepository;

    public Location getWasteCollectionAddress(String city, String street){
        return locationsRepository.findByCityAndStreetAndNumber(city, street, null);
    }
}
