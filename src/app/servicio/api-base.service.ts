import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from '../modelos/user';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Ramos } from '../modelos/ramo';
import { Asistencia, AsistenciaResponse } from '../modelos/asitencia';
@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  private usuarioDatos!:User;

  private ramosDatos!:Ramos;
  private asistenciaDatos!: any;

  constructor(private http:HttpClient, private alertController: AlertController, private router:Router) { }

  private url_usuarios:string=" http://localhost:3000/usuarios";
  private url_ramos:string=" http://localhost:3000/ramos";
  private url_asitencias:string=" http://localhost:3000/asistencias";

  public authUser(usuario:string,password:string){
    this.http.get<UserResponse>(this.url_usuarios+`?usuario=${usuario}&password=${password}`,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res =>{
      if(res[0]?.usuario === usuario && res[0]?.password === password){
        const alert = await this.alertController.create({
          header: 'Sesion iniciada',
          message: `<img src="../../assets/icon/importar.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
        });

        await alert.present();

        this.usuarioDatos = res[0];

        this.router.navigate(['/inicio']);

      }else{
        const alert = await this.alertController.create({
          header: 'Sesion invalida',
          message: `<img src="../../assets/icon/acceso.png" alt="g-maps" style="border-radius: 2px">`,
        });

        await alert.present();

      }

    })
  }

  public ramos(){
    this.http.get<Ramos>(this.url_ramos,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res =>{
      this.ramosDatos = res;
    })
  }

  public agregarAsitencia(objeto:Asistencia, callback?:Function):any{
    this.http.post<AsistenciaResponse>(this.url_asitencias,objeto,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res =>{
      this.asistenciaDatos = res;
      if(callback)
      callback()
    })
  }


  public vaciar(){
    this.asistenciaDatos = '';
  }

  public obtenerRamosDatos(){
    return this.ramosDatos;
  }
  public obtenerAsitenciaDatos(){
    return this.asistenciaDatos;
  }
}
