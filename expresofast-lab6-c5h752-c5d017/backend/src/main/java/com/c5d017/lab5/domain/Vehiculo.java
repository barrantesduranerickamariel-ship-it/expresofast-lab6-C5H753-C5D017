package com.c5d017.lab5.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehiculo")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String placa;

    @Column(name = "capacidad_kg", precision = 10, scale = 2)
    private BigDecimal capacidadKg;

    private String estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id")
    private EmpresaLogistica empresa;

    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL)
    private List<Envio> envios = new ArrayList<>();

    public Vehiculo() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }

    public BigDecimal getCapacidadKg() { return capacidadKg; }
    public void setCapacidadKg(BigDecimal capacidadKg) { this.capacidadKg = capacidadKg; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public EmpresaLogistica getEmpresa() { return empresa; }
    public void setEmpresa(EmpresaLogistica empresa) { this.empresa = empresa; }

    public List<Envio> getEnvios() { return envios; }
    public void setEnvios(List<Envio> envios) { this.envios = envios; }
}
