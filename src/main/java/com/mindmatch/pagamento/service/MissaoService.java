package com.mindmatch.pagamento.service;

import com.mindmatch.pagamento.dto.MissaoRequest;
import com.mindmatch.pagamento.dto.MissaoResponse;
import com.mindmatch.pagamento.entities.Missao;
import com.mindmatch.pagamento.repositories.MissaoRepository;
import com.mindmatch.pagamento.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MissaoService {

    private final MissaoRepository repository;

    @Transactional
    public MissaoResponse create(MissaoRequest request) {
        Missao created = new Missao();
        created.setNome(request.nome());
        created.setTempo(request.tempo());

        Missao saved = repository.save(created);

        return new MissaoResponse(saved);
    }

    @Transactional
    public MissaoResponse findById(Long id) {
        return new MissaoResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Missão não encontrada, Id: " + id)));
    }

    @Transactional(readOnly = true)
    public java.util.List<MissaoResponse> findAll() {
        return repository.findAll().stream()
                .map(MissaoResponse::new)
                .toList();
    }

}
