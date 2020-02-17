package hr.fer.opp.projekt.uko.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class EmployeeResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ID;

    @OneToOne
    @JoinColumn
    @JsonIgnore
    private Form form;

    @ManyToOne
    @JoinColumn
    private User author;

    @Column(length = 512)
    private String content;

    public EmployeeResponse(Form form, User author, String content) {
        this.form = form;
        this.author = author;
        this.content = content;
    }
}
