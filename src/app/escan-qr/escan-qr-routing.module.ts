import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscanQrPage } from './escan-qr.page';

const routes: Routes = [
  {
    path: '',
    component: EscanQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscanQrPageRoutingModule {}
