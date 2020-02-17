package hr.fer.opp.projekt.uko.api.rest.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeoLocationService {

    public double distance(double lat1, double lon1, double lat2, double lon2, String unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            double theta = lon1 - lon2;
            double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 60 * 1.1515;
            if (unit.equals("K")) {
                dist = dist * 1.609344;
            } else if (unit.equals("N")) {
                dist = dist * 0.8684;
            }
            return (dist);
        }
    }

    //Returns Map with keys Latitude and Longitude for given address
    public Map<String, Double> address2GeoLocation(String city, String street, int number) {

        Map<String, Double> geoLocation = new HashMap<>();

        final String base_uri = "https://geocoder.ls.hereapi.com/6.2/geocode.json";
        final String api_key = "apiKey=TZn4eGt9EpfU_uRf5C34CpdjWqUFVlhoT7Km5rwu4DQ";
        final String address;

        if (number == -1) {
            address = "searchtext=" + street + "%20" + city + "&gen=9";
        } else {
            address = "searchtext=" + number + "%20" + street + "%20" + city + "&gen=9";
        }

        final String uri = base_uri + "?" + address + "&" + api_key;
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(uri, String.class);

        //Dohvacam Latitude i Longitude iz stringa response
        int start_of_latitide = response.indexOf("Latitude");
        int end_of_latitude = response.indexOf(",", start_of_latitide);

        int start_of_longitude = response.indexOf("Longitude");
        int end_of_longitude = response.indexOf(",", start_of_longitude);

        String Latitude = response.substring(start_of_latitide + "Latitude\":".length(), end_of_latitude - 1);
        String Longitude = response.substring(start_of_longitude + "Longitude\":".length(), end_of_longitude - 1);

        geoLocation.put("Latitude", Double.parseDouble(Latitude));
        geoLocation.put("Longitude", Double.parseDouble(Longitude));

        return geoLocation;
    }
}
