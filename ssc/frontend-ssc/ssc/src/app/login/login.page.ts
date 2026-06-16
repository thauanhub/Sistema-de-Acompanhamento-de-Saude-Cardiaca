import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  showPassword = false;

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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      lembrar: [false],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      await this.presentAlert(
        'Erro',
        'Por favor, preencha todos os campos corretamente'
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Fazendo login...',
    });
    await loading.present();

    try {
      const dadosLogin = {
        email: this.f['email'].value,
        senha: this.f['senha'].value,
      };

      this.authService.login(dadosLogin).subscribe(
        (response) => {
          loading.dismiss();
          console.log('Resposta do login:', response);
          
          // Salvar token
          if (response.access_token) {
            // Criar objeto de usuário com dados básicos
            const usuario = {
              email: dadosLogin.email,
              token: response.access_token,
            };
            
            this.authService.salvarSessao(response.access_token, usuario);
            this.presentAlert('Sucesso', 'Login realizado com sucesso!');
            
            // Redirecionar para menu após 1 segundo
            setTimeout(() => {
              this.router.navigate(['/menu']);
            }, 1000);
          }
        },
        (error) => {
          loading.dismiss();
          console.error('Erro ao fazer login:', error);
          const mensagem =
            error?.error?.detail || 
            error?.error?.message || 
            'Erro ao fazer login. Verifique suas credenciais.';
          this.presentAlert('Erro', mensagem);
        }
      );
    } catch (error: any) {
      await loading.dismiss();
      const mensagem = error?.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
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

  irParaRegistro() {
    this.router.navigate(['/registro']);
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  async esqueceuSenha() {
    const alert = await this.alertController.create({
      header: 'Recuperar Senha',
      message: 'Enviaremos um link de recuperação para seu email',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Digite seu email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (data.email) {
              await this.presentAlert(
                'Enviado',
                'Verifique seu email para recuperar a senha'
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
