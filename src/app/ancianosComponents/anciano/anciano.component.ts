import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAncianoComponent } from '../dialog-anciano/dialog-anciano.component';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogEnfermedadComponent } from '../../enfermedadesComponents/dialog-enfermedad/dialog-enfermedad.component';
import { Anciano } from '../../Models/anciano.model'
import { DialogContactosComponent } from '../../contactosComponents/dialogContacto/dialog-contactos.component';
import { AncianoDetalleComponent } from '../anciano-detalles/anciano-detalle.component';
import { PermissionsService } from '../../services/permissions.service'; // Servicio de permisos



@Component({
  selector: 'app-anciano',
  templateUrl: './anciano.component.html',
  styleUrls: ['./anciano.component.scss']
})
export class AncianoComponent {

  haveedit = false;
  haveadd = false;
  havedelete = false;

  showAddButton = false;
  showEditButton = false;
  showDeleteButton = false;

  accesData: any;
  mostrarAdicionar = false;
  mostarDelete = false;

  displayedColumns: string[] = ['nombre', 'apellidos', 'edad', 'direccion', 'genero', 'numero_telefono', 'enfermedades', 'acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private permissionsService: PermissionsService, private toast: ToastrService, private api: ApiService) {
    this.setAccesPermission();
    if (this.api.getUserrole() == 'admin' || this.api.getUserrole() == 'trabajador') {
      this.mostrarAdicionar = true;
    }
    if (this.api.getUserrole() == 'admin') {
      this.mostarDelete = true;
    }
    this.getAllAncianos();
  }


  openDialogAnciano(): void {
    if (this.haveadd) {
      this.dialog.open(DialogAncianoComponent, {
        width: '50%',
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Anciano agregado correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getAllAncianos();
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar ancianos');
    }
  }

  openDialogEnfermedad(ancianoId: number): void {
    if (this.haveadd) {
      const dialogRef = this.dialog.open(DialogEnfermedadComponent, {
        width: '50%',
        data: { ancianoId } // Pasar el ID del anciano
      });

      dialogRef.afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Enfermedad agregada correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getAllAncianos();
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar enfermedades');
    }
  }


  openDialogContactos(ancianoId: number): void {
    if (this.haveadd) {
      const dialogRef = this.dialog.open(DialogContactosComponent, {
        width: '50%',
        data: { ancianoId } // Pasar el ID del anciano
      }
      );

      dialogRef.afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Contacto agregado correctamente',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          this.getAllAncianos();
        }
      });
    } else {
      this.toast.warning('No tienes permisos de agregar contactos');
    }
  }


  getAllAncianos() {
    this.api.getAllAncianos().subscribe({
      next: (res: Anciano[]) => {  // Ahora se espera correctamente un array de Anciano
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      }
    });
  }


  editAnciano(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogAncianoComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getAllAncianos();
        }
      });
    } else {
      this.toast.warning('No tienes permiso de editar los ancianos');
    }
  }

  deleteAnciano(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Está seguro?',
        text: 'Desea borrar este anciano',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'No, cancelar',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteAnciano(id).subscribe({
            next: () => {
              Swal.fire('Borrado', 'El anciano ha sido eliminado.', 'success');
              this.getAllAncianos();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al borrar los datos',
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
              });
            }
          });
        }
      });
    } else {
      this.toast.warning('No tienes permisos para borrar ancianos');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      arguments;
    }
  }

  openDetail(row: any): void {
    this.dialog.open(AncianoDetalleComponent, {
      width: '60%', // Puedes ajustar el ancho del modal a tu gusto
      data: row
    });
  }

  // Este método ahora utilizará el servicio de permisos
  setAccesPermission() {
    const userRole = this.api.getUserrole();
    const menu = 'residencia'; // Puedes cambiar el menú según el componente

    // Llamada al servicio para obtener los permisos
    this.permissionsService.getPermissions().subscribe({
      next: (permissions) => {
        const access = permissions.find(p => p.role === userRole && p.menu === menu);
        if (access) {
          this.haveadd = access.haveadd;
          this.haveedit = access.haveedit;
          this.havedelete = access.havedelete;

          // Actualiza los botones basados en los permisos
          this.updateUIBasedOnPermissions();
          this.getAllAncianos();  // Obtener ancianos solo si hay permisos
        } else {
          this.toast.error('No tienes acceso a este menú');
          this.router.navigate(['']); // Redireccionar si no hay acceso
        }
      },
      error: (err) => {
        console.error('Error al obtener accesos:', err);
      }
    });
  }


  updateUIBasedOnPermissions() {
    this.showAddButton = this.haveadd;
    this.showEditButton = this.haveedit;
    this.showDeleteButton = this.havedelete;
    console.log('Add:', this.haveadd, 'Edit:', this.haveedit, 'Delete:', this.havedelete);

  }




}
