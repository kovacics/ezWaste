package hr.fer.opp.projekt.uko.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    private String city;

    private String street;

    private Integer number;

    @ManyToMany(mappedBy = "addresses")
    @JsonIgnore
    private List<GarbageCollection> collections;

    public Location(String city, String street, Integer number) {
        this.city = StringUtils.capitalize(city);
        this.street = StringUtils.capitalize(street);
        this.number = number;
    }

    @JsonIgnore
    public String getCombined() {
        return street + " " + number + "," + city;
    }
}
