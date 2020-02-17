package hr.fer.opp.projekt.uko.api.rest.dtos;

import hr.fer.opp.projekt.uko.api.model.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateUserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String city;
    private String street;
    private Integer number;
    private String email;
    private Role role;
}