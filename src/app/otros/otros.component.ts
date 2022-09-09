import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Categorias } from '../models/Categorias.model';
import { Clientes } from '../models/Clientes.model';
import { Departamentos } from '../models/Departamentos.model';
import { Provedores } from '../models/Provedores.model';
import { ArticulosService } from '../services/articulos.service';
import { ComprasService } from '../services/compras.service';
import { EventEmitterService } from '../services/event-emitter.service';
import { VentasService } from '../services/ventas.service';

@Component({
  selector: 'app-otros',
  templateUrl: './otros.component.html',
  styleUrls: ['./otros.component.css']
})
export class OtrosComponent implements OnInit {

    clientesTodos: Clientes[] = [];
    clientes: Clientes[] = [];
    cliente: Clientes;
    provedoresTodos: Provedores[] = [];
    provedores: Provedores[] = [];
    provedor: Provedores;
    departamentosTodos: Departamentos[] = [];
    departamentos: Departamentos[] = [];
    departamento: Departamentos;
    categoriasTodos: Categorias[] = [];
    categorias: Categorias[] = [];
    categoria: Categorias;

    ventanaSelc: string;
    objetoSelec: string;
    key: string = "";
    subscription: Subscription;




  constructor(private articulosService: ArticulosService, private comprasService: ComprasService,
    private ventasService: VentasService, private router: Router, private emiter: EventEmitterService) { }

  ngOnInit(): void {
    this.inicializarVariables();
    this.goInputPrincipal();

    this.subscription = this.emiter.notificarUpload.subscribe(response =>{
      if(response == "actualizar"){
        this.key = "";
        this.objetoSelec = "";
        switch(this.ventanaSelc){
          case "clientes": this.obtenerClientes(); break;
          case "provedores": this.obtenerProvedores(); break;
          case "departamentos": this.obtenerDepartamentos(); break;
          case "categorias": this.obtenerCategorias(); break;
        }
        this.goInputPrincipal();
      }else{
        this.goInputPrincipal();
      }
    })

  }

  inicializarVariables(){
    this.obtenerClientes();
    this.obtenerProvedores();
    this.obtenerDepartamentos();
    this.obtenerCategorias();
    this.ventanaSelc = "clientes";
  }

  /*---------------------OBTENCION DE OBJETOS------------------- */
  obtenerClientes(){
    this.ventasService.getClientes().subscribe(response =>{
      this.clientesTodos = response as Clientes[];

      let indice = this.clientesTodos.findIndex(cliente =>{
        return cliente.idClientes == 1;
      })
      this.clientesTodos.splice(indice, indice +1);
      this.clientes = this.clientesTodos;

    })
  }
  obtenerProvedores(){
    this.comprasService.getProvedores().subscribe(response =>{
      this.provedoresTodos = response as Provedores[];

      let indice = this.provedoresTodos.findIndex(provedor =>{
        return provedor.idProvedores == 1;
      })
      this.provedoresTodos.splice(indice, indice +1);
      this.provedores = this.provedoresTodos;
    })
  }
  obtenerDepartamentos(){
    this.articulosService.getDepartamentos().subscribe(response =>{
      this.departamentosTodos = response as Departamentos[];

      let indice = this.departamentosTodos.findIndex(departamento =>{
        return departamento.idDepartamentos == 1;
      })
      this.departamentosTodos.splice(indice, indice +1);
      this.departamentos = this.departamentosTodos;
    })
  }
  obtenerCategorias(){
    this.articulosService.getCategorias().subscribe(response =>{
      this.categoriasTodos = response as Categorias[];
      let indice = this.categoriasTodos.findIndex(categoria =>{
        return categoria.idCategorias == 1;
      })
      this.categoriasTodos.splice(indice, indice +1);
      this.categorias = this.categoriasTodos;
    })
  }

  /*---------------------CAMBIO DE VENTANAS ------------------------------------- */
  cambiarVentana(ventana: string){

    let divClientes = document.getElementById('clientes');
    divClientes.setAttribute("class", "container-otros__nav")
    let divProvedores = document.getElementById('provedores');
    divProvedores.setAttribute("class", "container-otros__nav");
    let divDepartamentos = document.getElementById('departamentos');
    divDepartamentos.setAttribute("class", "container-otros__nav");
    let divCategorias = document.getElementById('categorias');
    divCategorias.setAttribute("class", "container-otros__nav");

    let div = document.getElementById(ventana);
    div.setAttribute("class", "container-otros__nav--active");


    let sectionClientes = document.getElementById('divclientes');
    sectionClientes.setAttribute("class", "gone")
    let sectionProvedores = document.getElementById('divprovedores');
    sectionProvedores.setAttribute("class", "gone");
    let sectionDepartamentos = document.getElementById('divdepartamentos');
    sectionDepartamentos.setAttribute("class", "gone");
    let sectionCategorias = document.getElementById('divcategorias');
    sectionCategorias.setAttribute("class", "gone");

    let section = document.getElementById("div" + ventana);
    section.setAttribute("class", "visible");


    this.ventanaSelc = ventana;
    this.goInputPrincipal();


  }


  /*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
  siguienteFoco(indice: number) {
    switch(this.ventanaSelc){
      case "clientes":{
        if (this.clientes[indice] != null) {
          let row = document.getElementById('inputclientes' + indice.toString());
          row.focus();
        }
        break;
      }
      case "provedores":{
        if (this.provedores[indice] != null) {
          let row = document.getElementById('inputprov' + indice.toString());
          row.focus();
        }
        break;
      }
      case "departamentos":{
        if (this.departamentos[indice] != null) {
          let row = document.getElementById('inputdepart' + indice.toString());
          row.focus();
        }
        break;
      }
      case "categorias":{
        if (this.categorias[indice] != null) {
          let row = document.getElementById('inputcategory' + indice.toString());
          row.focus();
        }
        break;
      }
    }

  }

  seleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'section__table-data--active');

    this.objetoSelec = (<HTMLInputElement>event.target).name;
  }

  deseleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'section__table-data');
  }


  dobleClick(indice: string) {
    this.abrirDetalles();
  }

  goInputPrincipal() {
    let id = "otros-client"
    switch(this.ventanaSelc){
      case "provedores": id = "otros-prov"; break;
      case "departamentos": id= "otros-department" ; break;
      case "categorias": id= "otros-category" ; break;
    }
    let inputPrincipal = document.getElementById(id);
    inputPrincipal.focus();
  }

  /*--------------------EVENTO KEYUP PRINCIPAL---------------------- */
  eventoKeyPrincipal(event: any){
    let keyValidado = this.key.trim();
    if(event.key == "ArrowDown"){
      this.siguienteFoco(0);
    }else if(event.key != "ArrowDown"){
      switch(this.ventanaSelc){
        case "clientes":{
          if(keyValidado == "") this.clientes = this.clientesTodos;
          else{
            this.clientes = this.clientesTodos.filter(cliente =>{
              return cliente.nombre.toLowerCase().includes(keyValidado.toLowerCase());
            })
          }
          break;
        }
        case "provedores":{
          if(keyValidado == "") this.provedores = this.provedoresTodos;
          else{
            this.provedores = this.provedoresTodos.filter(provedor =>{
              return provedor.nombre.toLowerCase().includes(keyValidado.toLowerCase());
            })
          }
          break;
        }
        case "departamentos":{
          if(keyValidado == "") this.departamentos = this.departamentosTodos;
          else{
            this.departamentos = this.departamentosTodos.filter(departamento =>{
              return departamento.nombre.toLowerCase().includes(keyValidado.toLowerCase());
            })
          }
          break;
        }
        case "categorias":{
          if(keyValidado == "") this.categorias = this.categoriasTodos;
          else{
            this.categorias = this.categoriasTodos.filter(categoria =>{
              return categoria.nombre.toLowerCase().includes(keyValidado.toLowerCase());
            })
          }
          break;
        }
      }
    }

  }

  /*------------------EVENTO KEYUP EN FILAS--------------------------------- */
  inputKeypress(event: any, indice: string) {
    let index = parseInt(indice);
    if (event.key == 'ArrowDown') {
      this.siguienteFoco(index + 1);
    } else if (event.key == 'ArrowUp') {
      if (index == 0) {
        this.goInputPrincipal();
      }
      this.siguienteFoco(index - 1);
    } else if (event.key == '*' || event.key == 'Enter') {
      this.abrirDetalles();
    }
  }

  /*--------------------MANEJO DE VENTANAS NUEVAS ------------------------------- */

  abrirDetalles(){
    if(this.objetoSelec != null){
      switch(this.ventanaSelc){
        case "clientes":{
          this.router.navigate(['menu/otros/cliente-detalles'], {queryParams:{id: this.clientes[this.objetoSelec].idClientes}})
          break;
        }
        case "provedores":{
          this.router.navigate(['menu/otros/provedor-detalles'], {queryParams:{id: this.provedores[this.objetoSelec].idProvedores}})
          break;
        }
        case "departamentos":{
          this.router.navigate(['menu/otros/departamento-detalles'], {queryParams:{id: this.departamentos[this.objetoSelec].idDepartamentos}})
          break;
        }
        case "categorias":{
          this.router.navigate(['menu/otros/categoria-detalles'], {queryParams:{id: this.categorias[this.objetoSelec].idCategorias}})
          break;
        }
      }
    }
  }

  crearObjeto(){
    switch(this.ventanaSelc){
      case "clientes":{
        this.router.navigate(['menu/otros/cliente-detalles'])
        break;
      }
      case "provedores":{
        this.router.navigate(['menu/otros/provedor-detalles'])
        break;
      }
      case "departamentos":{
        this.router.navigate(['menu/otros/departamento-detalles'])
        break;
      }
      case "categorias":{
        this.router.navigate(['menu/otros/categoria-detalles'])
        break;
      }
    }
  }

  eliminarObjeto(){
    if(this.objetoSelec != null){
      let nombre = "";
      let id: number;
    switch(this.ventanaSelc){
      case "clientes":{
        nombre = this.clientes[this.objetoSelec].nombre;
        id =this.clientes[this.objetoSelec].idClientes;
        break;
      }
      case "provedores":{
        nombre = this.provedores[this.objetoSelec].nombre;
        id = this.provedores[this.objetoSelec].idProvedores;
        break;
      }
      case "departamentos":{
        nombre = this.departamentos[this.objetoSelec].nombre;
        id = this.departamentos[this.objetoSelec].idDepartamentos;
        break;
      }
      case "categorias":{
        nombre = this.categorias[this.objetoSelec].nombre;
        id = this.categorias[this.objetoSelec].idCategorias;
        break;
      }
    }
      this.router.navigate(['menu/otros/eliminar-objeto'], {queryParams:{id: id,ventana: this.ventanaSelc, nombre: nombre}});
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
