import { EmpleadosService } from './empleados.service';
import { Cajas } from 'src/app/models/cajas.model';
import { Usuarios } from './../models/Usuarios.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Roles } from '../models/Roles.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuarios;
  private _token: string;
  private _caja: Cajas = new Cajas(1, "CAJA1");
  private _rol: Roles;

  constructor(private http: HttpClient) { }


  getCaja(): Cajas{
    return this._caja;
  }


  public get usuario(): Usuarios{
    if (this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuarios;
      return this._usuario;
    }
    return null;
  }

  public get token(): string{
    if (this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  public get rol(): Roles{
    if (this._rol != null){
      return this._rol;
    }else if(this._rol == null && sessionStorage.getItem('rol') != null){
      this._rol = JSON.parse(sessionStorage.getItem('rol')) as Roles;
      return this._rol;
    }
    return null;
  }


  login(usuario: Usuarios): Observable<any>{

    const urlOauth = "http://localhost:8080/oauth/token";
    const credenciales = btoa('puntoVentaApp' + ':' + 'surticlau1802');
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credenciales});


    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);



    return this.http.post<any>(urlOauth, params.toString(), {headers: httpHeaders});

  }

  obtenerDatosToken(accessToken: string): any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  guardarUsuario(accessToken: string): void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuarios();
    this._usuario.username = payload.user_name;
    this._usuario.rol = payload.authorities;
    this._rol = new Roles();
    this._rol.seccionCatalogo = payload.seccionCatalogo == "1"?true:false;
    this._rol.agregarArticulo = payload.agregarArticulo == "1"?true:false;
    this._rol.eliminarArticulo = payload.eliminarArticulo == "1"?true:false;
    this._rol.editarArticulo = payload.editarArticulo == "1"?true:false;
    this._rol.exportarArticulos = payload.exportarArticulos == "1"?true:false;
    this._rol.importarArticulos = payload.importarArticulos == "1"?true:false;
    this._rol.seccionConsultas = payload.seccionConsultas == "1"?true:false;
    this._rol.cambiarFechaConsulta = payload.cambiarFechaConsulta == "1"?true:false;
    this._rol.cancelarVenta = payload.cancelarVenta == "1"?true:false;
    this._rol.cancelarCompra = payload.cancelarCompra == "1"?true:false;
    this._rol.seccionVentas = payload.seccionVentas == "1"?true:false;
    this._rol.realizarVenta = payload.realizarVenta == "1"?true:false;
    this._rol.cambiarPrecio = payload.cambiarPrecio == "1"?true:false;
    this._rol.preguntarImprimir = payload.preguntarImprimir == "1"?true:false;
    this._rol.seccionReportes = payload.seccionReportes == "1"?true:false;
    this._rol.cambiarFechaReporte = payload.cambiarFechaReporte == "1"?true:false;
    this._rol.seccionCompras = payload.seccionCompras == "1"?true:false;
    this._rol.seccionConfiguraciones = payload.seccionConfiguraciones == "1"?true:false;
    this._rol.seccionOtros = payload.seccionOtros == "1"?true:false;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    sessionStorage.setItem('rol', JSON.stringify(this._rol));
  }

  guardarToken(accessToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean{
    if(this.usuario.rol.nombre == role){
      return true;
    }
    return false;
  }


  logout(): void{
    this._token = null;
    this._usuario = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('rol');
  }








}
