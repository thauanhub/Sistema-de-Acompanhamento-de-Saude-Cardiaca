import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  usuario: any;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    // Tenta recuperar dados do usuário do localStorage ou sessionStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
    } else {
      this.usuario = {
        email: 'Usuário'
      };
    }
  }

  irParaRelatorios() {
    this.router.navigate(['/relatorios']);
  }

  irParaAcompanhamento() {
    this.router.navigate(['/acompanhamento']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Tem certeza que deseja fazer logout?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Logout cancelado');
          },
        },
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }
}
