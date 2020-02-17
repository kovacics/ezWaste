package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.exception.ForbiddenException;
import hr.fer.opp.projekt.uko.exception.NotFoundException;
import hr.fer.opp.projekt.uko.api.model.GarbageCollection;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateGarbageCollectionDTO;
import hr.fer.opp.projekt.uko.api.rest.services.GarbageCollectionsService;
import hr.fer.opp.projekt.uko.util.AuthorizationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections")
public class GarbageCollectionsController {

    @Autowired
    private GarbageCollectionsService collectionsService;

    @Autowired
    private AuthorizationUtil authorizationUtil;

    @GetMapping("")
    public List<GarbageCollection> getAllCollections() {
        return collectionsService.getCollections();
    }

    @GetMapping("/{id}")
    public GarbageCollection getCollection(@PathVariable int id) {
        return collectionsService.getCollection(id).orElseThrow(() -> new NotFoundException("Collection not found"));
    }

    @PostMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public ResponseEntity<GarbageCollection> createCollection(@RequestBody CreateGarbageCollectionDTO collection) {
        GarbageCollection col = collectionsService.saveCollection(collection.getTime(), collection.getAdresses());
        return new ResponseEntity<>(col, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public void updateCollection(@RequestBody CreateGarbageCollectionDTO collection, @PathVariable int id) {
        collectionsService.updateCollection(id, collection.getAdresses(), collection.getTime());
    }

    @DeleteMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public void deleteCollection(@PathVariable int id) {
        collectionsService.deleteCollection(id);
    }

    @GetMapping("/user/{userID}")
    public List<GarbageCollection> getAllCollectionsForUser(@PathVariable int userID) {
        if (!authorizationUtil.currentUserRole("ROLE_ADMIN") && authorizationUtil.currentUser(userID)
                || authorizationUtil.currentUserRole("ROLE_ADMIN")) {
            return collectionsService.getAllCollectionsByUser(userID);
        }

        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/location")
    public List<GarbageCollection> getAllCollectionsForLocation(@RequestParam String city, @RequestParam String street) {
        return collectionsService.getAllCollectionsByLocation(city, street);
    }
}
