package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.dao.UsersRepository;
import hr.fer.opp.projekt.uko.api.model.Location;
import hr.fer.opp.projekt.uko.api.model.User;
import hr.fer.opp.projekt.uko.api.model.enums.Role;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    public List<User> getUsers() {
        return usersRepository.findAll();
    }

    public Optional<User> getUser(int id) {
        return usersRepository.findById(id);
    }

    public void deleteUser(int id) {
        usersRepository.deleteById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public User saveUser(String username, String password, String firstName, String lastName,
                         String city, String street, Integer number, String email, Role role) {
        Assert.hasText(username, "Username must be given");
        Assert.hasText(password, "Password must be given");
        Assert.isTrue(password.length() >= 8, "Password length must be at least 8");
        Assert.notNull(role, "Role must be given");

        if (usersRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException("Username already used.");
        }
        if (email != null && usersRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("Email already used.");
        }

        Location address = null;
        if (city != null && street != null) {
            address = new Location(city, street, number);
        }
        User user = new User(username, password, firstName,
                lastName, address, email, role);
        usersRepository.save(user);
        return user;
    }
}