import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { throws } from 'assert';
import { log } from 'console';
import { ApiBaseService } from '../servicio/api-base.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage{
  public v : boolean = false;
  public v2 : boolean = false;
  public v3 : boolean = true;
  public v4 : boolean = false;
  public v5 : boolean = true;
  public formQr! :FormGroup | any;
  public sigla! :string;
  public nombre! :string;

  qrCodeString:string = "";

  public qr = {
    id:0,
    ramosId : 0,
    fecha : '',
    hora: ''
  }

  constructor(private builder:FormBuilder, public api : ApiBaseService,  private alertController: AlertController,private loadingCtrl: LoadingController) {
    this.formQr = this.builder.group({
      'nombre': new FormControl('',[Validators.required])
    })
  }

  ionViewWillEnter(){
    this.api.ramos();
  }



  public async GenerarQr(){


    if(this.formQr.valid){
      for (let index = 0; index < this.api.obtenerRamosDatos().length; index++) {
        if(this.formQr.get('nombre').value === this.api.obtenerRamosDatos()[index]?.nombre+' '+this.api.obtenerRamosDatos()[index]?.sigla){
         this.qr.ramosId = this.api.obtenerRamosDatos()[index]?.id;
         this.sigla = this.api.obtenerRamosDatos()[index]?.sigla;
         this.nombre = this.api.obtenerRamosDatos()[index]?.nombre;
        }
      }

      const fecha = new Date();
      this.qr.fecha = fecha.toLocaleDateString();
      this.qr.hora = fecha.getHours()+':'+fecha.getMinutes()

      this.api.agregarAsitencia({...this.qr}, ()=>{
        this.qr.id = this.api.obtenerAsitenciaDatos()?.id
        this.qrCodeString = JSON.stringify(this.qr);
        this.v2= true;
        this.v3=false;
        this.v4=true;
        this.formQr.reset();
      });

    }else{

      const alert = await this.alertController.create({
        header: 'Campos invalidos!',
        message: `<img src="../../assets/icon/cancelar.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
      });

      await alert.present();

      this.v = true;


    }


  }
  public showLoading() {

    this.v2 = false;
    this.v3 = true;
    this.v4 = false;
    this.qr = {
      id:0,
      ramosId : 0,
      fecha : '',
      hora: ''
    }

    this.qrCodeString = '';
  }


  public campo(control: string) {
    return this.formQr.get(control);
  }
  public fueTocado(control: string){
    return this.formQr.get(control).touched;
  }




}
