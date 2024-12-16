import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-enfermedad',
  templateUrl: './dialog-enfermedad.component.html',
  styleUrls: ['./dialog-enfermedad.component.scss']
})
export class DialogEnfermedadComponent implements OnInit {

  enfermedadForm!: FormGroup;
  actionButton: string = "Adicionar";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogEnfermedadComponent>
  ) { }

  ngOnInit(): void {
    // Formulario con validaciones
    this.enfermedadForm = this.formBuilder.group({
      nombre_enfermedad: ['', [Validators.required, Validators.minLength(3)]],
      fecha_diagnostico: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]], // Validación para mínimo 10 caracteres
      medicamento: ['', [Validators.required, Validators.minLength(3)]]    // Validación para mínimo 3 caracteres
    });

    if (this.editData && this.editData.id) {
      this.actionButton = "Actualizar";
      this.enfermedadForm.patchValue({
        nombre_enfermedad: this.editData.nombre_enfermedad,
        fecha_diagnostico: this.editData.fecha_diagnostico,
        descripcion: this.editData.descripcion,
        medicamento: this.editData.medicamento
      });
    }
  }

  addEnfermedad() {
    if (this.enfermedadForm.valid) {
      const enfermedadData = {
        nombre_enfermedad: this.enfermedadForm.value.nombre_enfermedad,
        fecha_diagnostico: new Date(this.enfermedadForm.value.fecha_diagnostico).toISOString().split('T')[0],
        descripcion: this.enfermedadForm.value.descripcion,
        medicamento: this.enfermedadForm.value.medicamento
      };

      if (this.editData && this.editData.id) {
        this.updateEnfermedad(this.editData.id, enfermedadData);
      } else {
        const ancianoId = this.editData.ancianoId;
        this.api.postEnfermedad(ancianoId, enfermedadData).subscribe({
          next: (res) => {
            this.enfermedadForm.reset();
            this.dialogRef.close('save');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Enfermedad agregada correctamente !!',
              showConfirmButton: false,
              timer: 1000
            });
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al agregar la enfermedad',
              showConfirmButton: false,
              timer: 1000
            });
          }
        });
      }
    } else {
      // Muestra error si el formulario no es válido
      this.enfermedadForm.markAllAsTouched();
    }
  }

  updateEnfermedad(enfermedadId: number, enfermedadData: any) {
    this.api.updateEnfermedad(enfermedadId, enfermedadData).subscribe({
      next: (res) => {
        this.enfermedadForm.reset();
        this.dialogRef.close('update');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Enfermedad actualizada correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
      },
      error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar la enfermedad',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
