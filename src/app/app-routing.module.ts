import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BecadoComponent } from './becado/becado.component';
import { SettingsComponent } from './settings/settings.component';
import { ResidenciaComponent } from './residencia/residencia.component';
import { ApartamentoComponent } from './apartamento/apartamento.component';
import { LoginComponent } from './login/login.component';
import { BodyComponent } from "./body/body.component";
import { RegisterComponent } from "./register/register.component";

import { UserlistingComponent } from "./userlisting/userlisting.component";
import { AuthGuard } from './guard/auth.guard';
import { AncianoComponent } from './anciano/anciano.component';
import { ContactosComponent } from './contactos/contactos.component';
import { EnfermedadesComponent } from './enfermedades/enfermedades.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard',title:'Dashboard', component: DashboardComponent },
  { path: 'residencia', title: 'Residencia', component: ResidenciaComponent, canActivate: [AuthGuard] },
  { path: 'anciano', title: 'Anciano', component: AncianoComponent, canActivate: [AuthGuard] },
  { path: 'contactos', title: 'Contactos', component: ContactosComponent, canActivate: [AuthGuard] },
  { path: 'enfermedades', title: 'Enfermedades', component: EnfermedadesComponent, canActivate: [AuthGuard] },
  { path: 'becado',title:'Becados', component: BecadoComponent, canActivate: [AuthGuard] },
  { path: 'settings',title:'Dashboard', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'apartamento',title:'Apartamentos', component: ApartamentoComponent, canActivate: [AuthGuard] },
  { path: 'login',title:'Login', component: LoginComponent },
  { path: 'register',title:'Registro', component: RegisterComponent },
  { path: 'userlisting',title:'Usuarios', component: UserlistingComponent, canActivate: [AuthGuard] },
  { path: '404',title:'Error', component: PageNotFoundComponent },
    { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

