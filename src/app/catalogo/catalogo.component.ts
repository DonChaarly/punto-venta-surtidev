import { catchError, Subscription } from 'rxjs';
import { Departamentos } from './../models/Departamentos.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Articulos } from '../models/articulos.model';
import { Categorias } from '../models/Categorias.model';
import { ArticulosService } from '../services/articulos.service';
import { Router } from '@angular/router';
import { EdicionArticuloComponent } from './emergentes/edicion-articulo/edicion-articulo.component';
import { EventEmitterService } from '../services/event-emitter.service';
import { AuthService } from '../services/auth.service';
import { Roles } from '../models/Roles.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  articulos: Articulos[] = [];
  departamentos: Departamentos[] = [];
  categorias: Categorias[]= [];

  findby: string = "description";
  departamento: number = 0;
  categoria: number = 0;
  key: string = "";
  articuloSeleccionado: string;
  suscriber: Subscription;
  rol: Roles;
  page: number = 1;
  totalPages: number;



  constructor(private articulosService: ArticulosService, private router: Router, private emiter: EventEmitterService, private auth: AuthService) { }

  ngOnInit(): void {
    this.rol = this.auth.rol;


    this.inicializarVariables();

    this.suscriber = this.emiter.notificarUpload.subscribe(articulo =>{

      if(articulo.idArticulos != undefined && articulo.codigo != undefined){
        this.inicializarVariables();
      }
    })



  }

  /*---------------------INIZIALIZANDO VARIABLES--------------------------------------- */
  inicializarVariables(){
    this.articulosService.getArticulos(this.page-1).subscribe(response =>{
      this.articulos = response.content as Articulos[];
      this.totalPages = response.totalPages;
    });


    this.obtenerDepartamentosCategorias();
  }

  /*--------------------  BUSQUEDA DE DEPARTAMENTOS Y CATEGORIAS ------------------------ */

  obtenerDepartamentosCategorias(){
    this.articulosService.getDepartamentos().subscribe(response =>{
      this.departamentos = response as Departamentos[];
    })

    this.articulosService.getCategorias().subscribe(response =>{
      this.categorias = response as Categorias[];
    })
  }

  /*-----------------------------BUSQUEDA DE ARTICULOS DE ACUERDO A LA SELECCION------------------------- */
  articulosLike(key: string, page: number){
    if(this.findby == "description"){
      this.articulosService.getArticulosLikeNombre(key, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      });
    }
    if(this.findby == "key"){
      this.articulosService.getArticulosLikeCodigo(key, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      });
    }
  }

  articulosLikeDepartamento(key: string, page: number){
    if(this.findby == "description"){
      this.articulosService.getArticulosLikeNombreDepartamento(key, this.departamento, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      })
    }
    if(this.findby == "key"){
      this.articulosService.getArticulosLikeCodigoDepartamento(key, this.departamento, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      })
    }
  }

  articulosLikeDepartamentoCategoria(key: string, page: number){
    if(this.findby == "description"){
      this.articulosService.getArticulosLikeNombreDepartamentoCategoria(key, this.departamento, this.categoria, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      })
    }
    if(this.findby == "key"){
      this.articulosService.getArticulosLikeCodigoDepartamentoCategoria(key, this.departamento, this.categoria, page).subscribe(response =>{
        this.articulos = response.content as Articulos[];
        this.totalPages = response.totalPages;
      })
    }
  }

  /*------------------------ BUSQEUDA DE CATEGORIAS ------------------------------------ */

  todasCategorias(){
    this.articulosService.getCategorias().subscribe(response =>{
      this.categorias = response as Categorias[];
    })
  }

  categoriasByDepartamento(idDepartamento: number){
    this.articulosService.getCategoriasByDepartamento(idDepartamento).subscribe(response =>{
      this.categorias = response as Categorias[];
    })
  }

  /*--------------------------METODO DE EVENTO KEYUP INPUT PRINCIPAL------------------------------- */
  encontrarArticulos(event: any){




    switch(event.key){
      case "+" : {
        this.key = ""
        this.agregarArticulo();
        break
      }
      case "-": {
        this.key = ""
        this.eliminarArticulo();
        break
      }
      case "*": {
        this.key = ""
        this.editarArticulo();
        break
      }
    }
    if(event.key == "Enter"){
      this.buscarArticulos(0);
    }else if(event.key == "ArrowDown"){
      this.siguienteFoco(0);
    }
  }

  buscarArticulos(page: number){
    let keyValidado = this.key.trim();
    if(keyValidado == ""){
      keyValidado = "**"
    }
    if(this.departamento == 0 && this.categoria == 0){
      this.articulosLike(keyValidado, page);
      this.todasCategorias();

    }else{

      if(this.categoria != 0){

        this.articulosService.getCategoria(this.categoria).subscribe(response =>{
          this.departamento = (response as Categorias).departamento.idDepartamentos;
          this.articulosLikeDepartamentoCategoria(keyValidado, page);

        })
      }
      if(this.categoria == 0){

        this.articulosLikeDepartamento(keyValidado, page);

        this.categoriasByDepartamento(this.departamento)

      }
    }
  }

  /*---------------SELECCION DE FILA CON EVENTO FOCUS------------------------------ */
  seleccionarFila(event: Event){
    const row = document.getElementById("tr"+(<HTMLInputElement>event.target).id);
    row.setAttribute("class", "active");

    this.articuloSeleccionado = (<HTMLInputElement>event.target).name;
  }

  deseleccionarFila(event: Event){
    const row = document.getElementById("tr"+(<HTMLInputElement>event.target).id);
    row.setAttribute("class", "");

  }

  /*------------------EVENTO KEYUP EN FILAS--------------------------------- */
  inputKeypress(event: any, indice: string){
    let index = parseInt(indice);

    if(event.key == "ArrowDown"){
      this.siguienteFoco(index + 1)
    }else if(event.key == "ArrowUp"){
      if(index == 0){
        this.goInputPrincipal();
      }
      this.siguienteFoco(index - 1)
    }else if(event.key == "-"){
      this.eliminarArticulo();
    }else if(event.key == "*" || event.key == "Enter"){
      this.editarArticulo();
    }

  }

  /*--------------------------SELECCIONAR SIGUIENTE FILA--------------------------- */
  siguienteFoco(indice: number){

    if(this.articulos[indice] != null){
      let row = document.getElementById("input"+indice.toString());
      row.focus();
    }
  }

  /*-----------------------COLOCAR FOCO EN INPUT PRINICPAL---------------------------- */
  goInputPrincipal(){
    let inputPrincipal = document.getElementById("key");
    inputPrincipal.focus();
  }

  /*-----------------------EVENTO DOBLE CLICK EN FILA-------------------------------- */
  dobleClick(){
    this.editarArticulo();
  }


  /*--------------------EDICION DE ARTICULO------------------------------------- */
  editarArticulo(){
    if(this.articuloSeleccionado != null){

      this.router.navigate(['menu/catalogo/edicion-articulo'], {queryParams: {articuloSeleccionado: this.articuloSeleccionado}});
    }


  }

  /*---------------------ELIMINAR ARTICULO -------------------------------------- */
  eliminarArticulo(){
    if(this.rol.eliminarArticulo){
      if(this.articuloSeleccionado != null){

        this.router.navigate(['menu/catalogo/eliminar-articulo'], {queryParams: {articuloSeleccionado: this.articuloSeleccionado}});
      }
    }
  }
  /*---------------------AGREGAR ARTICULO -------------------------------------- */
  agregarArticulo(){
    if(this.rol.agregarArticulo){
      this.router.navigate(['menu/catalogo/nuevo-articulo']);
    }
  }

  ngOnDestroy(): void {
    this.suscriber.unsubscribe();
  }

  /*---------------------CAMBIAR EL NUMERO DE PAGINA------------------------------ */

  cambiarPagina(event: any, page){
    if(event.key == "Enter" || event == "Enter"){
      if(this.page >= 1 && this.page <= this.totalPages){
        this.buscarArticulos(page -1);
      }
      let arrowleft = document.getElementById("arrowLeft");
      let arrowRight = document.getElementById("arrowRight");
      if(this.page <= 1) arrowleft.setAttribute("class", "");
      else arrowleft.setAttribute("class", "arrowActive");
      if(this.page >= this.totalPages) arrowRight.setAttribute("class", "");
      else arrowRight.setAttribute("class", "arrowActive");
    }
  }

  masMenosUnaPagina(disminuir: boolean){
    if(disminuir){
      if(this.page > 1){
        this.page -=1;
        this.cambiarPagina("Enter", this.page);
      }
    }else if(this.page < this.totalPages){
      this.page += 1;
      this.cambiarPagina("Enter", this.page);
    }


  }





}
