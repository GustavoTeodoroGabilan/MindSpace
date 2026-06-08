package com.mindmatch.pagamento.controller;

import com.mindmatch.pagamento.dto.*;
import com.mindmatch.pagamento.service.AgenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/agentes")
public class AgenteController {

    private final AgenteService service;

    @GetMapping
    public ResponseEntity<List<AgenteFetchResponse>> findAll() {
        List<AgenteFetchResponse> responseBody = service.findAll();

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/id/{id:[0-9]+}")
    public ResponseEntity<AgenteCreationResponse> findById(@PathVariable Long id) {
        AgenteCreationResponse responseBody = service.findById(id);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/rotina/id/{id:[0-9]+}")
    public ResponseEntity<AgenteRotinaResponse> findAgenteRotinaById(@PathVariable Long id) {
        AgenteRotinaResponse responseBody = service.findRotinaAgenteById(id);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/sinais/id/{id:[0-9]+}")
    public ResponseEntity<AgenteSinalResponse> findAgenteSinal(@PathVariable Long id) {
        AgenteSinalResponse responseBody = service.findAgenteSinal(id);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/sinais/media")
    public ResponseEntity<MediaAgentesResponse> getMediaSinais() {
        MediaAgentesResponse responseBody = service.mediaAgentes();
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/novo")
    public ResponseEntity<AgenteCreationResponse> create(@RequestBody AgenteCreationRequest request) {
        AgenteCreationResponse responseBody = service.create(request);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/id/{id:[0-9]+}")
                .buildAndExpand(responseBody.id())
                .toUri();

        return ResponseEntity.created(uri).body(responseBody);
    }
}
