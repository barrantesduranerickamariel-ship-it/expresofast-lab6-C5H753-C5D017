package com.c5d017.lab5.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.c5d017.lab5.domain.Conductor;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Integer> {
}