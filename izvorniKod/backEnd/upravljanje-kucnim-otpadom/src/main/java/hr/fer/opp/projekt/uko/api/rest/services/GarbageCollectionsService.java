package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.dao.GarbageCollectionsRepository;
import hr.fer.opp.projekt.uko.api.model.GarbageCollection;
import hr.fer.opp.projekt.uko.api.model.Location;
import hr.fer.opp.projekt.uko.api.model.User;
import hr.fer.opp.projekt.uko.api.rest.dtos.CollectionAddressDTO;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GarbageCollectionsService {

    @Autowired
    GarbageCollectionsRepository garbageCollectionsRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private LocationsService locationsService;


    public List<GarbageCollection> getCollections() {
        return garbageCollectionsRepository.findAll();
    }

    public Optional<GarbageCollection> getCollection(int id) {
        return garbageCollectionsRepository.findById(id);
    }

    public void deleteCollection(int id) {
        garbageCollectionsRepository.deleteById(id);
    }

    public GarbageCollection saveCollection(Timestamp time, List<CollectionAddressDTO> streets) {
        Assert.notNull(time, "Time must be given");
        Assert.notNull(streets, "List of streets must be given");
        Assert.isTrue(streets.size() > 0, "Collection must visit at least one location");
        Assert.noNullElements(streets.toArray(), "All addresses must be not-null");

        List<Location> locations = getLocationsFromStreets(streets);
        GarbageCollection collection = new GarbageCollection(time, locations);
        return garbageCollectionsRepository.save(collection);
    }

    public void updateCollection(int id, List<CollectionAddressDTO> streets, Timestamp time) {
        GarbageCollection collection = garbageCollectionsRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Collection doesnt exist."));

        List<Location> locations = getLocationsFromStreets(streets);

        collection.setAddresses(locations);
        collection.setTime(time);
        garbageCollectionsRepository.save(collection);
    }

    public List<GarbageCollection> getAllCollectionsByLocation(String city, String street) {

        Assert.hasText(city, "City must be given");
        Assert.hasText(street, "Street must be given");

        return garbageCollectionsRepository.findAll().stream()
                .filter(c -> {
                    var addresses = c.getAddresses();
                    for (Location address : addresses) {
                        if (city.equalsIgnoreCase(address.getCity()) && street.equalsIgnoreCase(address.getStreet())) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    public List<GarbageCollection> getAllCollectionsByUser(int userID) {
        User user = usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User doesn't exist"));
        return getAllCollectionsByLocation(user.getAddress().getCity(), user.getAddress().getStreet());
    }

    private List<Location> getLocationsFromStreets(List<CollectionAddressDTO> streets) {
        return streets.stream()
                .map(s -> {
                    Location location = locationsService.getWasteCollectionAddress(s.getCity(), s.getStreet());
                    if (location == null) {
                        location = new Location(s.getCity(), s.getStreet(), null);
                    }
                    return location;
                })
                .collect(Collectors.toList());
    }
}
