import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulos } from 'src/app/models/articulos.model';
import { Categorias } from 'src/app/models/Categorias.model';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css']
})
export class ProductoBuscarComponent implements OnInit {

  articulos: Articulos[] = [];
  departamentos: Departamentos[] = [];
  categorias: Categorias[]= [];

  findby: string = "description";
  departamento: number = 0;
  categoria: number = 0;
  key: string = "";
  articuloSeleccionado: string;
  @ViewChild("inputKeySeek") inputKeySeek: ElementRef;
  page: number = 1;
  totalPages:number;


  constructor(private articulosService: ArticulosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.inicializarVariables();

    setTimeout(()=>{
      if(this.inputKeySeek) this.inputKeySeek.nativeElement.focus();
    },100);
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

  /*---------------------INIZIALIZANDO VARIABLES--------------------------------------- */
  inicializarVariables(){
    this.articulosService.getArticulos(this.page-1).subscribe(response =>{
      this.articulos = response.content as Articulos[];
      this.totalPages = response.totalPages;
    });


    this.obtenerDepartamentosCategorias();
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


    let keyValidado = this.key.trim();
    if(keyValidado == ""){
      keyValidado = "**"
    }

    if(event.key == "Enter"){
      this.buscarArticulos(0);
    }else if(event.key == "ArrowDown"){
      this.siguienteFoco(0);
    }else if(event.key == "Escape"){
      this.salir();
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

  salir(){
    this.emiter.notificarUpload.emit("Todos");
    this.router.navigate(['../'], {relativeTo: this.route})
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
    }else if(event.key == "Enter"){
      this.seleccionarArticulo();
    }

  }

  /*--------------------------SELECCIONAR SIGUIENTE FILA--------------------------- */
  siguienteFoco(indice: number){
    if(this.articulos[indice] != null){
      let row = document.getElementById("in"+indice.toString());
      row.focus();
    }
  }

  /*-----------------------COLOCAR FOCO EN INPUT PRINICPAL---------------------------- */
  goInputPrincipal(){
    let inputPrincipal = document.getElementById("keySeek");
    inputPrincipal.focus();
  }

  /*-----------------------EVENTO DOBLE CLICK EN FILA-------------------------------- */
  dobleClick(){
    this.seleccionarArticulo();
  }
  /*--------------------EDICION DE ARTICULO------------------------------------- */
  seleccionarArticulo(){
    if(this.articuloSeleccionado != null){
      let articuloSelect = {
        articuloSeleccionado: this.articuloSeleccionado
      }
      this.emiter.notificarUpload.emit(articuloSelect);
      this.router.navigate(['../'], {relativeTo: this.route})
    }
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
