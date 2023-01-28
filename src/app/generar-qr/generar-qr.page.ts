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
  public listaalumnosId! :number;
  public cargando:boolean= false;
  public finalizando:boolean=false;

  qrCodeString:string = "";

  public qr = {
    id:0,
    ramosId : 0,
    fecha : '',
    hora: '',
    activa:true
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
      this.cargando= true;
      for (let index = 0; index < this.api.obtenerRamosDatos().length; index++) {
        if(this.formQr.get('nombre').value === this.api.obtenerRamosDatos()[index]?.nombre+' '+this.api.obtenerRamosDatos()[index]?.sigla){
         this.qr.ramosId = this.api.obtenerRamosDatos()[index]?.id;
         this.sigla = this.api.obtenerRamosDatos()[index]?.sigla;
         this.nombre = this.api.obtenerRamosDatos()[index]?.nombre;
         this.listaalumnosId = this.api.obtenerRamosDatos()[index]?.listaalumnosId;
        }
      }

      const fecha = new Date();
      this.qr.fecha = fecha.toLocaleDateString();
      this.qr.hora = fecha.getHours()+':'+fecha.getMinutes()



      this.api.agregarAsitencia({...this.qr}, async ()=>{
        this.qr.id = this.api.obtenerAsitenciaDatos()?.id
        this.qrCodeString = JSON.stringify(this.qr);
        const alert = await this.alertController.create({
          header: 'Asistencia generada',
          mode:"ios",
          message: `<img src="../../assets/icon/qr-code.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
        });

        await alert.present();
        this.cargando=false;
        this.v2= true;
        this.v3=false;
        this.v4=true;
        this.formQr.reset();
      });

    }else{

      const alert = await this.alertController.create({
        header: 'Campos invalidos!',
        mode:"ios",
        message: `<img src="../../assets/icon/cancelar.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
      });

      await alert.present();

      this.v = true;


    }


  }

  public finalizar() {
    this.finalizando = true;
    this.api.desactivarAsistencia(this.qr.id, async ()=>{
      this.finalizando= false;
      this.v2 = false;
      this.v3 = true;
      this.v4 = false;
      this.qr = {
      id:0,
      ramosId : 0,
      fecha : '',
      hora: '',
      activa:false
      }
      this.qrCodeString = '';

      const alert = await this.alertController.create({
        header: 'Asistencia finalizada!',
        mode:"ios",
        message: `<img src="../../assets/icon/hire.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
      });

      await alert.present();

    })

  }


  public campo(control: string) {
    return this.formQr.get(control);
  }
  public fueTocado(control: string){
    return this.formQr.get(control).touched;
  }




}
