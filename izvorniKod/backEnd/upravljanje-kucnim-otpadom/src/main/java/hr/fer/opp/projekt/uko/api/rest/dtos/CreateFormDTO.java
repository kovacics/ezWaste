package hr.fer.opp.projekt.uko.api.rest.dtos;

import hr.fer.opp.projekt.uko.api.model.enums.FormType;
import hr.fer.opp.projekt.uko.api.model.enums.ResourceType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@NoArgsConstructor
public class CreateFormDTO {

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private FormType formType;

    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;

    private int resourceQuantity;
}
