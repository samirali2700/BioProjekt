package com.example.bioprojekt.Repository;
import com.example.bioprojekt.Model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening,Integer> {
}
