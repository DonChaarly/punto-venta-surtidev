import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError, map } from 'rxjs';
import { Compras } from '../models/Compras.model';
import { Provedores } from '../models/Provedores.model';
import { Detallescomprasarticulos } from '../models/Detallescomprasarticulos.model';
import { ReportesProductos } from '../models/reportesproductos.model';
import { ReportesUsuarios } from '../models/reportesusuarios.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private urlBase = "http://localhost:8080/compras";
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

  /*-----------------------------------  COMPRAS  ---------------------------------------------------------- */

  getCompras(page: number): Observable<any>{
    return this.http.get(this.urlBase + '/compras/page' + page).pipe(
      map((response: any) =>{
        (response.content as Compras[]);
        return response;
      }),
      catchError(e =>{
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

  getCompra(id: number): Observable<any>{
    return this.http.get<Compras>(`${this.urlBase}/compra/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }
  getComprasEspera(): Observable<any>{
    return this.http.get<Compras[]>(this.urlBase + '/compras/espera').pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    );
  }
  getUltimoFolio(): Observable<any>{
    return this.http.get<String>(`${this.urlBase}/compra/folio`).pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    )
  }

  createCompra(compra: Compras): Observable<any>{
    return this.http.post<Compras>(this.urlBase + '/compra/create', compra, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateCompra(compra: Compras): Observable<any>{
    return this.http.put<Compras>(`${this.urlBase}/compra/${compra.idCompras}`, compra, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteCompra(id: number): Observable<any>{
    return this.http.delete<Compras>(`${this.urlBase}/compra/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }

  getComprasByDate(codigo: string, usuario: string, folio: string, provedor: string, total: string, inicio: number, fin: number, page: number): Observable<any> {
    return this.http.get(`${this.urlBase}/list/fecha/${codigo}/${usuario}/${folio}/${provedor}/${total}/${inicio}/${fin}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Compras[]);
        return response;
      }),
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  /*-----------------------------------  PROVEDORES  ---------------------------------------------------------- */

  getProvedores(): Observable<any>{
    return this.http.get<Provedores[]>(this.urlBase + '/provedores/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getProvedor(id: number): Observable<any>{
    return this.http.get<Provedores>(`${this.urlBase}/provedor/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createProvedor(provedor: Provedores): Observable<any>{
    return this.http.post<Provedores>(this.urlBase + '/provedor/create', provedor, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateProvedor(provedor: Provedores): Observable<any>{
    return this.http.put<Provedores>(`${this.urlBase}/provedor/${provedor.idProvedores}`, provedor, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteProvedor(id: number): Observable<any>{
    return this.http.delete<Provedores>(`${this.urlBase}/provedor/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }


  /*-----------------------------------  DETALLES COMPRAS ARTICULOS  ---------------------------------------------------------- */

  getDetallescomprasarticulos(): Observable<any>{
    return this.http.get<Detallescomprasarticulos[]>(this.urlBase + '/comprasarticulos/list').pipe(
      catchError(e =>{
        return this.mandarError(e)
      })
    );
  }

  getDetallescomprasarticulo(id: number): Observable<any>{
    return this.http.get<Detallescomprasarticulos>(`${this.urlBase}/comprasarticulo/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createDetallescomprasarticulo(detallescomprasarticulo: Detallescomprasarticulos): Observable<any>{
    return this.http.post<Detallescomprasarticulos>(this.urlBase + '/comprasarticulo/create', detallescomprasarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  updateDetallescomprasarticulo(detallescomprasarticulo: Detallescomprasarticulos): Observable<any>{
    return this.http.put<Detallescomprasarticulos>(`${this.urlBase}/comprasarticulo/${detallescomprasarticulo.idDetallesComprasArticulos}`, detallescomprasarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  deleteDetallescomprasarticulo(id: number): Observable<any>{
    return this.http.delete<Detallescomprasarticulos>(`${this.urlBase}/comprasarticulo/${id}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      }))
  }


}


