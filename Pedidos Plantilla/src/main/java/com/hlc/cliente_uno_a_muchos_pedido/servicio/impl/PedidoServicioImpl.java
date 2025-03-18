package com.hlc.cliente_uno_a_muchos_pedido.servicio.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hlc.cliente_uno_a_muchos_pedido.entidad.Cliente;
import com.hlc.cliente_uno_a_muchos_pedido.entidad.Pedido;
import com.hlc.cliente_uno_a_muchos_pedido.excepcion.RecursoNoEncontradoException;
import com.hlc.cliente_uno_a_muchos_pedido.repositorio.PedidoRepository;
import com.hlc.cliente_uno_a_muchos_pedido.servicio.PedidoServicio;

@Service
public class PedidoServicioImpl implements PedidoServicio {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado con ID: " + id));
    }

    @Override
    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido actualizarPedido(Long id, Pedido pedido) {
        Pedido existente = obtenerPedidoPorId(id);
        existente.setFecha(pedido.getFecha());
        existente.setFechaRecogida(pedido.getFechaRecogida());
        existente.setDescripcion(pedido.getDescripcion());
        existente.setRecogido(pedido.isRecogido());
        existente.setPreparado(pedido.isPreparado());
        existente.setCliente(pedido.getCliente());
        return pedidoRepository.save(existente);
    }

    @Override
    public void eliminarPedido(Long id) {
        Pedido pedido = obtenerPedidoPorId(id);
        pedidoRepository.delete(pedido);
    }

    @Override
    public List<Pedido> obtenerPedidosPorCliente(Cliente cliente) {
        return pedidoRepository.findByCliente(cliente);
    }
}

