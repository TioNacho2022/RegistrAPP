import { Component, OnInit } from '@angular/core';
import { ApiBaseService } from '../servicio/api-base.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  constructor( public api:ApiBaseService){}

  ngOnInit() {
    this.api.alumnos(1);
  }

  public buscar(){
    this.api.alumnos(1);
  }

}
