package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.model.enums.FormType;
import hr.fer.opp.projekt.uko.api.model.enums.ResourceType;
import hr.fer.opp.projekt.uko.api.dao.FormsRepository;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.api.model.Form;
import hr.fer.opp.projekt.uko.api.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class FormsService {

    @Autowired
    FormsRepository formsRepository;

    @Autowired
    private UsersService usersService;


    public List<Form> getForms() {
        return formsRepository.findAll();
    }

    public Optional<Form> getForm(int id) {
        return formsRepository.findById(id);
    }

    public void deleteForm(int id) {
        formsRepository.deleteById(id);
    }

    public Form createForm(int userID, String title, String description, FormType formType,
                           ResourceType resourceType, int resourceQuantity) {

        Assert.hasText(description, "Description cannot be empty");
        Assert.isTrue(description.length() < 512, "Description length must be less than 512");

        User user = usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));
        Form form = new Form(user, title, description, formType, resourceType, resourceQuantity);

        return formsRepository.save(form);
    }

    public List<Form> getResourceRequestForms() {
        return formsRepository.findAll().stream()
                .filter(f -> f.getFormType() == FormType.RESOURCE_REQUEST)
                .collect(Collectors.toList());
    }

    public List<Form> getBulkyWasteRequestForms() {
        return formsRepository.findAll().stream()
                .filter(f -> f.getFormType() == FormType.BULKY_WASTE_COLLECTION)
                .collect(Collectors.toList());
    }

    public List<Form> getComplaintForms() {
        return formsRepository.findAll().stream()
                .filter(f -> f.getFormType() == FormType.COMPLAINT)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingResourceRequestForms() {
        return getResourceRequestForms().stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingComplaintForms() {
        return getComplaintForms().stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingBulkyWasteRequestForms() {
        return getBulkyWasteRequestForms().stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return formsRepository.findAllByUserID(userID);
    }

    public List<Form> getResourceRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getFormsByUserID(userID).stream()
                .filter(f -> f.getFormType() == FormType.RESOURCE_REQUEST)
                .collect(Collectors.toList());
    }

    public List<Form> getBulkyWasteRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getFormsByUserID(userID).stream()
                .filter(f -> f.getFormType() == FormType.BULKY_WASTE_COLLECTION)
                .collect(Collectors.toList());
    }

    public List<Form> getComplaintFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getFormsByUserID(userID).stream()
                .filter(f -> f.getFormType() == FormType.COMPLAINT)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingResourceRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getResourceRequestFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingBulkyWasteRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getBulkyWasteRequestFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getPendingComplaintFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getComplaintFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() == null)
                .collect(Collectors.toList());
    }

    public List<Form> getAnsweredResourceRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getResourceRequestFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() != null)
                .collect(Collectors.toList());
    }

    public List<Form> getAnsweredBulkyWasteRequestFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getBulkyWasteRequestFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() != null)
                .collect(Collectors.toList());
    }

    public List<Form> getAnsweredComplaintFormsByUserID(int userID) {
        usersService.getUser(userID).orElseThrow(() -> new BadRequestException("User not found"));

        return getComplaintFormsByUserID(userID).stream()
                .filter(f -> f.getEmployeeResponse() != null)
                .collect(Collectors.toList());
    }
}
