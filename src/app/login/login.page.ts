import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ApiBaseService } from '../servicio/api-base.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup | any;

  constructor( private alertController: AlertController, private navCtrl: NavController, private toast: ToastController, private fb: FormBuilder,private api: ApiBaseService) {
    this.formularioLogin = this.fb.group({
      'usuario': new FormControl("", [Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      'password': new FormControl("",[Validators.required,Validators.minLength(4),Validators.maxLength(4)])
    })
  }

  ngOnInit() {
  }

  public async ingresar(){
    if(this.formularioLogin.valid){
      this.api.authUser(this.formularioLogin.value.usuario,this.formularioLogin.value.password);
      this.formularioLogin.reset();
    }else{
      const alert = await this.alertController.create({
        header: 'Campos invalidos!',
        message: `<img src="../../assets/icon/cancelar.png" alt="g-maps" style="border-radius: 2px;text-aling:center;">`,
      });

      await alert.present();
    }

  }

  public campo(control: string) {
    return this.formularioLogin.get(control);
  }
  public fueTocado(control: string){
    return this.formularioLogin.get(control).touched;
  }

}
