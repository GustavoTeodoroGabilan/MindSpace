import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PessoalService } from '../../services/pessoal/pessoal';
import { AppModule } from '../../app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pessoal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pessoal.html',
  styleUrls: ['./pessoal.less'],
})
export class PessoalComponent {
  constructor(
    private pessoalService: PessoalService,
    public global: AppModule,
    private router: Router
  ) {}


  ngOnInit() {
    if (this.global.logou !== true) {
      this.router.navigate(['']);
    }
  }

  idAgente: string = '';
  // campos de busca reduzidos: apenas ID

  mensagem: string = '';
  showResult: boolean = false;

  agente: any = null;
  sinais: any[] = [];

  buscarAgente() {
    const id = Number(this.idAgente);
    if (!id || Number.isNaN(id)) {

      this.mensagem = 'Informe um ID de agente válido.';
      this.showResult = false;
      return;
    }

    this.pessoalService.buscarAgentePorId(id).subscribe({
      next: (dados) => {
        this.agente = dados;
        this.sinais = dados?.sinalSaude ?? [];
        this.global.idAgenteSelecionado = dados.id;
        this.mensagem = '';
        this.showResult = true;
      },
      error: (erro) => {
        console.error('Erro ao buscar agente:', erro);
        this.mensagem = 'Agente não encontrado. Verifique o ID e tente novamente.';
        this.showResult = false;
        this.global.idAgenteSelecionado = 0;
      },
    });
  }

  limparCampos() {
    this.idAgente = '';

    this.mensagem = '';

    this.showResult = false;
    this.agente = null;
    this.sinais = [];
    this.global.idAgenteSelecionado = 0;
  }

  verRotina() {
    if (!this.agente?.id) return;
    this.global.idAgenteSelecionado = this.agente.id;
    this.router.navigate(['/rotinas']);
  }

  formatarData(dataISO: string | null): string {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return dataISO;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  get statusLabel(): string {
    if (!this.agente) return '';
    const status = String(this.agente.statusSaude || '').toUpperCase();
    if (status === 'NORMAL') {
      return 'Excelente';
    }
    if (status === 'ATENCAO') {
      return 'Atenção';
    }
    return 'Crítico';
  }

  get statusClass(): string {
    if (!this.agente) return '';
    const status = String(this.agente.statusSaude || '').toUpperCase();
    if (status === 'NORMAL') {
      return 'statusExcelente';
    }
    if (status === 'ATENCAO') {
      return 'statusAtencao';
    }
    return 'statusCritico';
  }
}
