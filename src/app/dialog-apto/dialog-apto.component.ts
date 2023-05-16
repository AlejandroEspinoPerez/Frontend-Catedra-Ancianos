import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-apto',
  templateUrl: './dialog-apto.component.html',
  styleUrls: ['./dialog-apto.component.css']
})
export class DialogAptoComponent {

  aptoForm !:FormGroup;
  actionButton:string="SAVE";

  constructor(private formBuilder:FormBuilder,
  private api:ApiService,private toast:ToastrService,
  @Inject(MAT_DIALOG_DATA)public editData:any,
  private dialogRef:MatDialogRef<DialogAptoComponent> ) {
  }
 

  ngOnInit(): void {
    this.aptoForm=this.formBuilder.group({
      numeroApartamento:['',Validators.required],
      nombreJefe:['',Validators.required],
      capacidadApto:['',Validators.required]
    });
    if (this.editData) {
      this.actionButton="UPDATE";
      this.aptoForm.controls['numeroApartamento'].setValue(this.editData.numeroApartamento);
      this.aptoForm.controls['nombreJefe'].setValue(this.editData.nombreJefe);
      this.aptoForm.controls['capacidadApto'].setValue(this.editData.capacidadApto);
    }

  }

  addApto(){
    if (!this.editData) {
      if(this.aptoForm.valid){
      this.api.postApto(this.aptoForm.value)
      .subscribe({
        next:(res)=>{

          this.aptoForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          this.toast.error('Error al agregar el apto');
        }
      })
    }
    } else{
    this.updateApto();
    }
  }


  updateApto(){
    this.api.putApto(this.aptoForm.value,this.editData.id).subscribe({
      next:(res)=>{
          Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Residencia actualizada !!',
  showConfirmButton: false,
  timer: 1000
})
        this.aptoForm.reset();
        this.dialogRef.close('update');
      },error:(e)=>{
        Swal.fire({
  position: 'top-end',
  icon: 'error',
  title: 'error al actualizar la residencia',
  showConfirmButton: false,
  timer: 1000});
      }
    })
  }



}


