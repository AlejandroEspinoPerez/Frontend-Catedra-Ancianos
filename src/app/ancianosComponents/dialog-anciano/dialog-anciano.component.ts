import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-anciano.component.html',
  styleUrls: ['./dialog-anciano.component.scss']
})
export class DialogAncianoComponent implements OnInit {

  ancianoForm!: FormGroup;
  actionButton: string = "SAVE";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogAncianoComponent>) {
  }

  ngOnInit(): void {
    this.ancianoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      direccion: ['', Validators.required],
      genero: ['', Validators.required],
      numero_telefono: ['', Validators.required],// Puedes usar un mat-select para seleccionar género
    });

    if (this.editData) {
      this.actionButton = "UPDATE";
      this.ancianoForm.patchValue({
        nombre: this.editData.nombre,
        apellidos: this.editData.apellidos,
        edad: this.editData.edad,
        direccion: this.editData.direccion,
        genero: this.editData.genero,
        numero_telefono: this.editData.numero_telefono,
      });
    }
  }

  addAnciano() {
    if (!this.editData) {
      if (this.ancianoForm.valid) {
        this.api.postAnciano(this.ancianoForm.value).subscribe({
          next: (res) => {
            this.ancianoForm.reset();
            this.dialogRef.close('save');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Anciano agregado !!',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al agregar el anciano',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    } else {
      this.updateAnciano();
    }
  }

  updateAnciano() {
    this.api.putAnciano(this.ancianoForm.value, this.editData.id).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Anciano actualizado !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.ancianoForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar el anciano',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
