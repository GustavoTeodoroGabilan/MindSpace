import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";
import { ChatbotComponent } from "./shared/components/chatbot/chatbot";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet, 
    Navbar,
    ChatbotComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class AppModule {
  protected readonly title = signal('dashboard-pagamento-mindmatch');

  constructor(
    public router: Router
  ){}


  ngOnInit(){
  }

  logoff(): void {
    this.logou = false;
    this.idAgenteSelecionado = 0;
    this.router.navigate(['/']);
  }

  telefone: string = "";

  email: string = "";
  idCliente: number = 0;
  idTransacao: number = 0;

  listaDados: any = [];

  selecionou: boolean = false
  logou: boolean = false
  idAgenteSelecionado: number = 0
}
