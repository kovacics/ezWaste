package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.exception.ForbiddenException;
import hr.fer.opp.projekt.uko.exception.NotFoundException;
import hr.fer.opp.projekt.uko.api.model.Landfill;
import hr.fer.opp.projekt.uko.api.model.Location;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateLandfillDTO;
import hr.fer.opp.projekt.uko.api.rest.services.LandfillsService;
import hr.fer.opp.projekt.uko.util.AuthorizationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/landfills")
public class LandfillsController {

    @Autowired
    private LandfillsService landfillsService;

    @Autowired
    private AuthorizationUtil authorizationUtil;

    @GetMapping("")
    public List<Landfill> getAllLandfills() {
        return landfillsService.getLandfills();
    }

    @GetMapping("/{id}")
    public Landfill getLandfill(@PathVariable int id) {
        return landfillsService.getLandfill(id).orElseThrow(() -> new NotFoundException("Landfill not found"));
    }

    @PostMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public ResponseEntity<Landfill> createLandfill(@RequestBody CreateLandfillDTO landfillDTO) {
        Landfill landfill = landfillsService.createLandfill(landfillDTO.getCity(), landfillDTO.getStreet(),
                landfillDTO.getNumber(), landfillDTO.getWorkingHoursStart(), landfillDTO.getWorkingHoursEnd(),
                landfillDTO.getWasteTypes());

        return new ResponseEntity<>(landfill, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public Landfill updateLandfill(@RequestBody Landfill landfill, @PathVariable int id) {
        Location address = landfill.getAddress();
        return landfillsService.updateLandfill(id, address.getCity(), address.getStreet(), address.getNumber(),
                landfill.getWorkingHoursStart(), landfill.getWorkingHoursEnd(), landfill.getWasteTypes());
    }

    @DeleteMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public void deleteLandfill(@PathVariable int id) {
        landfillsService.deleteLandfill(id);
    }

    @GetMapping("/nearby")
    public List<Landfill> getAllNearbyLandfills(@RequestParam String city, @RequestParam String street, @RequestParam int number) {
        try {
            return landfillsService.getNearbyLandfills(city, street, number);
        } catch (Exception e) {
            throw new BadRequestException("Address doesn't exist");
        }
    }

    @GetMapping("/nearby/user/{userID}")
    public ResponseEntity<Object> getAllNearbyLandfills(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            try {
                return ResponseEntity.ok().body(landfillsService.getUsersNearbyLandfills(userID));
            } catch (Exception e) {
                return ResponseEntity.ok().body(landfillsService.getLandfills());
            }
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/geolocation/{id}")
    public ResponseEntity<Object> getGeoLocation(@PathVariable int id) {
        Landfill landfill = landfillsService.getLandfill(id)
                .orElseThrow(() -> new NotFoundException("Landfill not found"));

        return ResponseEntity.ok().body(landfillsService.getLatLon(landfill));
    }
}
