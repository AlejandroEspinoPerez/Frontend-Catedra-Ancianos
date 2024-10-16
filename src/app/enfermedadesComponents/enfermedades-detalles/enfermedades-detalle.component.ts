import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-anciano-detalle',
  templateUrl: './enfermedades-detalle.component.html',
  styleUrls: ['./enfermedades-detalle.component.scss']
})
export class EnfermedadesDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
