import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from '../modelos/user';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Ramos } from '../modelos/ramo';
import { Asistencia, AsistenciaResponse } from '../modelos/asitencia';
import { Alumno } from '../modelos/alumno';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  private usuarioDatos!:any;

  private ramosDatos!:Ramos;

  private alumnosDatos!:any;

  private ramoDatos!:any;

  private asistenciaDatos!: any;

  private asistencia2Datos!: any;

  private presenteDatos!:Alumno|any;

  constructor(private http:HttpClient, private alertController: AlertController, private router:Router, private storage:StorageService) { }

  private url_usuarios:string="https://registrapp-production.up.railway.app/usuarios";
  private url_ramos:string="https://registrapp-production.up.railway.app/ramos";
  private url_asitencias:string="https://registrapp-production.up.railway.app/asistencias";
  private url_alumnos:string="https://registrapp-production.up.railway.app/alumnos";

  public authUser(usuario:string,password:string){
    this.http.get<UserResponse>(this.url_usuarios+`?usuario=${usuario}&password=${password}`,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res =>{
      if(res[0]?.usuario === usuario && res[0]?.password === password){
        const alert = await this.alertController.create({
          header: 'Sesion iniciada',
          mode:'ios',
          message: `<img src="../../assets/icon/importar.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
        });

        await alert.present();

        this.usuarioDatos = res[0];

        this.storage.set('rut',this.usuarioDatos?.rut)


        this.router.navigate(['/inicio']);

      }else{
        const alert = await this.alertController.create({
          header: 'Datos Incorrectos',
          mode:'ios',
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

  public desactivarAsistencia(id:number,callback?:Function):any{

    this.http.patch(this.url_asitencias+`/${id}`,{"activa":false},{
      headers: {
        'Content-Type': 'application/json'

      },
    }).subscribe( async res =>{
      if(callback)
      callback()
    })
  }

  public confirmarAsitenciaActiva(id:number,callback?:Function):any{
    this.http.get<any>(this.url_asitencias+`/${id}`,{
      headers: {
        'Content-Type': 'application/json'

      },
    }).subscribe(async res =>{
      if(callback && res?.activa){
        callback()
      }else{
        const alert = await this.alertController.create({
          header: 'Asitencia no activa!',
          mode:'ios',
          message: `<img src="../../assets/icon/colgando.png" alt="g-maps" style="border-radius: 2px">`,
        });

        await alert.present();
      }

    })
  }

  public ecnotrarAlumno(id:number){
    this.http.get(this.url_alumnos+`?asistenciasId=${id}&rut=${this.storage.get('rut')}`,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res => {
      this.presenteDatos = res
      if(this.presenteDatos[0]?.rut === this.storage.get('rut')){

        this.presenteDatos = res;

        this.presente(this.presenteDatos[0]?.id)


      }else{
        const alert = await this.alertController.create({
          header: 'Alumno no encontrado!',
          subHeader: 'no pertenece a esta seccion',
          mode:'ios',
          message: `<img src="../../assets/icon/user.png" alt="g-maps" style="border-radius: 2px">`,
        });

        await alert.present();

      }

    })
  }

  public presente(id:number){
    this.http.get<any>(this.url_alumnos+'/'+id,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(async res => {
      if(res.presente === false){

        const fecha = new Date();
        var hora = fecha.getHours()+':'+fecha.getMinutes()

        this.http.patch(this.url_alumnos+`/${id}`,{"presente":true,"hora":hora},{
          headers: {
            'Content-Type': 'application/json'
          }
        }).subscribe(async res => {

          const alert = await this.alertController.create({
            header: 'Registrado!',
            mode:'ios',
            message: `<img src="../../assets/icon/checked.png" alt="g-maps" style="border-radius: 2px">`,
          });

          await alert.present();
        })


      }else{
        const alert = await this.alertController.create({
          header: 'Ya registrado!',
          mode:'ios',
          message: `<img src="../../assets/icon/error.png" alt="g-maps" style="border-radius: 2px">`,
        });

        await alert.present();
      }

    })
  }

  public alumnos(id:number){
    this.http.get<any>(this.url_alumnos+`?asistenciasId=${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe( resp => {
      this.alumnosDatos = resp
      this.asistencia(id)
    })
  }

  public asistencia(id:number){
    this.http.get<any>(this.url_asitencias+`/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(res => {
      this.asistencia2Datos = res
      this.ramo(res?.ramosId)
    })
  }

  public ramo(id:number){
    this.http.get(this.url_ramos+`/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe( res => {
      this.ramoDatos = res;
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

  public obtenerUsuariosDatos(){
    return this.usuarioDatos;
  }

  public obtenerPresenteDatos(){
    return this.presenteDatos[0];
  }

  public obtenerRamoDatos(){
    return this.ramoDatos;
  }

  public obtenerAsistencia2Datos(){
    return this.asistencia2Datos;
  }

  public obtenerAlumnosDatos(){
    return this.alumnosDatos;
  }
}
