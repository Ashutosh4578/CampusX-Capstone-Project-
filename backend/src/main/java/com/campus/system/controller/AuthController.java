
package com.campus.system.controller;

import com.campus.system.model.User;
import com.campus.system.repository.UserRepository;
import com.campus.system.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null
                || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Username and password are required")
            );
        }

        Optional<User> userOptional =
                userRepository.findByUsername(username.trim());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid username or password")
            );
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid username or password")
            );
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username", user.getUsername(),
                        "role", user.getRole()
                )
        );
    }
}
