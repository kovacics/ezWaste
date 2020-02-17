package hr.fer.opp.projekt.uko.api.dao;

import hr.fer.opp.projekt.uko.api.model.GarbageCollection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GarbageCollectionsRepository extends JpaRepository<GarbageCollection, Integer> {

}
