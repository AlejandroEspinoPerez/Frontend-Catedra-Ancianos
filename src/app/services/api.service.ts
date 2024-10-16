import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Anciano } from '../Models/anciano.model';  // Asegúrate de importar tu modelo correctamente
import { Contactos } from '../Models/contactos.model';
import { Enfermedades } from '../Models/enfermedades.model copy';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  // NUEVAS URLs para Cátedra Adulto Mayor======================================================================
  apiurlUser = 'http://localhost:8000/api/users/'; // Cambia esta URL a tu endpoint real

  apiurlAncianos = 'http://localhost:8000/api/ancianos/';
  apiurlContactosEmergencia = 'http://localhost:8000/api/contactos/';
  apiurlEnfermedades = 'http://localhost:8000/api/enfermedades/';

  // Métodos para consumir la API de adulto mayor===========================================================
  // Ancianos
  getAllAncianos(): Observable<Anciano[]> {  // Especificamos que la respuesta es un array de Anciano
    return this.http.get<Anciano[]>(this.apiurlAncianos);
  }

  postAnciano(data: any) {
    return this.http.post<any>(this.apiurlAncianos, data);
  }

  putAnciano(data: any, id: number) {
    return this.http.put<any>(`${this.apiurlAncianos}${id}/`, data);
  }

  deleteAnciano(id: number) {
    return this.http.delete<any>(`${this.apiurlAncianos}${id}/`);
  }



  // Contactos de emergencia
  getAllContactos(): Observable<Contactos[]> {  // Especificamos que la respuesta es un array de Anciano
    return this.http.get<Contactos[]>(this.apiurlContactosEmergencia);
  }

  // Agregar contacto a un anciano específico
  postContactoEmergencia(contactoData: any) {
    // Asumiendo que contactoData ya incluye la propiedad 'anciano' con el ID del anciano
    return this.http.post<any>(`${this.apiurlAncianos}${contactoData.anciano}/agregar-contacto/`, contactoData);
  }

  // Actualizar contacto de emergencia
  updateContacto(contactoId: number, contactoData: any) {
    return this.http.put<any>(`${this.apiurlContactosEmergencia}${contactoId}/`, contactoData);
  }


  // Eliminar contacto de emergencia
  deleteContacto(contactoId: number) {
    return this.http.delete<any>(`${this.apiurlContactosEmergencia}${contactoId}/`);
  }


  // Enfermedades=======================================
  // Contactos de emergencia
  getAllEnfermedades(): Observable<Enfermedades[]> {  // Especificamos que la respuesta es un array de Anciano
    return this.http.get<Enfermedades[]>(this.apiurlEnfermedades);
  }

  // apiurlAncianos ya tiene la base del URL
  postEnfermedad(ancianoId: number, enfermedadData: any) {
    return this.http.post<any>(`${this.apiurlAncianos}${ancianoId}/agregar-enfermedad/`, enfermedadData);
  }

  // Agregar método para actualizar una enfermedad
  updateEnfermedad(enfermedadId: number, enfermedadData: any) {
    return this.http.put<any>(`${this.apiurlEnfermedades}${enfermedadId}/`, enfermedadData);
  }

  // Eliminar contacto de emergencia
  deleteEnfermedad(enfermedadId: number) {
    return this.http.delete<any>(`${this.apiurlEnfermedades}${enfermedadId}/`);
  }


//  Métodos para manejar usuarios
  //Accesos a la user list ==============================
  postCantUser(data: any) {
    return this.http.post("http://localhost:8000/api/cantidades", data);
  }

  // Obtener todos los usuarios
  getAllUser(): Observable<any> {
    return this.http.get(this.apiurlUser);
  }

  // Obtener todos los roles
  getAllRole(): Observable<any> {
    return this.http.get("http://localhost:8000/api/roles/");
  }

  // Obtener usuario por código
  getbycode(code: any): Observable<any> {
    return this.http.get(`${this.apiurlUser}${code}/`);
  }

  // Registrar un nuevo usuario
  prosederRegister(data: any): Observable<any> {
    return this.http.post(this.apiurlUser, data);
  }

  // Actualizar un usuario existente
  updateUser(data: any, code: any): Observable<any> {
    return this.http.put<any>(`${this.apiurlUser}${code}/`, data);
  }

  // Obtener accesos por rol y menú
  getAccessbyRole(role: any, menu: any): Observable<any> {
    return this.http.get(`http://localhost:8000/api/roleaccess?role=${role}&menu=${menu}`);
  }

  // Verificar si el usuario está logueado
  IsloggedIn(): boolean {
    return sessionStorage.getItem('username') != null;
  }

  // Obtener rol del usuario desde el almacenamiento
  getUserrole(): string {
    return sessionStorage.getItem('userrole')?.toString() ?? '';
  }








  


  // //Accesos a la user list ==============================
  // postCantUser(data:any){
    //   return this.http.post("http://localhost:3000/cantidades",data);
    // }

    // getAllUser(){
      //   return this.http.get(this.apiurluser);
      // }
      // getAllRole(){
        //   return this.http.get(this.apiurlrole);
        // }
        // getbycode(code:any){
          //   return this.http.get(this.apiurluser+code);
          // }
  // prosederRegister(data:any){
  //   return this.http.post(this.apiurluser,data);
  // }
  // updateUser(data:any,code:any){
  //   return this.http.put<any>(this.apiurluser + code ,data);
  // }
  // IsloggedIn(){
  //   return sessionStorage.getItem('username')!=null;
  // }
  // getUserrole(){
  //   return sessionStorage.getItem('userrole')!=null?sessionStorage.getItem('userrole')?.toString():'';
  // }
  // //obtener los accesos por roles ===========================
  // getAccessbyRole(role:any,menu:any){
  //   return this.http.get('https://residencia.onrender.com/roleacces?role='+role+'&menu='+menu);
  // }

  apiurlBase='https://residencia.onrender.com/';
  //apiurluser='https://residencia.onrender.com/userList/';
  apiurlrole='https://residencia.onrender.com/role/';
  apiurlresidencia='https://residencia.onrender.com/residenciaList/';
  apiurlapto='https://residencia.onrender.com/apartamentoList/';
  apiurlbecado='https://residencia.onrender.com/becadoList/';
  apiurlcantidades = 'https://residencia.onrender.com/cantidades/';


        //Accesos a la residencia ==============================
        getAllResidencia(){
          return this.http.get(this.apiurlresidencia);
        }
        postResidencia(data:any){
          return this.http.post<any>(this.apiurlresidencia,data);
        }
        getResidencia(){
          return this.http.get<any>(this.apiurlresidencia);
        }
        putResidencia(data:any,id : number){
          return this.http.put<any>(this.apiurlresidencia+id ,data);
        }
        deleteResidencia(id:number){
            return this.http.delete<any>(this.apiurlresidencia+id);
        }



  //Accesos a la apto ==============================
  getAllApto(){
    return this.http.get(this.apiurlapto);
  }
  postApto(data:any){
    return this.http.post<any>(this.apiurlapto,data);
  }
  getApto(){
    return this.http.get<any>(this.apiurlapto);
  }
  putApto(data:any,id : number){
    return this.http.put<any>(this.apiurlapto+id ,data);
  }
  deleteApto(id:number){
      return this.http.delete<any>(this.apiurlapto+id);
  }





  //Accesos a becados ==============================
  getAllBecado(){
    return this.http.get(this.apiurlbecado);
  }
  postBecado(data:any){
    return this.http.post<any>(this.apiurlbecado,data);
  }
  getBecado(){
    return this.http.get<any>(this.apiurlbecado);
  }
  putBecado(data:any,id : number){
    return this.http.put<any>(this.apiurlbecado+id ,data);
  }
  deleteBecado(id:number){
      return this.http.delete<any>(this.apiurlbecado+id);
  }




  getAll(){
    return this.http.get(this.apiurlBase);
  }

  getTotalRegistros(entidad:string):Observable<number>{
    const url='${this.apiurlBase}/${entidad}?_total';
    return this.http.get<{_total:number}>(url).pipe(map(res=>res._total));

  }
}
