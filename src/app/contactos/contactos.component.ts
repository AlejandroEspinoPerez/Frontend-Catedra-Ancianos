import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DialogContactosComponent } from '../dialogContacto/dialog-contactos.component';
import { Contactos } from '../Models/contactos.model';
import { ContactosDetalleComponent } from '../contactos-detalles/contactos-detalle.component';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent {

  haveedit = true;
  haveadd = true;
  havedelete = true;
  accesData: any;
  mostrarAdicionar = false;
  mostrarDelete = false;
  displayedColumns: string[] = ['nombre_familiar', 'relacion', 'numero_telefono', 'genero', 'direccion','anciano_nombre', 'Acciones'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private toast: ToastrService, private api: ApiService) {
    this.setAccesPermission();
    if (this.api.getUserrole() == 'admin' || this.api.getUserrole() == 'trabajador') {
      this.mostrarAdicionar = true;
    }
    if (this.api.getUserrole() == 'admin') {
      this.mostrarDelete = true;
    }
    this.getAllContactos();
  }

  openDialog(): void {
    if (this.haveadd) {
      this.dialog.open(DialogContactosComponent, {
        width: '50%'
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Contacto agregado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getAllContactos();
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar');
    }
  }

  getAllContactos() {
    this.api.getAllContactos().subscribe({
      next: (res: Contactos[]) => {  // Asegúrate de que res sea de tipo Contactos[]
        console.log(res); // Verifica si 'direccion' y 'genero' están presentes
        this.dataSource = new MatTableDataSource(res);  // Cambia res.data a res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    });
  }


  editContacto(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogContactosComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getAllContactos();
          Swal.fire({
            icon: 'success',
            title: 'Contacto actualizado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        }
      });
    } else {
      this.toast.warning('No tienes permiso de editar los contactos');
    }
  }


  deleteContacto(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea borrar este contacto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteContacto(id).subscribe({
            next: (res) => {
              Swal.fire('¡Eliminado!', 'El contacto ha sido eliminado.', 'success');
              this.getAllContactos();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el contacto',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            }
          });
        }
      });
    } else {
      this.toast.warning('No tienes permisos para borrar contactos');
    }
  }

  openDetail(row: any): void {
    this.dialog.open(ContactosDetalleComponent, {
      width: '60%', // Puedes ajustar el ancho del modal a tu gusto
      data: row
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setAccesPermission() {
    this.api.getAccessbyRole(this.api.getUserrole(), 'residencia').subscribe(res => {
      this.accesData = res;
      if (this.accesData.length > 0) {
        this.haveadd = this.accesData[0].haveadd;
        this.haveedit = this.accesData[0].haveedit;
        this.havedelete = this.accesData[0].havedelete;
        this.getAllContactos();
      } else {
        this.toast.error("No tienes acceso");
      }
    });
  }
}
