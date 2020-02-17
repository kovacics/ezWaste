package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.config.CustomUserDetails;
import hr.fer.opp.projekt.uko.api.model.EmployeeResponse;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateResponseDTO;
import hr.fer.opp.projekt.uko.api.rest.services.EmployeeResponsesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employeeResponse")
public class EmployeeResponsesController {

    @Autowired
    private EmployeeResponsesService employeeResponsesService;

    @PostMapping("")
    @Secured("ROLE_EMPLOYEE")
    public ResponseEntity<EmployeeResponse> createResponse(@RequestBody CreateResponseDTO createResponseDTO,
                                                           Authentication authentication) {
        int authorID = ((CustomUserDetails) authentication.getPrincipal()).getID();

        EmployeeResponse response = employeeResponsesService.createEmployeeResponse(
                createResponseDTO.getFormID(), authorID, createResponseDTO.getResponse());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    public void deleteEmployeeResponse(@PathVariable int id) {
        employeeResponsesService.deleteEmployeeResponse(id);
    }
}
