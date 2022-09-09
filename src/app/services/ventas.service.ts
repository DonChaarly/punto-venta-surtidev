import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError, map } from 'rxjs';
import { Cajas } from '../models/cajas.model';
import { Clientes } from '../models/Clientes.model';
import { Detallesventasarticulos } from '../models/Detallesventasarticulos';
import { ReportesProductos } from '../models/reportesproductos.model';
import { ReportesUsuarios } from '../models/reportesusuarios.model';
import { Ventas } from '../models/Ventas.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private urlBase: string = "http://localhost:8080/ventas";
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  mandarError(e: any): Observable<any>{
    if (e.status == 400 || e.status == 401) {
      return throwError(() => e);
    }
    if (e.error.message) {
      console.error(e.error.mensaje);
    }
    return throwError(() => e);
  }


  /*------------------------------------VENTAS----------------------------------------------------------------- */
  getVentas(page: number): Observable<any> {
    return this.http.get(this.urlBase + '/ventas/page' + page).pipe(
      map((response: any) =>{
        (response.content as Ventas[]);
        return response;
      }),
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }
  getReporteProductos(cliente: string, usuario: string, codigo: string, departamento: string, inicio: number, fin: number): Observable<any> {
    return this.http.get<ReportesProductos[]>(`${this.urlBase}/reporte/productos/${cliente}/${usuario}/${codigo}/${departamento}/${inicio}/${fin}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }
  getReporteUsuarios(usuario: string, inicio: number, fin: number): Observable<any> {
    return this.http.get<ReportesUsuarios[]>(`${this.urlBase}/reporte/usuarios/${usuario}/${inicio}/${fin}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }
  getVentasEspera(): Observable<any>{
    return this.http.get<Ventas[]>(this.urlBase + '/ventas/espera').pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    );
  }

  getVenta(id: number): Observable<any>{
    return this.http.get<Ventas>(`${this.urlBase}/venta/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  getUltimoFolio(): Observable<any>{
    return this.http.get<String>(`${this.urlBase}/venta/folio`).pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    )
  }

  createVenta(venta: Ventas): Observable<any>{
    return this.http.post<Ventas>(this.urlBase + '/venta/create', venta, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateVenta(venta: Ventas): Observable<any>{
    return this.http.put<Ventas>(`${this.urlBase}/venta/${venta.idVentas}`, venta, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteVenta(id: number): Observable<any>{
    return this.http.delete<Ventas>(`${this.urlBase}/venta/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  getVentasByDate(codigo: string, usuario: string, folio: string, cliente: string, total: string, inicio: number, fin: number, page: number): Observable<any> {
    return this.http.get(`${this.urlBase}/list/fecha/${codigo}/${usuario}/${folio}/${cliente}/${total}/${inicio}/${fin}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Ventas[]);
        return response;
      }),
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  /*------------------------------------CLIENTES----------------------------------------------------------------- */
  getClientes(): Observable<any> {
    return this.http.get<Clientes[]>(this.urlBase + '/clientes/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getCliente(id: number): Observable<any>{
    return this.http.get<Clientes>(`${this.urlBase}/cliente/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  createCliente(cliente: Clientes): Observable<any>{
    return this.http.post<Clientes>(this.urlBase + '/cliente/create', cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateCliente(cliente: Clientes): Observable<any>{
    return this.http.put<Clientes>(`${this.urlBase}/cliente/${cliente.idClientes}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteCliente(id: number): Observable<any>{
    return this.http.delete<Clientes>(`${this.urlBase}/cliente/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  /*------------------------------------CAJAS----------------------------------------------------------------- */
  getCajas(): Observable<any> {
    return this.http.get<Cajas[]>(this.urlBase + '/cajas/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getCaja(id: number): Observable<any>{
    return this.http.get<Cajas>(`${this.urlBase}/caja/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  createCaja(caja: Cajas): Observable<any>{
    return this.http.post<Cajas>(this.urlBase + '/caja/create', caja, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateCaja(caja: Cajas): Observable<any>{
    return this.http.put<Cajas>(`${this.urlBase}/caja/${caja.idCajas}`, caja, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteCaja(id: number): Observable<any>{
    return this.http.delete<Cajas>(`${this.urlBase}/caja/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  /*------------------------------------DETALLES VENTAS ARTICULOS----------------------------------------------------------------- */
  getDetallesventasarticulos(): Observable<any> {
    return this.http.get<Detallesventasarticulos[]>(this.urlBase + '/ventasarticulos/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getDetallesventasarticulo(id: number): Observable<any>{
    return this.http.get<Detallesventasarticulos>(`${this.urlBase}/ventasarticulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  createDetallesventasarticulo(detallesventasarticulo: Detallesventasarticulos): Observable<any>{
    return this.http.post<Detallesventasarticulos>(this.urlBase + '/ventasarticulo/create', detallesventasarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateDetallesventasarticulo(detallesventasarticulo: Detallesventasarticulos): Observable<any>{
    return this.http.put<Detallesventasarticulos>(`${this.urlBase}/ventasarticulo/${detallesventasarticulo.idDetallesVentasArticulos}`, detallesventasarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteDetallesventasarticulo(id: number): Observable<any>{
    return this.http.delete<Detallesventasarticulos>(`${this.urlBase}/ventasarticulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

}
