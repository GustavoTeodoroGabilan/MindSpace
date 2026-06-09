import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SpaceContextService } from './space-context.service';
import { MindspaceContextService } from './mindspace-context.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Função helper para acessar variáveis de ambiente
function getEnvVariable(key: string): string {
  if (typeof window !== 'undefined' && (window as any)[key]) {
    return (window as any)[key];
  }
  // Fallback para build time
  return '';
}

@Injectable({
  providedIn: 'root'
})
export class LumaService {
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  private readonly API_KEY = getEnvVariable('VITE_GEMINI_API_KEY') || 'AIzaSyAMWFTeiS62Qk5lKrYGB4y9qjPfSehEJc8';
  
  private chatHistorySubject = new BehaviorSubject<ChatMessage[]>([]);
  public chatHistory$ = this.chatHistorySubject.asObservable();

  private systemContext = `
    Você é Luma, a assistente virtual do MindSpace.
    Você atua como central de apoio da tripulação espacial e também entende os dados operacionais do dashboard.
    Você tem acesso aos dados do dashboard em tempo real e pode consultar:
    
    📊 CAPACIDADES:
    - Buscar informações de tripulantes, missões e tarefas
    - Verificar sinais de saúde de cada agente
    - Calcular estatísticas operacionais e financeiras
    - Identificar padrões de risco, carga e prioridade
    
    💡 INSTRUÇÕES:
    - Use os dados do contexto fornecido para responder com precisão
    - Quando o usuário perguntar sobre um tripulante, busque pelo nome aproximado e responda de forma direta
    - Use termos do universo espacial quando falar de agentes, missões, sinais e tarefas
    - Seja objetiva, acolhedora e técnica na medida certa
    - Se não encontrar algo, diga o que faltou e sugira o próximo passo
    - Apresente números de forma clara e formatada
    - Quando houver risco, prioridade ou alerta, destaque isso logo no início da resposta
    
    🎯 EXEMPLOS DE PERGUNTAS QUE VOCÊ PODE RESPONDER:
    - "Como está o agente Orion?"
    - "Quais sinais de saúde estão em alerta?"
    - "Quais tarefas estão pendentes na nave?"
    - "Qual tripulante precisa de mais descanso?"
  `;

  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private spaceContext = inject(SpaceContextService);

  private initializeChat(): void {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: 'Olá, eu sou a Luma, a central de apoio do MindSpace. Posso ajudar com a tripulação, os sinais de saúde, as tarefas ou os dados do painel.',
      timestamp: new Date()
    };
    this.chatHistorySubject.next([welcomeMessage]);
  }

  public sendMessage(userMessage: string, contextData?: any): Observable<ChatMessage> {
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    const currentHistory = this.chatHistorySubject.value;
    this.chatHistorySubject.next([...currentHistory, userChatMessage]);

    // Adicionar contexto do dashboard automaticamente
    const spaceContext = this.spaceContext.getFormattedContext();
    const enhancedContextData = {
      ...contextData,
      crewStats: this.spaceContext.getStats(),
      agents: this.spaceContext.getAgents(),
      missions: this.spaceContext.getMissions(),
      healthSignals: this.spaceContext.getSignals(),
      tasks: this.spaceContext.getTasks()
    };

    return this.callGeminiAPI(userMessage, enhancedContextData).pipe(
      map(response => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        
        const updatedHistory = this.chatHistorySubject.value;
        this.chatHistorySubject.next([...updatedHistory, assistantMessage]);
        
        return assistantMessage;
      }),
      catchError(error => {
        console.error('Erro ao comunicar com Luma:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Não consegui processar essa solicitação agora. Tente novamente em alguns instantes ou reformule a pergunta.',
          timestamp: new Date()
        };
        
        const updatedHistory = this.chatHistorySubject.value;
        this.chatHistorySubject.next([...updatedHistory, errorMessage]);
        
        return of(errorMessage);
      })
    );
  }

  private callGeminiAPI(message: string, contextData?: any): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let enhancedPrompt = `${this.systemContext}\n\nUsuário: ${message}`;

    if (contextData) {
      enhancedPrompt += `\n\nContexto adicional (dados do usuário):\n${JSON.stringify(contextData, null, 2)}`;
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: enhancedPrompt
        }]
      }]
    };

    const url = `${this.GEMINI_API_URL}?key=${this.API_KEY}`;

    return this.http.post<any>(url, requestBody, { headers }).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          const content = response.candidates[0].content;
          if (content.parts && content.parts.length > 0) {
            return content.parts[0].text;
          }
        }
        throw new Error('Resposta inválida da API');
      })
    );
  }

  public clearHistory(): void {
    this.initializeChat();
  }

  public getChatHistory(): ChatMessage[] {
    return this.chatHistorySubject.value;
  }

  public generateReport(data: any): Observable<string> {
    const prompt = `
      Com base nos seguintes dados financeiros, gere um relatório em linguagem natural:
      ${JSON.stringify(data, null, 2)}
      
      Inclua:
      - Resumo geral das transações
      - Principais categorias de gastos
      - Tendências observadas
      - Sugestões de otimização
    `;

    return this.callGeminiAPI(prompt);
  }

  public getOptimizationSuggestions(transactionData: any): Observable<string> {
    const prompt = `
      Analise os seguintes dados de transações e forneça sugestões específicas de otimização:
      ${JSON.stringify(transactionData, null, 2)}
      
      Forneça:
      - Áreas onde há oportunidades de economia
      - Alertas sobre gastos elevados
      - Recomendações personalizadas
    `;

    return this.callGeminiAPI(prompt);
  }
}