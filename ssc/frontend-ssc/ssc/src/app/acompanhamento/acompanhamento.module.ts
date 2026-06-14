import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AcompanhamentoPageRoutingModule } from './acompanhamento-routing.module';
import { AcompanhamentoPage } from './acompanhamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // E colocamos ele aqui também!
    IonicModule,
    AcompanhamentoPageRoutingModule
  ],
  declarations: [AcompanhamentoPage]
})
export class AcompanhamentoPageModule {}