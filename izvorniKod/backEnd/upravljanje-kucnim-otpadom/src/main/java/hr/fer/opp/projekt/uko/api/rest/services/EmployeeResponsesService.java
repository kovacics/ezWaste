package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.dao.EmployeeResponsesRepository;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.api.model.EmployeeResponse;
import hr.fer.opp.projekt.uko.api.model.Form;
import hr.fer.opp.projekt.uko.api.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class EmployeeResponsesService {

    @Autowired
    EmployeeResponsesRepository employeeResponsesRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private FormsService formsService;

    public void deleteEmployeeResponse(int id) {
        employeeResponsesRepository.deleteById(id);
    }

    public EmployeeResponse createEmployeeResponse(int formID, int authorID, String response) {

        Assert.hasText(response, "Response cannot be empty");

        User author = usersService.getUser(authorID)
                .orElseThrow(() -> new BadRequestException("Response author not found"));

        Form form = formsService.getForm(formID)
                .orElseThrow(() -> new BadRequestException("Form not found"));

        return employeeResponsesRepository.save(new EmployeeResponse(form, author, response));
    }
}
