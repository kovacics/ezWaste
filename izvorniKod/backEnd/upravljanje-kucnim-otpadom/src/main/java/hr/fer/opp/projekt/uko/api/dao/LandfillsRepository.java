package hr.fer.opp.projekt.uko.api.dao;

import hr.fer.opp.projekt.uko.api.model.Landfill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LandfillsRepository extends JpaRepository<Landfill, Integer> {
}
