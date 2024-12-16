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
  actionButton: string = "Adicionar";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogAncianoComponent>) {
  }

  ngOnInit(): void {
    this.ancianoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Solo letras
      apellidos: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // Solo letras
      edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      direccion: ['', Validators.required],
      genero: ['', Validators.required],
      numero_telefono: ['', [Validators.required, Validators.pattern('^[0-7]{8,15}$')]], // Solo números, entre 7 y 15 dígitos
    });

    if (this.editData) {
      this.actionButton = "Actualizar";
      this.ancianoForm.patchValue(this.editData);
    }
  }

  addAnciano() {
    if (this.ancianoForm.valid) {
      if (!this.editData) {
        this.api.postAnciano(this.ancianoForm.value).subscribe({
          next: () => {
            this.ancianoForm.reset();
            this.dialogRef.close('save');
            Swal.fire('Anciano agregado !!', '', 'success');
          },
          error: () => {
            Swal.fire('Error al agregar el anciano', '', 'error');
          }
        });
      } else {
        this.updateAnciano();
      }
    }
  }

  updateAnciano() {
    this.api.putAnciano(this.ancianoForm.value, this.editData.id).subscribe({
      next: () => {
        Swal.fire('Anciano actualizado !!', '', 'success');
        this.ancianoForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        Swal.fire('Error al actualizar el anciano', '', 'error');
      }
    });
  }
}
