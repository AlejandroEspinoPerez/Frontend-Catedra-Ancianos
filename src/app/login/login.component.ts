import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  userdata:any;
  constructor(private builder: FormBuilder,private toast:ToastrService ,private service:ApiService,private router:Router) {
      sessionStorage.clear();
  }

  loginform=this.builder.group({
    username:this.builder.control('',Validators.required),
      password:this.builder.control('',Validators.required),
  })


  prosederLogin(){
    console.log('loguin function')
    if(this.loginform.valid){

      
    this.service.getbycode(this.loginform.value.username).subscribe(res=>{
        this.userdata=res;
        console.log(this.userdata);
        if(this.userdata.password===this.loginform.value.password){
            if(this.userdata.isactive){
                sessionStorage.setItem('username',this.userdata.id);
                sessionStorage.setItem('userrole',this.userdata.role);
                this.router.navigate(['dashboard']);

            }else{
              this.toast.error('Por favor contactar al admin','No esta activado aun')
            }
        }else{
          this.toast.error('Contraseña incorrecta')
        }
    });
  }

}}
