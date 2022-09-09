import { Detallescomprasarticulos } from './../../../models/Detallescomprasarticulos.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulos } from 'src/app/models/articulos.model';
import { Categorias } from 'src/app/models/Categorias.model';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { Detallesprovedoresarticulos } from 'src/app/models/Detallesprovedoresarticulos.model';
import { Provedores } from 'src/app/models/Provedores.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articulo-nuevo',
  templateUrl: './articulo-nuevo.component.html',
  styleUrls: ['./articulo-nuevo.component.css']
})
export class ArticuloNuevoComponent implements OnInit {

  detallescomprasarticulos: Detallescomprasarticulos = new Detallescomprasarticulos();
  articulo: Articulos = new Articulos();
  departamentos: Departamentos[] = [];
  departamento: Departamentos;
  categorias: Categorias[] = [];
  categoria: number;
  listo = false
  promedio: number;
  cantidadNueva: number = 1;
  precioCompraNuevo: number = 1;
  precio1Nuevo: number;
  precio2Nuevo: number;
  subscipcion: Subscription;
  @ViewChild('amountNew') amountNew: ElementRef;
  create: boolean = false;

  constructor(private articulosService: ArticulosService, private comprasService: ComprasService, private emiter: EventEmitterService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {



    this.route.queryParams.subscribe(params =>{


      if(params['idArticulos'] != 0 && params['idArticulos'] != null){
        this.articulosService.getArticulo(params['idArticulos']).subscribe(response =>{
          this.articulo = response as Articulos;
          this.precio1Nuevo = this.articulo.precio1;
          this.precio2Nuevo = this.articulo.precio2;
          this.cantidadNueva = params['cantidad'];
          this.precioCompraNuevo = params['precioCompra'];
          if(params['precio1Venta'] != null){
            this.precio1Nuevo = params['precio1Venta'];
            this.precio2Nuevo = params['precio2Venta']
          }
          this.articulosService.getCategorias().subscribe(categorias =>{
            this.categorias = categorias as Categorias[];
            if(this.articulo.categoria != null){
              for(let i = 0; i < this.categorias.length -1; i++){
                if(this.categorias[i].idCategorias == this.articulo.categoria.idCategorias){
                  this.categoria = i
                }
              }
              this.listo = true
              this.promedio = this.precioPromedio();
            }else{ this.categoria = undefined}
          })
          if(this.amountNew) this.amountNew.nativeElement.focus();
        })

      }else{
        this.create = true;
        this.listo = true
        this.promedio = this.precioPromedio();
      }
    })


    this.inicializarVariables();

    this.subscipcion = this.emiter.notificarUpload.subscribe(categoria =>{
      if(categoria instanceof Categorias){

        this.articulo.categoria = categoria
        this.categorias.push(categoria)
        this.categoria = this.categorias.length -1;
      }
    })

  }

  /*------------------INICIANDO VARIABLES--------------------- */
  inicializarVariables(){
    this.obtenerCategorias();

  }

  /*------------------BUSQUEDA DE ELEMENTOS------------ */
  obtenerCategorias(){
    this.articulosService.getCategorias().subscribe(response =>{
      this.categorias = response as Categorias[];

    })
  }

  /*-------------------------CAMBIAR CATEGORIA y PROVEDOR---------------- */

  precioPromedio(): number{
    let precioPromedio: number = 0;
    let totalPrecios: number = 0;
    if(this.articulo.provedores != undefined){
      if(this.articulo.provedores.length > 0){
        this.articulo.provedores.forEach(provedor =>{
          totalPrecios += provedor.ultPrecio;
        })
        precioPromedio = totalPrecios / this.articulo.provedores.length;
      }
    }

    return precioPromedio;
  }

  cambiarCategoria(){
    this.articulo.categoria = this.categorias[this.categoria];

  }

  /*-----------------------OBTENER GANACIAS------------------ */
  ganancia1(){
    let ganancia = (this.precio1Nuevo * 100 / this.precioCompraNuevo) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;

  }
  ganancia2(){
    let ganancia = (this.precio2Nuevo * 100 / this.precioCompraNuevo) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;

  }

  /*------------------------CREAR EL ARTICULO------------------ */

  guardarArticulo(){
    if(this.create) {
      this.articulo.existencias = 0;
      this.articulo.precio1 = this.precio1Nuevo;
      this.articulo.precio2 = this.precio2Nuevo;
      this.articulo.ultimoPrecioCompra = this.precioCompraNuevo;
      this.articulosService.createArticulo(this.articulo).subscribe(response =>{
        this.detallescomprasarticulos.articulo = response.articulo as Articulos;
        this.guardarDetallesArticulo();
      });
    }
    else{
      this.articulosService.updateArticulo(this.articulo).subscribe();
      this.detallescomprasarticulos.articulo = this.articulo;
      this.guardarDetallesArticulo();
    }
  }

  guardarDetallesArticulo(){
      this.detallescomprasarticulos.cantidad = this.cantidadNueva;
      this.detallescomprasarticulos.importe = this.cantidadNueva * this.precioCompraNuevo;
      this.detallescomprasarticulos.precio1Venta = this.precio1Nuevo;
      this.detallescomprasarticulos.precio2Venta = this.precio2Nuevo;
      this.detallescomprasarticulos.precioCompra = this.precioCompraNuevo;
      this.subscipcion.unsubscribe();
      this.emiter.notificarUpload.emit(this.detallescomprasarticulos);
      this.router.navigate(['menu/compras']);
  }

  eventoKey(event: any){
    if(event.key == "Escape"){
      this.regresarVentanaAnterioro();
    }
  }

  regresarVentanaAnterioro(){
    this.subscipcion.unsubscribe();
    this.router.navigate(['menu/compras']);
  }

}
