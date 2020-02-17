package hr.fer.opp.projekt.uko.api.model;

import hr.fer.opp.projekt.uko.api.model.enums.FormType;
import hr.fer.opp.projekt.uko.api.model.enums.ResourceType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @ManyToOne
    @JoinColumn
    private User user;

    private String title;

    @Column(length = 512)
    private String description;

    @Enumerated(EnumType.STRING)
    private FormType formType;

    @Enumerated(EnumType.STRING)
    private ResourceType resourceType;

    private int resourceQuantity;

    @OneToOne(mappedBy = "form", cascade = CascadeType.REMOVE)
    private EmployeeResponse employeeResponse;


    public Form(User user, String title, String description, FormType formType,
                ResourceType resourceType, int resourceQuantity) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.formType = formType;
        this.resourceType = resourceType;
        this.resourceQuantity = resourceQuantity;
    }
}
