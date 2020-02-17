package hr.fer.opp.projekt.uko.api.rest.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import hr.fer.opp.projekt.uko.config.SqlTimeDeserializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.ElementCollection;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import java.sql.Time;
import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
public class CreateLandfillDTO {

    private String city;
    private String street;
    private Integer number;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeDeserializer.class)
    private Time workingHoursStart;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    @JsonDeserialize(using = SqlTimeDeserializer.class)
    private Time workingHoursEnd;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Collection<WasteType> wasteTypes;
}
