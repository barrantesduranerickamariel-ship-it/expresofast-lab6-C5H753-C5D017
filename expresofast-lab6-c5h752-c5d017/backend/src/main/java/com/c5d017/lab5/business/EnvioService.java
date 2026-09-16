package com.c5d017.lab5.business;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c5d017.lab5.data.ConductorRepository;
import com.c5d017.lab5.data.EnvioRepository;
import com.c5d017.lab5.data.VehiculoRepository;
import com.c5d017.lab5.domain.Conductor;
import com.c5d017.lab5.domain.Envio;
import com.c5d017.lab5.domain.Vehiculo;
import com.c5d017.lab5.dto.EnvioDTO;

@Service
public class EnvioService {

    private final EnvioRepository envioRepository;
    private final VehiculoRepository vehiculoRepository;
    private final ConductorRepository conductorRepository;

    public EnvioService(EnvioRepository envioRepository,
            VehiculoRepository vehiculoRepository,
            ConductorRepository conductorRepository) {
        this.envioRepository = envioRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.conductorRepository = conductorRepository;
    }

    @Transactional(readOnly = true)
    public List<Envio> obtenerTodosConDetalles() {
        return envioRepository.findAllConDetalles();
    }

    @Transactional(readOnly = true)
    public Envio obtenerPorId(Integer id) {
        return envioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Envío no encontrado con ID: " + id));
    }

    @Transactional
    public Envio crearEnvio(EnvioDTO dto) {
        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculoId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Vehículo no encontrado con ID: " + dto.getVehiculoId()));

        Conductor conductor = conductorRepository.findById(dto.getConductorId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Conductor no encontrado con ID: " + dto.getConductorId()));

        if (dto.getPesoKg() != null && vehiculo.getCapacidadKg() != null) {
            if (dto.getPesoKg().compareTo(vehiculo.getCapacidadKg()) > 0) {
                throw new IllegalArgumentException("El peso del envío (" + dto.getPesoKg()
                        + " kg) excede la capacidad máxima del vehículo (" + vehiculo.getCapacidadKg() + " kg)");
            }
        }

        Envio envio = new Envio();
        envio.setCodigoRastreo(dto.getCodigoRastreo());
        envio.setDireccionDestino(dto.getDireccionDestino());
        envio.setPesoKg(dto.getPesoKg());
        envio.setCosto(dto.getCosto());
        envio.setEstadoEnvio(dto.getEstadoEnvio() != null ? dto.getEstadoEnvio() : "PENDIENTE");
        envio.setVehiculo(vehiculo);
        envio.setConductor(conductor);

        return envioRepository.save(envio);
    }

    @Transactional
    public Envio actualizarEstado(Integer id, String nuevoEstado) {
        Envio envio = obtenerPorId(id);
        envio.setEstadoEnvio(nuevoEstado);
        return envioRepository.save(envio);
    }

    @Transactional
    public int actualizarEstadoPorVehiculo(Integer vehiculoId, String nuevoEstado) {
        if (!vehiculoRepository.existsById(vehiculoId)) {
            throw new IllegalArgumentException("Vehículo no encontrado con ID: " + vehiculoId);
        }
        return envioRepository.actualizarEstadoPorVehiculoId(nuevoEstado, vehiculoId);
    }
}