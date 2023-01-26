import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscanQrPageRoutingModule } from './escan-qr-routing.module';

import { EscanQrPage } from './escan-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanQrPageRoutingModule
  ],
  declarations: [EscanQrPage]
})
export class EscanQrPageModule {}
