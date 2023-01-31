import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailPasswordService } from '../servicio/email-password.service';
@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})


export class PasswordPage implements OnInit {

  public formPassword !: FormGroup | any;

  constructor(private builder:FormBuilder, private email:EmailPasswordService ) {
    this.formPassword = this.builder.group({
      email: new FormControl('',[Validators.required, Validators.email])
    })
  }

  ngOnInit() {
  }

  public campo(control: string) {
    return this.formPassword.get(control);
  }
  public fueTocado(control: string){
    return this.formPassword.get(control).touched;
  }



  public enviar(){

  }

}
