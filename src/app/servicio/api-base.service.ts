import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from '../modelos/user';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Ramos } from '../modelos/ramo';
import { Asistencia, AsistenciaResponse } from '../modelos/asitencia';
import { Alumno } from '../modelos/alumno';
@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  private usuarioDatos!:any;

  private ramosDatos!:Ramos;

  private asistenciaDatos!: any;

  private presenteDatos!:Alumno|any;

  constructor(private http:HttpClient, private alertController: AlertController, private router:Router) { }

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

  public ecnotrarAlumno(id:number){
    this.http.get(this.url_alumnos+`?asistenciasId=${id}&rut=${this.usuarioDatos?.rut}`,{
      headers: {
        'Content-Type': 'application/json'
      },
    }).subscribe(async res => {
      this.presenteDatos = res
      if(this.presenteDatos[0]?.rut === this.usuarioDatos?.rut){

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
}
