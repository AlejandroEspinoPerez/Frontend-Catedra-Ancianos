import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private permissionsUrl = '../../assets/permissions.json';  // Ruta al archivo JSON

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.permissionsUrl);
  }
}
