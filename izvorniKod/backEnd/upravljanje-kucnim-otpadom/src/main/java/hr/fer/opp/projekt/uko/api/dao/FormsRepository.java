package hr.fer.opp.projekt.uko.api.dao;

import hr.fer.opp.projekt.uko.api.model.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormsRepository extends JpaRepository<Form, Integer> {
    List<Form> findAllByUserID(int userID);
}
