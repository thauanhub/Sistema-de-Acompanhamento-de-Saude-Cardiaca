import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

import { RegistroSaude } from '../services/acompanhamento';
import {
  RelatoriosService,
  ResumoRelatorio,
  UltimoRegistroRelatorio
} from '../services/relatorios.service';

interface GraficoBarra {
  label: string;
  valor: number;
  altura: number;
}

interface IndicadorResumo {
  titulo: string;
  valor: string;
  detalhe: string;
  icone: string;
}

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
  standalone: false,
})
export class RelatoriosPage implements OnInit {
  resumo?: ResumoRelatorio;
  ultimoRegistro?: UltimoRegistroRelatorio;
  historico: RegistroSaude[] = [];
  indicadores: IndicadorResumo[] = [];
  barrasFrequencia: GraficoBarra[] = [];
  barrasOxigenacao: GraficoBarra[] = [];
  barrasPeso: GraficoBarra[] = [];
  carregando = false;

  constructor(
    private relatoriosService: RelatoriosService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.carregarRelatorios();
  }

  async carregarRelatorios() {
    this.carregando = true;
    const loading = await this.loadingController.create({
      message: 'Carregando relatorios...'
    });
    await loading.present();

    forkJoin({
      resumo: this.relatoriosService.buscarResumo(),
      ultimo: this.relatoriosService.buscarUltimoRegistro(),
      historico: this.relatoriosService.buscarHistorico()
    }).subscribe({
      next: async ({ resumo, ultimo, historico }) => {
        this.resumo = resumo;
        this.ultimoRegistro = ultimo;
        this.historico = this.ordenarHistorico(historico);
        this.montarIndicadores();
        this.montarGraficos();
        this.carregando = false;
        await loading.dismiss();
      },
      error: async (erro) => {
        console.error('Erro ao carregar relatorios', erro);
        this.carregando = false;
        await loading.dismiss();
        this.mostrarAlerta(
          'Erro',
          'Nao foi possivel carregar os relatorios. Verifique se voce esta logado e se o backend esta rodando.'
        );
      }
    });
  }

  formatarData(data?: string): string {
    if (!data) {
      return 'Sem data';
    }

    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
  }

  temUltimoRegistro(): boolean {
    return !!this.ultimoRegistro && !this.ultimoRegistro.mensagem;
  }

  private ordenarHistorico(historico: RegistroSaude[]): RegistroSaude[] {
    return [...historico].sort((a, b) => a.data.localeCompare(b.data));
  }

  private montarIndicadores() {
    const total = this.resumo?.total_registros ?? 0;
    const mediaFrequencia = this.formatarNumero(this.resumo?.media_frequencia_cardiaca);
    const mediaOxigenacao = this.formatarNumero(this.resumo?.media_oxigenacao);
    const mediaPeso = this.formatarNumero(this.resumo?.media_peso, 1);

    this.indicadores = [
      {
        titulo: 'Registros',
        valor: `${total}`,
        detalhe: 'medicoes cadastradas',
        icone: 'clipboard'
      },
      {
        titulo: 'Media BPM',
        valor: mediaFrequencia,
        detalhe: 'frequencia cardiaca',
        icone: 'heart'
      },
      {
        titulo: 'Media O2',
        valor: `${mediaOxigenacao}%`,
        detalhe: 'oxigenacao sanguinea',
        icone: 'water'
      },
      {
        titulo: 'Media peso',
        valor: `${mediaPeso} kg`,
        detalhe: 'peso corporal',
        icone: 'scale'
      }
    ];
  }

  private montarGraficos() {
    this.barrasFrequencia = this.criarBarras('frequencia_cardiaca');
    this.barrasOxigenacao = this.criarBarras('nivel_oxigenacao');
    this.barrasPeso = this.criarBarras('peso');
  }

  private criarBarras(campo: 'frequencia_cardiaca' | 'nivel_oxigenacao' | 'peso'): GraficoBarra[] {
    const ultimosRegistros = this.historico.slice(-7);
    const valores = ultimosRegistros.map((item) => Number(item[campo]) || 0);
    const maiorValor = Math.max(...valores, 1);

    return ultimosRegistros.map((item, index) => {
      const valor = valores[index];
      const altura = Math.max((valor / maiorValor) * 100, valor > 0 ? 10 : 0);

      return {
        label: this.formatarDataCurta(item.data),
        valor,
        altura
      };
    });
  }

  private formatarDataCurta(data: string): string {
    const dataConvertida = new Date(`${data}T00:00:00`);

    return dataConvertida.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  private formatarNumero(valor?: number | null, casas = 0): string {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
      return '0';
    }

    return Number(valor).toFixed(casas);
  }

  private async mostrarAlerta(cabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}