import { OnInit,AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DialogBecadoComponent } from '../dialog-becado/dialog-becado.component';
import { ToastrService } from 'ngx-toastr';
import { DialogAptoComponent } from '../dialog-apto/dialog-apto.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartamento',
  templateUrl: './apartamento.component.html',
  styleUrls: ['./apartamento.component.css']
})
export class ApartamentoComponent {

    haveedit=false;
    haveadd=false;
    havedelete=false;
    accesData:any;
    mostrarDelete=false;

    displayedColumns: string[] = ['numeroApto', 'cantBecados', 'nombreJefe','capacidadApto','disponibilidadApto','evaluacionApto', 'Acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog,private router:Router ,private toast:ToastrService, private api: ApiService){
      this.setAccesPermission();
      if (this.api.getUserrole() == 'admin') {
        this.mostrarDelete = true;
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
        this.getAllAptos();
      }
    })
    } else {
        this.toast.warning('No tienes permisos de agregar')
    }
  }


  openDialogBecado(): void {


    if (this.haveadd) {

    this.dialog.open(DialogBecadoComponent, {
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
          title: 'Becado agregado correctamente'
        })
      }
    })
    } else {
        this.toast.warning('No tienes permisos de agregar')
    }
  }


  getAllAptos() {
    this.api.getApto().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  editApto(row: any) {
    if(this.haveedit){

    this.dialog.open(DialogAptoComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllAptos();
      }
    })
    }else{
      this.toast.warning("No tienes permiso de editar las residencias");
    }
  }

    deleteApto(id: number) {
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
      text: "Decea borrar este Apartamento",
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
          'El apartemanto a sido eliminado con exito.',
          'success'
        )
        this.api.deleteApto(id).subscribe({
          next: (res) => {
            this.getAllAptos();
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
    this.toast.warning("No tienes permisos de borrar los apartamentos")
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
    this.api.getAccessbyRole(this.api.getUserrole(),'apartamento').subscribe(res=>{
      this.accesData=res;
      console.log(this.accesData);
      if(this.accesData.length>0){
        console.log(this.accesData[0].haveadd);

        this.haveadd=this.accesData[0].haveadd;
        this.haveedit=this.accesData[0].haveedit;
        this.havedelete=this.accesData[0].havedelete;
        this.getAllAptos();
      }else{
        this.toast.error("No tienes acceso");
        this.router.navigate(['']);
      }
    });
  }
}
