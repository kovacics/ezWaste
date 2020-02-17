package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import hr.fer.opp.projekt.uko.api.dao.LandfillsRepository;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.api.model.Landfill;
import hr.fer.opp.projekt.uko.api.model.Location;
import hr.fer.opp.projekt.uko.api.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.*;

@Service
public class LandfillsService {

    @Autowired
    LandfillsRepository landfillsRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private GeoLocationService geoLocationService;

    /**
     * Nearby landfills maximal distance.
     */
    public static final int MAX_DISTANCE = 3;

    public List<Landfill> getLandfills() {
        return landfillsRepository.findAll();
    }

    public Optional<Landfill> getLandfill(int id) {
        return landfillsRepository.findById(id);
    }

    public Landfill createLandfill(String city, String street, Integer number,
                                   Time workingHoursStart, Time workingHoursEnd,
                                   Collection<WasteType> wasteTypes) {

        Location location = new Location(city, street, number);
        Landfill landfill = new Landfill(location, workingHoursStart, workingHoursEnd, wasteTypes);
        return landfillsRepository.save(landfill);
    }

    public void deleteLandfill(int id) {
        landfillsRepository.deleteById(id);
    }

    public Landfill updateLandfill(int id, String city, String street, Integer number,
                                   Time workingHoursStart, Time workingHoursEnd,
                                   Collection<WasteType> wasteTypes) {
        Landfill landfill = landfillsRepository.findById(id).orElseThrow(() -> new BadRequestException("Landfill doesn't exist."));
        Location location = new Location(city, street, number);

        landfill.setAddress(location);
        landfill.setWasteTypes(wasteTypes);
        landfill.setWorkingHoursEnd(workingHoursEnd);
        landfill.setWorkingHoursStart(workingHoursStart);

        return landfillsRepository.save(landfill);
    }

    public List<Landfill> getNearbyLandfills(String city, String street, int number) {
        Map<String, Double> geoLocation = geoLocationService.address2GeoLocation(city, street, number);
        Double lat = geoLocation.get("Latitude");
        Double lng = geoLocation.get("Longitude");

        List<Landfill> landfills = landfillsRepository.findAll();

        List<Landfill> result = new ArrayList<>();

        for (Landfill landfill : landfills) {
            Map<String, Double> landfillGeoLocation;

            if (landfill.getAddress().getNumber() == null) {
                landfillGeoLocation = geoLocationService.address2GeoLocation(landfill.getAddress().getCity(),
                        landfill.getAddress().getStreet(),
                        -1);
            } else {
                landfillGeoLocation = geoLocationService.address2GeoLocation(landfill.getAddress().getCity(),
                        landfill.getAddress().getStreet(),
                        landfill.getAddress().getNumber());
            }

            double landifillLat = landfillGeoLocation.get("Latitude");
            double landfillLng = landfillGeoLocation.get("Longitude");

            if (geoLocationService.distance(lat, lng, landifillLat, landfillLng, "K") < MAX_DISTANCE) {
                result.add(landfill);
            }
        }

        return result;
    }

    public Map<String, Double> getLatLon(Landfill landfill) {
        String city = landfill.getAddress().getCity();
        String street = landfill.getAddress().getStreet();
        int number;

        if (landfill.getAddress().getNumber() == null) {
            number = -1;
        } else {
            number = landfill.getAddress().getNumber();
        }

        return geoLocationService.address2GeoLocation(city, street, number);
    }

    public List<Landfill> getUsersNearbyLandfills(int userID) {
        User user = usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User doesn't exist"));

        return getNearbyLandfills(user.getAddress().getCity(),
                user.getAddress().getStreet(),
                user.getAddress().getNumber());
    }
}
