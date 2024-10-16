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
  actionButton: string = "SAVE";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogEnfermedadComponent>
  ) { }

  ngOnInit(): void {
    // Actualizamos el formulario con los nuevos campos: descripcion y medicamento
    this.enfermedadForm = this.formBuilder.group({
      nombre_enfermedad: ['', Validators.required],
      fecha_diagnostico: ['', Validators.required],
      descripcion: ['', Validators.required],  // Nuevo campo
      medicamento: ['', Validators.required]   // Nuevo campo
    });

    if (this.editData && this.editData.id) { // Si editData contiene id, estamos en modo edición
      this.actionButton = "UPDATE";
      this.enfermedadForm.patchValue({
        nombre_enfermedad: this.editData.nombre_enfermedad,
        fecha_diagnostico: this.editData.fecha_diagnostico,
        descripcion: this.editData.descripcion,      // Rellenar el campo en modo edición
        medicamento: this.editData.medicamento       // Rellenar el campo en modo edición
      });
    }
  }

  addEnfermedad() {
    if (this.enfermedadForm.valid) {
      const enfermedadData = {
        nombre_enfermedad: this.enfermedadForm.value.nombre_enfermedad,
        fecha_diagnostico: new Date(this.enfermedadForm.value.fecha_diagnostico).toISOString().split('T')[0],
        descripcion: this.enfermedadForm.value.descripcion,  // Agregar descripción
        medicamento: this.enfermedadForm.value.medicamento   // Agregar medicamento
      };

      if (this.editData && this.editData.id) {
        this.updateEnfermedad(this.editData.id, enfermedadData); // Llamar a la función de actualización
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
