package hr.fer.opp.projekt.uko.api.rest.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateResponseDTO {
    private int formID;
    private String response;
}