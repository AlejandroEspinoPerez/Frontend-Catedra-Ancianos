import { Component, Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-becado',
  templateUrl: './dialog-becado.component.html',
  styleUrls: ['./dialog-becado.component.scss']
})
export class DialogBecadoComponent {



    becadoForm !:FormGroup;
    actionButton:string="SAVE";
    texto:string="";

  constructor(private formBuilder:FormBuilder,
  private api:ApiService,private toast:ToastrService,
  @Inject(MAT_DIALOG_DATA)public editData:any,
  private dialogRef:MatDialogRef<DialogBecadoComponent> ) {
  }

    tamano=11;
    tamanoValido=false;
    validdarTamano(){
      if (this.texto.length===this.tamano) {
          this.tamanoValido=false;
      } else {
          this.tamanoValido=true;
      }
    }

  ngOnInit(): void {
    this.becadoForm=this.formBuilder.group({
      nombreBecado:['',Validators.required],
      numeroCI:['',Validators.required],
      ano:['',Validators.required],
      evaluacion:['',Validators.required]
    });
    if (this.editData) {
      this.actionButton="UPDATE";
      this.becadoForm.controls['nombreBecado'].setValue(this.editData.nombreBecado);
      this.becadoForm.controls['numeroCI'].setValue(parseInt(this.editData.numeroCI));
      this.becadoForm.controls['ano'].setValue(this.editData.ano);
      this.becadoForm.controls['evaluacion'].setValue(this.editData.evaluacion);
    }

  }

  addBecado(){
    if (!this.editData) {
      if(this.becadoForm.valid){
      this.api.postBecado(this.becadoForm.value)
      .subscribe({
        next:(res)=>{
          console.log(res);

          this.becadoForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          this.toast.error('Error al agregar el becado');
        }
      })
    }
    } else{
    this.updateBecado();
    }
  }


  updateBecado(){
    this.api.putBecado(this.becadoForm.value,this.editData.id).subscribe({
      next:(res)=>{
          Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Becado actualizada !!',
  showConfirmButton: false,
  timer: 1000
})
        this.becadoForm.reset();
        this.dialogRef.close('update');
      },error:(e)=>{
        Swal.fire({
  position: 'top-end',
  icon: 'error',
  title: 'Error al actualizar el Becado',
  showConfirmButton: false,
  timer: 1000});
      }
    })
  }


}
