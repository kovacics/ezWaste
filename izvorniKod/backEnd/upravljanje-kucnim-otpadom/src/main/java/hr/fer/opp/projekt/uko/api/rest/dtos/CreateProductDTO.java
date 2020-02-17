package hr.fer.opp.projekt.uko.api.rest.dtos;

import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@NoArgsConstructor
public class CreateProductDTO {

    private String name;

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;
}
