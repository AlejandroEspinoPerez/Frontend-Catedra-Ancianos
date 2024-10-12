import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contactos-detalle',
  templateUrl: './contactos-detalle.component.html',
  styleUrls: ['./contactos-detalle.component.scss']
})
export class ContactosDetalleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
