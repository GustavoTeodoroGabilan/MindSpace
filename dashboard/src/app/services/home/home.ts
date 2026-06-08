import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  obterAgentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/agentes');
  }

  obterMissoes(idMissao: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + `/missoes/id/${idMissao}`);
  }

  obterTodasMissoes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/missoes');
  }


  criarAgente(agente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agentes/novo`, agente);
  }
}
