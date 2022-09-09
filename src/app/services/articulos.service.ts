import { AuthService } from './auth.service';
import { Articulos } from 'src/app/models/articulos.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { Departamentos } from '../models/Departamentos.model';
import { Categorias } from '../models/Categorias.model';
import { Detallesprovedoresarticulos } from '../models/Detallesprovedoresarticulos.model';


@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private urlBase: string = "http://localhost:8080/articulos";
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

  /*------------------------------------ARTICULOS----------------------------------------------------------------- */
  getArticulos(page: number): Observable<any> {
    return this.http.get(this.urlBase + '/articulos/page/' + page).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e => {
        return this.mandarError(e)
      })


    );

  }

  getArticulosLikeNombre(nombre: string, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-nombre/${nombre}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  getArticulosLikeNombreDepartamento(nombre: string, idDepartamentos: number, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-nombre-departamento/${nombre}/${idDepartamentos}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }
  getArticulosLikeNombreDepartamentoCategoria(nombre: string, idDepartamentos: number, idCategorias: number, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-nombre-departamento-categoria/${nombre}/${idDepartamentos}/${idCategorias}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  getArticulosLikeCodigo(codigo: string, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-codigo/${codigo}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  getArticulosLikeCodigoDepartamento(codigo: string, idDepartamentos: number, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-codigo-departamento/${codigo}/${idDepartamentos}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }
  getArticulosLikeCodigoDepartamentoCategoria(codigo: string, idDepartamentos: number, idCategorias: number, page: number): Observable<any>{
    return this.http.get(`${this.urlBase}/articulos/like-codigo-departamento-categoria/${codigo}/${idDepartamentos}/${idCategorias}/${page}`).pipe(
      map((response: any) =>{
        (response.content as Articulos[]);
        return response;
      }),
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  getArticulo(id: number): Observable<any>{
    return this.http.get<Articulos>(`${this.urlBase}/articulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }
  getArticuloByCodigo(codigo: string): Observable<any>{
    return this.http.get<Articulos>(`${this.urlBase}/articulo/codigo/${codigo}`).pipe(
      catchError(e => {
        if (e.status == 400 || e.status == 401) {
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );
  }

  createArticulo(articulo: Articulos): Observable<any>{
    return this.http.post<Articulos>(this.urlBase + '/articulo/create', articulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateArticulo(articulo: Articulos): Observable<any>{
    return this.http.put<Articulos>(`${this.urlBase}/articulo/${articulo.idArticulos}`, articulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteArticulo(id: number): Observable<any>{
    return this.http.delete<Articulos>(`${this.urlBase}/articulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  /*------------------------------------DEPARTAMENTOS----------------------------------------------------------------- */

  getDepartamentos(): Observable<any> {
    return this.http.get<Departamentos[]>(this.urlBase + '/departamentos/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getDepartamento(id: number): Observable<any>{
    return this.http.get<Departamentos>(`${this.urlBase}/departamento/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  getDepartamentoByName(nombre: string): Observable<any>{
    return this.http.get<Departamentos>(`${this.urlBase}/departamento/nombre/${nombre}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }



  createDepartamento(departamento: Departamentos): Observable<any>{
    return this.http.post<Departamentos>(this.urlBase + '/departamento/create', departamento, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateDepartamento(departamento: Departamentos): Observable<any>{
    return this.http.put<Departamentos>(`${this.urlBase}/departamento/${departamento.idDepartamentos}`, departamento, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteDepartamento(id: number): Observable<any>{
    return this.http.delete<Departamentos>(`${this.urlBase}/departamento/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  /*------------------------------------CATEGORIAS----------------------------------------------------------------- */

  getCategorias(): Observable<any> {
    return this.http.get<Categorias[]>(this.urlBase + '/categorias/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getCategoriasByDepartamento(idDepartamento: number): Observable<any>{
    return this.http.get<Categorias[]>(`${this.urlBase}/categorias/departamento/${idDepartamento}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }


  getCategoria(id: number): Observable<any>{
    return this.http.get<Categorias>(`${this.urlBase}/categoria/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  getCategoriaByName(nombre: string): Observable<any>{
    return this.http.get<Categorias>(`${this.urlBase}/categoria/nombre/${nombre}`).pipe(
      catchError(e =>{
        return this.mandarError(e);
      })
    )
  }

  createCategoria(categoria: Categorias): Observable<any>{
    return this.http.post<Categorias>(this.urlBase + '/categoria/create', categoria, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateCategoria(categoria: Categorias): Observable<any>{
    return this.http.put<Categorias>(`${this.urlBase}/categoria/${categoria.idCategorias}`, categoria, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteCategoria(id: number): Observable<any>{
    return this.http.delete<Categorias>(`${this.urlBase}/categoria/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  /*------------------------------------DETALLES PROVEDORES ARTICULOS----------------------------------------------------------------- */
  getDetallesprovedoresarticulos(): Observable<any> {
    return this.http.get<Detallesprovedoresarticulos[]>(this.urlBase + '/provedoresarticulos/list').pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );

  }

  getDetallesprovedoresarticulo(id: number): Observable<any>{
    return this.http.get<Detallesprovedoresarticulos>(`${this.urlBase}/provedoresarticulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  createDetallesprovedoresarticulo(detallesprovedoresarticulo: Detallesprovedoresarticulos): Observable<any>{
    return this.http.post<Detallesprovedoresarticulos>(this.urlBase + '/provedoresarticulo/create', detallesprovedoresarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  updateDetallesprovedoresarticulo(detallesprovedoresarticulo: Detallesprovedoresarticulos): Observable<any>{
    return this.http.put<Detallesprovedoresarticulos>(`${this.urlBase}/provedoresarticulo/${detallesprovedoresarticulo.idDetallesProvedoresArticulos}`, detallesprovedoresarticulo, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }

  deleteDetallesprovedoresarticulo(id: number): Observable<any>{
    return this.http.delete<Detallesprovedoresarticulos>(`${this.urlBase}/provedoresarticulo/${id}`).pipe(
      catchError(e => {
        return this.mandarError(e)
      })
    );
  }




}
