package com.gestioneventos.controller.api;

import com.gestioneventos.model.Cliente;
import com.gestioneventos.model.enumeration.Rol;
import com.gestioneventos.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Cliente cliente) {
        try {
            // Establecer el rol por defecto como CLIENTE
            cliente.setRol(Rol.CLIENTE);
            
            // Validar que la contraseña no sea nula
            if (cliente.getPassword() == null || cliente.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La contraseña es obligatoria");
                return ResponseEntity.badRequest().body(error);
            }

            // Cifrar la contraseña
            cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
            
            // Crear el cliente
            Cliente clienteCreado = clienteService.crearCliente(cliente);
            
            // Generar token
            String token = "token_" + System.currentTimeMillis();
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("cliente", clienteCreado);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email y contraseña son requeridos");
                return ResponseEntity.badRequest().body(error);
            }

            Cliente cliente = clienteService.obtenerClientePorEmail(email);
            
            if (!passwordEncoder.matches(password, cliente.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales inválidas");
                return ResponseEntity.badRequest().body(error);
            }

            // Generar token simple (en producción usar JWT)
            String token = "token_" + System.currentTimeMillis();

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("cliente", cliente);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales inválidas");
            return ResponseEntity.badRequest().body(error);
        }
    }
} 