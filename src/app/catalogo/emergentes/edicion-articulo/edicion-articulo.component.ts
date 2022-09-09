import { ArticulosService } from './../../../services/articulos.service';
import { Departamentos } from './../../../models/Departamentos.model';
import { Articulos } from './../../../models/articulos.model';
import { Component, OnInit } from '@angular/core';
import { Categorias } from 'src/app/models/Categorias.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/models/Roles.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-edicion-articulo',
  templateUrl: './edicion-articulo.component.html',
  styleUrls: ['./edicion-articulo.component.css']
})
export class EdicionArticuloComponent implements OnInit {



  articulo: Articulos;
  departamentos: Departamentos[] = [];
  departamento: Departamentos;
  categorias: Categorias[] = [];
  categoria: number;

  articuloSeleccionado: string;
  subscription: Subscription;
  rol: Roles;

  constructor(private articulosService: ArticulosService, private route: ActivatedRoute, private router: Router, private emiter: EventEmitterService, private auth: AuthService) { }


  ngOnInit(): void {
    this.rol = this.auth.rol;

    this.inicializarVariables();

    this.subscription = this.emiter.notificarUpload.subscribe(categoria =>{

      if(categoria instanceof Categorias){

        this.articulo.categoria = categoria
        this.categorias.push(categoria)
        this.categoria = this.categorias.length -1;
      }
    })


  }


  /*-------------------INICIALIZADOR DE VARIABLES GLOBALES------------------------------ */
  inicializarVariables(){


    this.route.queryParams.subscribe(params =>{
      this.articuloSeleccionado = params['articuloSeleccionado'];
    })


    this.obtenerArticulo();


  }

  /*-----------BUSQUEDA DE ELEMENTOS-------------------------- */

  obtenerArticulo(){
    this.articulosService.getArticulo(parseInt(this.articuloSeleccionado)).subscribe(response =>{
      this.articulo = response as Articulos;
      this.articulosService.getCategorias().subscribe(response =>{
        this.categorias = response as Categorias[];
        if(this.articulo.categoria != null){
          for(let i = 0; i < this.categorias.length -1; i++){
            if(this.categorias[i].idCategorias == this.articulo.categoria.idCategorias){
              this.categoria = i
            }
          }
        }else{ this.categoria = undefined}
      })


    })

  }



  /*-----------------CALCULO DE DATOS DEL ARTICULO-------------------------- */
  precioPromedio(): number{
    let precioPromedio: number = 0;
    let totalPrecios: number = 0;
    if(this.articulo.provedores != null){
      this.articulo.provedores.forEach(provedor =>{
        totalPrecios += provedor.ultPrecio;
      })
      precioPromedio = totalPrecios / this.articulo.provedores.length;
    }
    return precioPromedio;
  }

  ganancia1(): number{

    let ganancia = (this.articulo.precio1 * 100 / this.articulo.ultimoPrecioCompra) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;
  }
  ganancia2(): number{

    let ganancia = (this.articulo.precio2 * 100 / this.articulo.ultimoPrecioCompra) - 100;
    ganancia = parseFloat(ganancia.toFixed(2));
    return ganancia;
  }

  /*------------------------CAMBIO DE CATEGORIA------------------------- */
  cambiarCategoria(){
    this.articulo.categoria = this.categorias[this.categoria];
  }


  /*---------------------GUARDAR EL ARTICULO Y REDIRIGIR A LA PANTALLA ANTERIOR */
  guardarCambios(){
    if(this.rol.editarArticulo){
      this.articulosService.updateArticulo(this.articulo).subscribe(response =>{

        console.log("El articulo: " + this.articulo.codigo + " ha sido actualizado con exito")
        this.emiter.notificarUpload.emit(this.articulo);
      });
    }
    this.router.navigate(['menu/catalogo']);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}


