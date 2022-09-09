import { Router } from '@angular/router';
import { Detallesprovedoresarticulos } from './../../../models/Detallesprovedoresarticulos.model';
import { Articulos } from 'src/app/models/articulos.model';
import { Component, OnInit } from '@angular/core';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { Categorias } from 'src/app/models/Categorias.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { Provedores } from 'src/app/models/Provedores.model';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.component.html',
  styleUrls: ['./nuevo-articulo.component.css']
})
export class NuevoArticuloComponent implements OnInit {

  articulo: Articulos = new Articulos();
  detallesprovedoresarticulos: Detallesprovedoresarticulos = new Detallesprovedoresarticulos();
  departamentos: Departamentos[] = [];
  departamento: Departamentos;
  categorias: Categorias[] = [];
  categoria: number;
  provedores: Provedores[] = [];
  provedor: number;

  subscription: Subscription;

  constructor(private articulosService: ArticulosService, private comprasService: ComprasService, private emiter: EventEmitterService,
    private router: Router) { }

  ngOnInit(): void {

    this.inicializarVariables();

  }

  /*------------------INICIANDO VARIABLES--------------------- */
  inicializarVariables(){
    this.obtenerCategorias();
    this.obtenerProvedores();

    this.subscription = this.emiter.notificarUpload.subscribe(objeto =>{
      if(objeto instanceof Categorias){
        this.articulo.categoria = objeto
        this.categorias.push(objeto);
        this.categoria = this.categorias.length -1;
      }


      if(objeto instanceof Provedores){

        this.detallesprovedoresarticulos.provedor = objeto;
        this.provedores.push(objeto);
        this.provedor = this.provedores.length - 1;
      }
    })

  }

  /*------------------BUSQUEDA DE ELEMENTOS------------ */
  obtenerCategorias(){
    this.articulosService.getCategorias().subscribe(response =>{
      this.categorias = response as Categorias[];

    })
  }
  obtenerProvedores(){
    this.comprasService.getProvedores().subscribe(response =>{
      this.provedores = response as Provedores[];

    })
  }

  /*-------------------------CAMBIAR CATEGORIA y PROVEDOR---------------- */

  cambiarCategoria(){
    this.articulo.categoria = this.categorias[this.categoria];

  }
  cambiarProvedor(){
    this.detallesprovedoresarticulos.provedor = this.provedores[this.provedor];
  }
  /*-----------------------OBTENER GANACIAS------------------ */
  ganancia1(){
    let ganancia = (this.articulo.precio1 * 100 / this.articulo.ultimoPrecioCompra) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;

  }
  ganancia2(){
    let ganancia = (this.articulo.precio2 * 100 / this.articulo.ultimoPrecioCompra) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;

  }

  /*------------------------CREAR EL ARTICULO------------------ */

  crearArticulo(){

    this.articulosService.createArticulo(this.articulo).subscribe(response =>{
      console.log("El articulo: " + this.articulo.codigo + " ha sido creado con exito")
      this.articulo.idArticulos = response.articulo.idArticulos
      if(this.detallesprovedoresarticulos.provedor != undefined){
        this.detallesprovedoresarticulos.articulo = this.articulo;
        if(this.articulo.ultimoPrecioCompra){
          this.detallesprovedoresarticulos.ultPrecio = this.articulo.ultimoPrecioCompra;
        }else{
          this.detallesprovedoresarticulos.ultPrecio = 0
        }

        this.articulosService.createDetallesprovedoresarticulo(this.detallesprovedoresarticulos).subscribe(response =>{
          console.log("Se a agregado el provedor: " + this.detallesprovedoresarticulos.provedor.nombre + " Al articulo: " + this.articulo.codigo)
        })
      }
      this.emiter.notificarUpload.emit(this.articulo);
    })

    this.router.navigate(['menu/catalogo'])

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
