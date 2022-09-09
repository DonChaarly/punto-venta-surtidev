import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Empleados } from '../models/Empleados.model';
import { Empresas } from '../models/Empresas.model';
import { Roles } from '../models/Roles.model';
import { Usuarios } from '../models/Usuarios.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private urlBase = "http://localhost:8080/empleados";
  private httpHeaders = new HttpHeaders({'Content-type': "application/json"});

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  mandarError(e: any):Observable<any>{
    if(e.status == 400 || e.status == 401){
      return throwError(() => e);
    }
    if(e.error.message){
      console.log(e.error.message);
    }
    return throwError(() => e);
  }


  /*-----------------------------------  USUARIOS  ---------------------------------------------------------- */

  getUsuarios(): Observable<any>{
    return this.http.get<Usuarios[]>(this.urlBase + '/usuarios/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getUsuario(id: number): Observable<any>{
    return this.http.get<Usuarios>(`${this.urlBase}/usuario/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }
  getUsuarioByName(username: string): Observable<any>{
    return this.http.get<Usuarios>(`${this.urlBase}/usuario/nombre/${username}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createUsuario(usuario: Usuarios): Observable<any>{
    return this.http.post<Usuarios>(this.urlBase + '/usuario/create', usuario, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateUsuario(usuario: Usuarios, modifPassword: number): Observable<any>{
    return this.http.put<Usuarios>(`${this.urlBase}/usuario/${usuario.idUsuarios}/${modifPassword}`, usuario, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteUsuario(id: number): Observable<any>{
    return this.http.delete<Usuarios>(`${this.urlBase}/usuario/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }

  /*-----------------------------------  ROLES  ---------------------------------------------------------- */

  getRoles(): Observable<any>{
    return this.http.get<Roles[]>(this.urlBase + '/roles/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getRol(id: number): Observable<any>{
    return this.http.get<Roles>(`${this.urlBase}/rol/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createRol(rol: Roles): Observable<any>{
    return this.http.post<Roles>(this.urlBase + '/rol/create', rol, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateRol(rol: Roles): Observable<any>{
    return this.http.put<Roles>(`${this.urlBase}/rol/${rol.idRoles}`, rol, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteRol(id: number): Observable<any>{
    return this.http.delete<Roles>(`${this.urlBase}/rol/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }


  /*-----------------------------------  EMPLEADOS  ---------------------------------------------------------- */

  getEmpleados(): Observable<any>{
    return this.http.get<Empleados[]>(this.urlBase + '/empleados/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getEmpleado(id: number): Observable<any>{
    return this.http.get<Empleados>(`${this.urlBase}/empleado/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createEmpleado(empleado: Empleados): Observable<any>{
    return this.http.post<Empleados>(this.urlBase + '/empleado/create', empleado, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateEmpleado(empleado: Empleados): Observable<any>{
    return this.http.put<Empleados>(`${this.urlBase}/empleado/${empleado.idEmpleados}`, empleado, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteEmpleado(id: number): Observable<any>{
    return this.http.delete<Empleados>(`${this.urlBase}/empleado/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }


  /*-----------------------------------  EMPRESAS  ---------------------------------------------------------- */

  getEmpresas(): Observable<any>{
    return this.http.get<Empresas[]>(this.urlBase + '/empresas/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getEmpresa(id: number): Observable<any>{
    return this.http.get<Empresas>(`${this.urlBase}/empresa/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createEmpresa(empresa: Empresas): Observable<any>{
    return this.http.post<Empresas>(this.urlBase + '/empresa/create', empresa, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateEmpresa(empresa: Empresas): Observable<any>{
    return this.http.put<Empresas>(`${this.urlBase}/empresa/${empresa.idEmpresas}`, empresa, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteEmpresa(id: number): Observable<any>{
    return this.http.delete<Empresas>(`${this.urlBase}/empresa/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }


}
