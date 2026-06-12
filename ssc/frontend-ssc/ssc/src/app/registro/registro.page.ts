import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registroForm = this.formBuilder.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        dataNascimento: ['', Validators.required],
        sexo: ['', Validators.required],
        celular: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
        pais: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', Validators.required],
        termos: [false, Validators.requiredTrue],
      },
      { validators: this.senhasIguais }
    );
  }

  senhasIguais(group: FormGroup) {
    const senha = group.get('senha');
    const confirmarSenha = group.get('confirmarSenha');

    if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ senhasNaoIguais: true });
      return { senhasNaoIguais: true };
    } else if (confirmarSenha?.hasError('senhasNaoIguais')) {
      confirmarSenha.setErrors(null);
    }

    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get f() {
    return this.registroForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.registroForm.invalid) {
      await this.presentAlert('Erro', 'Por favor, preencha todos os campos corretamente');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Criando sua conta...',
    });
    await loading.present();

    try {
      const dadosRegistro = {
        nome: this.f['nome'].value,
        email: this.f['email'].value,
        data_nascimento: this.f['dataNascimento'].value,
        sexo: this.f['sexo'].value,
        celular: this.f['celular'].value,
        pais: this.f['pais'].value,
        senha: this.f['senha'].value,
      };

      console.log('Dados de registro:', dadosRegistro);

      this.authService.registrar(dadosRegistro).subscribe(
        (response) => {
          loading.dismiss();
          console.log('Resposta do backend:', response);
          this.presentAlert('Sucesso', 'Conta criada com sucesso! Você será redirecionado para login.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        (error) => {
          loading.dismiss();
          console.error('Erro:', error);
          const mensagem = 
            error?.error?.detail || 
            error?.error?.message || 
            'Erro ao criar conta. Tente novamente.';
          this.presentAlert('Erro', mensagem);
        }
      );
    } catch (error: any) {
      await loading.dismiss();
      const mensagem = error?.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      await this.presentAlert('Erro', mensagem);
    }
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  voltarParaLogin() {
    this.router.navigate(['/login']);
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  formatarTelefone(event: any) {
    let input = event.target.value;
    input = input.replace(/\D/g, '');
    input = input.replace(/(\d{2})(\d)/, '($1) $2');
    input = input.replace(/(\d{5})(\d)/, '$1-$2');
    event.target.value = input;
    this.registroForm.get('celular')?.setValue(input, { emitEvent: false });
  }
}
