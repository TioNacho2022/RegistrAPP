import { Component, OnInit } from '@angular/core';
import { ApiBaseService } from '../servicio/api-base.service';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  public mobile: boolean = false;
  public desktop: boolean = false;

  constructor(public api:ApiBaseService,public platform:Platform, private alertController: AlertController, private router:Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){

    if(this.platform.is('mobile')){
      this.mobile = true;
    }if(this.platform.is('desktop')){
      const alert = await this.alertController.create({
        header: 'Escanea y descarga',
        subHeader: 'APK',
        message: '<img src="../../assets/icon/frame.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">',

      });

      await alert.present();
    }else{}

  }

  public cerrarSesion(){
    this.api.sessionActive = false;
    this.api.opcionAlumno = false;
    this.api.opcionProfesor= false;
    this.router.navigate(['/'])
  }

}
