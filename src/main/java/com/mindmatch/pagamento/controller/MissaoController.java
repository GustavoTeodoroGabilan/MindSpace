package com.mindmatch.pagamento.controller;

import com.mindmatch.pagamento.dto.MissaoRequest;
import com.mindmatch.pagamento.dto.MissaoResponse;
import com.mindmatch.pagamento.service.MissaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/missoes")
@RequiredArgsConstructor
public class MissaoController {

    private final MissaoService service;

    @PostMapping
    public ResponseEntity<MissaoResponse> create(@RequestBody MissaoRequest request) {
        MissaoResponse responseBody = service.create(request);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/id/{id:[0-9]+}")
                .buildAndExpand(responseBody.id())
                .toUri();

        return ResponseEntity.created(uri).body(responseBody);
    }

    @GetMapping("/id/{id:[0-9]+}")
    public ResponseEntity<MissaoResponse> findById(@PathVariable Long id) {
        MissaoResponse responseBody = service.findById(id);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping
    public ResponseEntity<java.util.List<MissaoResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}

