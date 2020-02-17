package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.exception.ForbiddenException;
import hr.fer.opp.projekt.uko.exception.NotFoundException;
import hr.fer.opp.projekt.uko.api.model.User;
import hr.fer.opp.projekt.uko.api.rest.services.UsersService;
import hr.fer.opp.projekt.uko.util.AuthorizationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private AuthorizationUtil authorizationUtil;

    @GetMapping("")
    @Secured("ROLE_ADMIN")
    public List<User> getAllUsers() {
        return usersService.getUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        if (!authorizationUtil.currentUserRole("ROLE_ADMIN") && authorizationUtil.currentUser(id)
                || authorizationUtil.currentUserRole("ROLE_ADMIN")) {
            return usersService.getUser(id).orElseThrow(() -> new NotFoundException("User not found"));
        }

        throw new ForbiddenException("Forbidden request");
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public void deleteUser(@PathVariable int id) {
        usersService.deleteUser(id);
    }
}
