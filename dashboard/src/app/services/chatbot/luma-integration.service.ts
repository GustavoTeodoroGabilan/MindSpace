import { Injectable } from '@angular/core';
import { LumaService } from '../chatbot/luma.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Serviço de integração entre Luma e os dados do Dashboard
 * Fornece contexto específico do usuário para respostas mais precisas
 */
@Injectable({
  providedIn: 'root'
})
export class LumaIntegrationService {

  constructor(private lumaService: LumaService) {}
}
