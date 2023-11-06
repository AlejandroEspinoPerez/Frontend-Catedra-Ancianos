import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DialogAptoComponent } from '../dialog-apto/dialog-apto.component';

@Component({
  selector: 'app-residencia',
  templateUrl: './residencia.component.html',
  styleUrls: ['./residencia.component.scss']
})
export class ResidenciaComponent{

    haveedit=false;
    haveadd=false;
    havedelete=false;
    accesData:any;
    mostrarAdicionar=false;
    mostarDelete=false;

  displayedColumns: string[] = ['numeroFacultad','numeroEdificio', 'cantApto', 'nombreJefe', 'Acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private router:Router ,private toast:ToastrService, private api: ApiService) {
    this.setAccesPermission();
    if (this.api.getUserrole() == 'admin' ||this.api.getUserrole() == 'trabajador') {
      this.mostrarAdicionar = true;
    }
    if (this.api.getUserrole() == 'admin') {
      this.mostarDelete = true;
    }
    this.getAllResidencias();
  }


  openDialogResidencia(): void {

    if(this.haveadd){


    this.dialog.open(DialogComponent, {
      width: '50%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Residencia agregada correctamente'
        })
        this.getAllResidencias();
      }
    })
    }else{
      this.toast.warning("No tienes permisos de agregar residencias")
    }
  }

  openDialogApartamento(): void {


    if (this.haveadd) {

    this.dialog.open(DialogAptoComponent, {
      width: '50%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Apartamento agregado correctamente'
        })

      }
    })
    } else {
        this.toast.warning('No tienes permisos de agregar')
    }
  }



  getAllResidencias() {
    this.api.getResidencia().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error: () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos'
        })
      }
    })
  }

  editResidencia(row: any) {
    if(this.haveedit){

    this.dialog.open(DialogComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllResidencias();
      }
    })
    }else{
      this.toast.warning("No tienes permiso de editar las residencias");
    }
  }

  deleteResidencia(id: number) {


    if(this.havedelete){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    Swal.fire({
      title: 'Esta Seguro ?',
      text: "Decea borrar esta Residencia",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Borrado!',
          'La Residencia ha sido eliminada.',
          'success'
        )
        this.api.deleteResidencia(id).subscribe({
          next: (res) => {
            this.getAllResidencias();
          },
          error: () => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'error',
              title: 'Error al capturar los datos'
            })

          }
        })

      }
    })
    }else{
    this.toast.warning("No tienes permisos de borrar residencias")
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

  setAccesPermission(){
    this.api.getAccessbyRole(this.api.getUserrole(),'residencia').subscribe(res=>{
      this.accesData=res;
      console.log(this.accesData);
      if(this.accesData.length>0){
        this.haveadd=this.accesData[0].haveadd;
        this.haveedit=this.accesData[0].haveedit;
        this.havedelete=this.accesData[0].havedelete;
        this.getAllResidencias();
      }else{
        this.toast.error("Non tienes acceso");
        this.router.navigate(['']);
      }
    });
  }

}
