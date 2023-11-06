import { OnInit,AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DialogBecadoComponent } from '../dialog-becado/dialog-becado.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-becado',
  templateUrl: './becado.component.html',
  styleUrls: ['./becado.component.scss']
})
export class BecadoComponent {

    haveedit=false;
    haveadd=false;
    havedelete=false;
    accesData:any;
    mostrarAdicionar=false;
    mostrarDelete=false;
    displayedColumns: string[] = ['nombreBecado', 'numeroCI', 'ano','evaluacion', 'Acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog,private router:Router ,private toast:ToastrService, private api: ApiService){
      this.setAccesPermission();
      if (this.api.getUserrole() == 'admin' ||this.api.getUserrole() == 'trabajador') {
        this.mostrarAdicionar = true;
      }
      if (this.api.getUserrole() == 'admin') {
        this.mostrarDelete = true;
      }
  }



  openDialog(): void {


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
        this.getAllBecado();
      }
    })
    } else {
        this.toast.warning('No tienes permisos de agregar')
    }
  }


  getAllBecado() {
    this.api.getBecado().subscribe({
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

  editBecado(row: any) {
    if(this.haveedit){

    this.dialog.open(DialogBecadoComponent, { width: '50%', data: row }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllBecado();
      }
    })
    }else{
      this.toast.warning("No tienes permiso de editar los becados");
    }
  }

    deleteBecado(id: number) {
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
      text: "Decea borrar este Becado",
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
          'El becado  ha sido eliminado.',
          'success'
        )
        this.api.deleteBecado(id).subscribe({
          next: (res) => {
            this.getAllBecado();
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
    this.toast.warning("No tienes permisos de borrar becados")
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
    this.api.getAccessbyRole(this.api.getUserrole(),'becado').subscribe(res=>{
      this.accesData=res;
      console.log(this.accesData);
      if(this.accesData.length>0){
        console.log(this.accesData[0].haveadd);

        this.haveadd=this.accesData[0].haveadd;
        this.haveedit=this.accesData[0].haveedit;
        this.havedelete=this.accesData[0].havedelete;
        this.getAllBecado();
      }else{
        this.toast.error("No tienes acceso");
        this.router.navigate(['']);
      }
    });
  }
}
