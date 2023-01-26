import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-escan-qr',
  templateUrl: './escan-qr.page.html',
  styleUrls: ['./escan-qr.page.scss'],
})
export class EscanQrPage implements OnInit {

  scanActivate: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  async checkPermission(){
    return new Promise(async(resolve, reject)=>{
      const status = await BarcodeScanner.checkPermission({ force: true});
      if(status.granted){
        resolve(true);
      }else if(status.denied){
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner(){
    const allowed = await this.checkPermission();

    if(allowed){
      this.scanActivate = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if(result.hasContent){
        this.scanActivate = false;
        alert(result.content);
      }else{
        alert('No se encontraron DATOS');
      }
    }else {
      alert('No tienes Permiso');
    }
  }

  stopScanner(){
    BarcodeScanner.stopScan();
    this.scanActivate = false;
  }

}
