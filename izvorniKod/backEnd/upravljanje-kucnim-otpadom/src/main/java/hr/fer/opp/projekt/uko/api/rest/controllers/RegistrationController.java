package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.api.model.User;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateUserDTO;
import hr.fer.opp.projekt.uko.api.rest.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/registration")
public class RegistrationController {

    @Autowired
    private UsersService usersService;

    @PostMapping("")
    public User register(@RequestBody CreateUserDTO user) {

        return usersService.saveUser(user.getUsername(), user.getPassword(), user.getFirstName(), user.getLastName(),
                user.getCity(), user.getStreet(), user.getNumber(), user.getEmail(), user.getRole());
    }
}
