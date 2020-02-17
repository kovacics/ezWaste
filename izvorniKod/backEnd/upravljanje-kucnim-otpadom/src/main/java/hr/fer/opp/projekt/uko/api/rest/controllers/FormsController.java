package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.config.CustomUserDetails;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.exception.ForbiddenException;
import hr.fer.opp.projekt.uko.exception.NotFoundException;
import hr.fer.opp.projekt.uko.api.model.Form;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateFormDTO;
import hr.fer.opp.projekt.uko.api.rest.services.FormsService;
import hr.fer.opp.projekt.uko.api.rest.services.PdfGeneratorService;
import hr.fer.opp.projekt.uko.util.AuthorizationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/forms")
public class FormsController {

    @Autowired
    private FormsService formsService;

    @Autowired
    private PdfGeneratorService pdfgen;

    @Autowired
    private AuthorizationUtil authorizationUtil;


    @GetMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getAllForms() {
        return formsService.getForms();
    }

    @GetMapping("/{id}")
    public Form getForm(@PathVariable int id) {
        Form form = formsService.getForm(id).orElseThrow(() -> new NotFoundException("Form not found"));

        if (authorizationUtil.currentUserOrAdminOrEmployee(form.getUser().getID())) {
            return form;
        }
        throw new ForbiddenException("Forbidden request");
    }

    @PostMapping("")
    @Secured("ROLE_CITIZEN")
    public ResponseEntity<Form> createForm(@RequestBody CreateFormDTO formDTO, Authentication authentication) {
        int userID = ((CustomUserDetails) authentication.getPrincipal()).getID();

        Form form = formsService.createForm(userID, formDTO.getTitle(), formDTO.getDescription(),
                formDTO.getFormType(), formDTO.getResourceType(), formDTO.getResourceQuantity());

        return new ResponseEntity<>(form, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public void deleteForm(@PathVariable int id) {
        Form form = formsService.getForm(id).orElseThrow(() -> new NotFoundException("Form not found"));

        if (authorizationUtil.currentUserOrAdminOrEmployee(form.getUser().getID())) {
            formsService.deleteForm(id);
            return;
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/res-requests")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getResourceRequestForms() {
        return formsService.getResourceRequestForms();
    }

    @GetMapping("/bulky-requests")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getBulkyWasteRequestForms() {
        return formsService.getBulkyWasteRequestForms();
    }

    @GetMapping("/res-requests/{userID}")
    public List<Form> getResourceRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getResourceRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/bulky-requests/{userID}")
    public List<Form> getBulkyWasteRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getBulkyWasteRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/complaints")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getComplaintForms() {
        return formsService.getComplaintForms();
    }

    @GetMapping("/complaints/{userID}")
    public List<Form> getComplaintFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getComplaintFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/user/{userID}")
    public List<Form> getFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/res-requests/pending")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getPendingRequestForms() {
        return formsService.getPendingResourceRequestForms();
    }

    @GetMapping("/bulky-requests/pending")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getPendingBulkyWasteRequestForms() {
        return formsService.getPendingBulkyWasteRequestForms();
    }

    @GetMapping("/complaints/pending")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public List<Form> getPendingComplaintForms() {
        return formsService.getPendingComplaintForms();
    }

    @GetMapping("/res-requests/{userID}/pending")
    public List<Form> getPendingResourceRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getPendingResourceRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/bulky-requests/{userID}/pending")
    public List<Form> getPendingBulkyRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getPendingBulkyWasteRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/complaints/{userID}/pending")
    public List<Form> getPendingComplaintFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getPendingComplaintFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/res-requests/{userID}/answered")
    public List<Form> getAnsweredResourceRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getAnsweredResourceRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/bulky-requests/{userID}/answered")
    public List<Form> getAnsweredBulkyWasteRequestFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getAnsweredBulkyWasteRequestFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/complaints/{userID}/answered")
    public List<Form> getAnsweredComplaintFormsByUserID(@PathVariable int userID) {
        if (authorizationUtil.currentUserOrAdminOrEmployee(userID)) {
            return formsService.getAnsweredComplaintFormsByUserID(userID);
        }
        throw new ForbiddenException("Forbidden request");
    }

    @GetMapping("/pdf/{formID}")
    public ResponseEntity<InputStreamResource> createPdf(@PathVariable int formID) {
        Form form = formsService.getForm(formID)
                .orElseThrow(() -> new BadRequestException("Cannot create pdf, because form doesn't exist"));

        if (authorizationUtil.currentUser(form.getUser().getID())) {
            ByteArrayInputStream bis = pdfgen.getPdf(formID);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(bis));
        }
        throw new ForbiddenException("Forbidden request");
    }
}
