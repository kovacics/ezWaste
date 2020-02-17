package hr.fer.opp.projekt.uko.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Landfill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private Location address;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time workingHoursStart;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time workingHoursEnd;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Collection<WasteType> wasteTypes;


    public Landfill(Location address, Time workingHoursStart, Time workingHoursEnd, Collection<WasteType> wasteTypes) {
        this.workingHoursStart = workingHoursStart;
        this.workingHoursEnd = workingHoursEnd;
        this.address = address;
        this.wasteTypes = wasteTypes;
    }
}
