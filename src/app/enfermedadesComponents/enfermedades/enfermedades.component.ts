import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DialogEnfermedadComponent } from '../dialog-enfermedad/dialog-enfermedad.component';
import { EnfermedadesDetalleComponent } from '../enfermedades-detalles/enfermedades-detalle.component';
import { PermissionsService } from '../../services/permissions.service';
@Component({
  selector: 'app-enfermedades',
  templateUrl: './enfermedades.component.html',
  styleUrls: ['./enfermedades.component.scss']
})
export class EnfermedadesComponent implements OnInit {
  haveedit = true;
  haveadd = true;
  havedelete = true;
  accesData: any;
  mostrarAdicionar = false;
  mostrarDelete = false;
  showEditButton = false;
  displayedColumns: string[] = ['nombre_enfermedad', 'fecha_diagnostico', 'descripcion', 'medicamento', 'anciano_nombre', 'Acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
    private api: ApiService,
    private permissionsService: PermissionsService,
  ) {
    this.setAccesPermission();
    if (this.api.getUserrole() == 'admin' || this.api.getUserrole() == 'trabajador') {
      this.mostrarAdicionar = true;
    }
    if (this.api.getUserrole() == 'admin') {
      this.mostrarDelete = true;
    }
  }

  ngOnInit() {
    this.getAllEnfermedades();
  }

  openDialog(): void {
    if (this.haveadd) {
      this.dialog.open(DialogEnfermedadComponent, {
        width: '50%'
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          Swal.fire({
            icon: 'success',
            title: 'Enfermedad agregada correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getAllEnfermedades();
        }
      });
    } else {
      this.toast.warning('No tienes permisos para agregar');
    }
  }

  getAllEnfermedades() {
    this.api.getAllEnfermedades().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
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

  editEnfermedad(row: any) {
    if (this.haveedit) {
      this.dialog.open(DialogEnfermedadComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
        if (val === 'update') {
          this.getAllEnfermedades();
        }
      });
    } else {
      this.toast.warning('No tienes permisos para editar enfermedades');
    }
  }

  deleteEnfermedad(id: number) {
    if (this.havedelete) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Desea borrar esta enfermedad",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteEnfermedad(id).subscribe({
            next: () => {
              Swal.fire('Borrado!', 'La enfermedad ha sido eliminada.', 'success');
              this.getAllEnfermedades();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error al borrar los datos',
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
      this.toast.warning('No tienes permisos para borrar enfermedades');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDetail(row: any): void {
    this.dialog.open(EnfermedadesDetalleComponent, {
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
          this.getAllEnfermedades();  // Obtener ancianos solo si hay permisos
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
    this.showEditButton = this.haveedit;

    console.log('Add:', this.haveadd, 'Edit:', this.haveedit, 'Delete:', this.havedelete);

  }

}
