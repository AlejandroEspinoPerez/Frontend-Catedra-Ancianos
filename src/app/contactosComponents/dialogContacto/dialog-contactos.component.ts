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

  contactoForm!: FormGroup; // Cambiar el nombre a contactoForm
  actionButton: string = "SAVE"; // Cambia el nombre de actionButton si es necesario

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogContactosComponent>
  ) { }

  ngOnInit(): void {
    this.contactoForm = this.formBuilder.group({
      nombre_familiar: ['', Validators.required],
      numero_telefono: ['', Validators.required], // Asegúrate de que sea un número
      relacion: ['', Validators.required],
      direccion: ['', Validators.required], // Campo de dirección
      genero: ['', Validators.required]      // Campo de género
    });

    // Verifica si los datos de edición están presentes
    if (this.editData && this.editData.id) {
      this.actionButton = "UPDATE";  // Cambia el texto del botón a "UPDATE" en caso de edición
      this.contactoForm.patchValue({
        nombre_familiar: this.editData.nombre_familiar,
        numero_telefono: this.editData.numero_telefono,
        relacion: this.editData.relacion,
        direccion: this.editData.direccion,  // Agregar dirección
        genero: this.editData.genero
      });
    }
  }


  addContactos() {
    if (this.contactoForm.valid) {
      const contactoData = {
        nombre_familiar: this.contactoForm.value.nombre_familiar,
        numero_telefono: this.contactoForm.value.numero_telefono,
        relacion: this.contactoForm.value.relacion,
        direccion: this.contactoForm.value.direccion, // Agregar dirección
        genero: this.contactoForm.value.genero
      };

      // Si hay `editData`, se está editando un contacto existente
      if (this.editData && this.editData.id) {
        this.updateContactos(contactoData);  // Llamamos a la función para actualizar el contacto
      } else {
        this.createContactos(contactoData);  // Llamamos a la función para crear un nuevo contacto
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
    const ancianoId = this.editData?.ancianoId; // Obtén el ancianoId

    if (ancianoId) {
      // Incluye el ancianoId en contactoData
      contactoData.anciano = ancianoId;  // Agregar el ID del anciano

      this.api.postContactoEmergencia(contactoData).subscribe({  // Cambia aquí
        next: (res) => {
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
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al agregar el contacto',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el ID del anciano para agregar el contacto',
      });
    }
  }

  updateContactos(contactoData: any) {
    const ancianoId = this.editData?.ancianoId; // Obtén el ancianoId

    if (ancianoId) {
      contactoData.anciano = ancianoId;  // Agregar el ID del anciano

      this.api.updateContacto(this.editData.id, contactoData).subscribe({
        next: (res) => {
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
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el contacto',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el ID del anciano para actualizar el contacto',
      });
    }
  }


}
