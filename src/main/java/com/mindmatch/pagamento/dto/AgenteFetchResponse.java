package com.mindmatch.pagamento.dto;

import com.mindmatch.pagamento.entities.Agente;
import com.mindmatch.pagamento.entities.enums.StatusAgente;

import java.time.LocalDate;
import java.util.List;

public record AgenteFetchResponse(
        Long id,
        String nome,
        String especialidade,
        LocalDate ultimaRevisao,
        Long idMissao,
        String nomeMissao,
        Long duracaoMissao,
        StatusAgente status
) {

    public AgenteFetchResponse(Agente entity) {
        this(
                entity.getId(),
                entity.getNome(),
                entity.getEspecialidade(),
                entity.getUltimaRevisao(),
                entity.getMissao().getId(),
                entity.getMissao().getNome(),
                entity.getMissao().getTempo(),
                entity.getStatus()
        );
    }
}
