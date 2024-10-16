import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-anciano-detalle',
  templateUrl: './anciano-detalle.component.html',
  styleUrls: ['./anciano-detalle.component.scss']
})
export class AncianoDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
