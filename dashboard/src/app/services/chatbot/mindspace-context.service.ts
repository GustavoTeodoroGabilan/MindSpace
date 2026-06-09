import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MindAgentSummary {
  totalAgentes: number;
  totalMissoes: number;
  agentesAtencao: number;
  agentesCriticos: number;
  agentesNormais: number;
  statusCritico: number;
}

export interface MindTaskSummary {
  tarefasPendentes: number;
  tarefasAndamento: number;
  tarefasConcluidas: number;
}

@Injectable({
  providedIn: 'root'
})
export class MindspaceContextService {
  private agentSummarySubject = new BehaviorSubject<MindAgentSummary>({
    totalAgentes: 0,
    totalMissoes: 0,
    agentesAtencao: 0,
    agentesCriticos: 0,
    agentesNormais: 0,
    statusCritico: 0
  });

  private taskSummarySubject = new BehaviorSubject<MindTaskSummary>({
    tarefasPendentes: 0,
    tarefasAndamento: 0,
    tarefasConcluidas: 0
  });

  // Lista bruta (opcional) para gerar contexto textual com detalhes
  private agentsRawSubject = new BehaviorSubject<any[]>([]);
  private missionsRawSubject = new BehaviorSubject<any[]>([]);
  private tasksRawSubject = new BehaviorSubject<any[]>([]);

  public agentsSummary$ = this.agentSummarySubject.asObservable();
  public tasksSummary$ = this.taskSummarySubject.asObservable();
  public agentsRaw$ = this.agentsRawSubject.asObservable();
  public missionsRaw$ = this.missionsRawSubject.asObservable();
  public tasksRaw$ = this.tasksRawSubject.asObservable();

  updateAgentsSummary(summary: MindAgentSummary): void {
    this.agentSummarySubject.next(summary);
  }

  updateTasksSummary(summary: MindTaskSummary): void {
    this.taskSummarySubject.next(summary);
  }

  // Mantém nomes antigos para não quebrar chamadas existentes no código
  updateStats(stats: MindAgentSummary & MindTaskSummary): void {
    this.updateAgentsSummary(stats as MindAgentSummary);
    this.updateTasksSummary(stats as any as MindTaskSummary);
  }

  // Para compatibilidade com o que o HomeComponent já chama
  updateTransactions(transactions: any[]): void {
    // aqui interpretamos como lista de agentes (no módulo atual do MindSpace)
    this.agentsRawSubject.next(Array.isArray(transactions) ? transactions : []);
  }

  updateClients(clients: any[]): void {
    // aqui interpretamos como lista de tarefas/missoes retornadas no módulo
    this.missionsRawSubject.next(Array.isArray(clients) ? clients : []);
  }

  // getters
  getAgentsSummary(): MindAgentSummary {
    return this.agentSummarySubject.value;
  }

  getTasksSummary(): MindTaskSummary {
    return this.taskSummarySubject.value;
  }

  getAgentsRaw(): any[] {
    return this.agentsRawSubject.value;
  }

  getMissionsRaw(): any[] {
    return this.missionsRawSubject.value;
  }

  getTasksRaw(): any[] {
    return this.tasksRawSubject.value;
  }

  // novo formato do contexto para o MindSpace
  getFormattedContext(): string {
    const agentsSummary = this.getAgentsSummary();
    const tasksSummary = this.getTasksSummary();
    const agents = this.getAgentsRaw();

    const agentesText = Array.isArray(agents) && agents.length
      ? agents
          .slice(0, 10)
          .map((a: any) => {
            const status = a?.status ?? 'N/A';
            const missao = a?.nomeMissao ?? a?.missao?.nome ?? a?.missaoId ?? 'sem missao';
            return `- ${a?.nome ?? 'Agente'} | especialidade: ${a?.especialidade ?? 'N/A'} | status: ${status} | missao: ${missao} | descanso: ${a?.descanso ?? 'N/A'}%`;
          })
          .join('\n')
      : '- Nenhum agente cadastrado';

    return `
CONTEXTO DE TRIPULAÇÃO DO MINDSPACE (DASHBOARD):

🚀 ESTATÍSTICAS:
- Total de agentes: ${agentsSummary.totalAgentes}
- Agentes normais: ${agentsSummary.agentesNormais}
- Agentes em atenção: ${agentsSummary.agentesAtencao}
- Agentes críticos: ${agentsSummary.agentesCriticos}
- Missões: ${agentsSummary.totalMissoes}

🩺 TAREFAS (RESUMO):
- Pendentes: ${tasksSummary.tarefasPendentes}
- Em andamento: ${tasksSummary.tarefasAndamento}
- Concluídas: ${tasksSummary.tarefasConcluidas}

👩‍🚀 AGENTES (DETALHES):
${agentesText}
`.trim();
  }
}

