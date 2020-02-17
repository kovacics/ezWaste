package hr.fer.opp.projekt.uko.api.model;

import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    private String name;

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;

    public Product(String name, WasteType wasteType) {
        this.name = StringUtils.capitalize(name);
        this.wasteType = wasteType;
    }
}
