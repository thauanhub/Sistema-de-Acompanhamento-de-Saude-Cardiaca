import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AcompanhamentoService } from '../services/acompanhamento';

@Component({
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.page.html',
  styleUrls: ['./acompanhamento.page.scss'],
  standalone: false,
})
export class AcompanhamentoPage implements OnInit {
  saudeForm!: FormGroup;
  historico: any[] = [];

  constructor(
    private fb: FormBuilder,
    private acompanhamentoService: AcompanhamentoService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.carregarHistorico();
  }

  // 1. Prepara os campos vazios com as regras de validação
  inicializarFormulario() {
    this.saudeForm = this.fb.group({
      pressao_arterial: ['', Validators.required],
      frequencia_cardiaca: ['', [Validators.required, Validators.min(30), Validators.max(250)]],
      nivel_oxigenacao: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      peso: ['', [Validators.required, Validators.min(20)]],
      data: ['', Validators.required],
      sintomas: [''] // É opcional, então não tem Validators!
    });
  }

  // 2. Busca os dados lá do seu Back-End (Rota GET)
  carregarHistorico() {
    this.acompanhamentoService.listarHistorico().subscribe({
      next: (dados) => {
        this.historico = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar histórico', erro);
      }
    });
  }

  // 3. Envia os dados novos para o Back-End (Rota POST)
  async onSubmit() {
    if (this.saudeForm.invalid) {
      this.mostrarAlerta('Atenção', 'Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const loading = await this.loadingController.create({ message: 'A guardar registro...' });
    await loading.present();

    this.acompanhamentoService.registrar(this.saudeForm.value).subscribe({
      next: async (resposta) => {
        await loading.dismiss();
        this.mostrarAlerta('Sucesso', 'Registro diário salvo com sucesso!');
        this.saudeForm.reset(); // Limpa o formulário
        this.carregarHistorico(); // Atualiza a lista na hora
      },
      error: async (erro) => {
        await loading.dismiss();
        this.mostrarAlerta('Erro', 'Não foi possível salvar os dados.');
        console.error(erro);
      }
    });
  }

  async mostrarAlerta(cabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}