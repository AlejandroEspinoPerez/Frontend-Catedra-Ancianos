import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-contactos',
  templateUrl: './dialog-contactos.component.html',
  styleUrls: ['./dialog-contactos.component.css']
})
export class DialogContactosComponent implements OnInit {

  contactoForm!: FormGroup;
  actionButton: string = "Adicionar";

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogContactosComponent>
  ) { }

  ngOnInit(): void {
    this.contactoForm = this.formBuilder.group({
      nombre_familiar: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      numero_telefono: ['', [Validators.required, Validators.pattern(/^[0-7]{8}$/)]],
      relacion: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      direccion: ['', Validators.required],
      genero: ['', Validators.required]
    });

    if (this.editData && this.editData.id) {
      this.actionButton = "Actualizar";
      this.contactoForm.patchValue({
        nombre_familiar: this.editData.nombre_familiar,
        numero_telefono: this.editData.numero_telefono,
        relacion: this.editData.relacion,
        direccion: this.editData.direccion,
        genero: this.editData.genero
      });
    }
  }

  addContactos() {
    if (this.contactoForm.valid) {
      const contactoData = {
        ...this.contactoForm.value,
        anciano: this.editData?.ancianoId
      };

      if (this.editData && this.editData.id) {
        this.updateContactos(contactoData);
      } else {
        this.createContactos(contactoData);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa los campos correctamente',
      });
    }
  }

  createContactos(contactoData: any) {
    this.api.postContactoEmergencia(contactoData).subscribe({
      next: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contacto agregado correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.contactoForm.reset();
        this.dialogRef.close('save');
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar el contacto',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }

  updateContactos(contactoData: any) {
    this.api.updateContacto(this.editData.id, contactoData).subscribe({
      next: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contacto actualizado correctamente !!',
          showConfirmButton: false,
          timer: 1000
        });
        this.contactoForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el contacto',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  }
}
