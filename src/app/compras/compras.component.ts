import { Subscription } from 'rxjs';
import { Usuarios } from './../models/Usuarios.model';
import { Articulos } from 'src/app/models/articulos.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Provedores } from 'src/app/models/Provedores.model';
import { Compras } from '../models/Compras.model';
import { ArticulosService } from '../services/articulos.service';
import { ComprasService } from '../services/compras.service';
import { Detallescomprasarticulos } from '../models/Detallescomprasarticulos.model';
import { Cajas } from '../models/cajas.model';
import { EmpleadosService } from '../services/empleados.service';
import { AuthService } from '../services/auth.service';
import { UtileriaService } from '../services/utileria.service';
import { Router } from '@angular/router';
import { EventEmitterService } from '../services/event-emitter.service';
import { Detallesprovedoresarticulos } from '../models/Detallesprovedoresarticulos.model';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  compra: Compras = new Compras();
  caja: Cajas;
  provedores: Provedores[];
  provedorSeleccionado: Provedores = new Provedores();
  provedor: number = 0;
  articulos: Articulos[] = [];
  articulo: Articulos = new Articulos();
  detallescomprasarticulos: Detallescomprasarticulos[] = [];
  detallescomprasarticulo: Detallescomprasarticulos =
    new Detallescomprasarticulos();
  articulosAgregados = [];
  detallesprovedoresarticulos: Detallesprovedoresarticulos = new Detallesprovedoresarticulos();

  key: string = '';
  coincidence: string;
  listo = false;
  @ViewChild('inputKey') inputKey: ElementRef;
  articuloSeleccionado: string;
  fecha: Date;
  efectivo: number = 0;
  cambio: string = '';
  subscription: Subscription;
  preguntadoProvedor = false;

  constructor(
    private comprasService: ComprasService,
    private articulosService: ArticulosService,
    private auth: AuthService,
    private utileria: UtileriaService,
    private router: Router,
    private emiter: EventEmitterService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.inicializarVariables();

    this.obtenerProvedores();

    this.subscription = this.emiter.notificarUpload.subscribe((response) => {
      if (response.eliminar != null) {
        this.detallescomprasarticulos = [];
        this.articulosAgregados = [];
        this.articuloSeleccionado = null;
      } else if (response.compraRealizada != null) {
        if(this.detallescomprasarticulos.length > 0){
          this.crearCompra();
        }

      }else if(response.compraSeleccionada != null){
        this.comprasService.getCompra(response.compraSeleccionada).subscribe(response =>{
          this.compra = response;
          this.compra.enEspera = false;
          this.detallescomprasarticulos = this.compra.articulos;
          this.articulosAgregados = [];
          this.compra.articulos.forEach(articulo =>{
            this.articulosAgregados.push((articulo.articulo.codigo).toLowerCase());
          })
          this.compra.articulos = [];
          this.comprasService.deleteCompra(this.compra.idCompras).subscribe();
          this.compra.idCompras = null;
        })
      }else if(response.precioCompra != null){
        if(this.articulosAgregados.includes(response.articulo.codigo.toLowerCase())){
          let indice = this.articulosAgregados.indexOf(response.articulo.codigo.toLowerCase());
          this.detallescomprasarticulos[indice] = response;
        }else{
          this.articulosAgregados.push(response.articulo.codigo.toLowerCase());
          this.detallescomprasarticulos.push(response);
        }

      }
      if (response.articuloSeleccionado != null) {
        if(this.inputKey) this.inputKey.nativeElement.focus();
        this.key = response.articuloSeleccionado;
        //this.obtenerArticulosLike(this.key);
      } else if (
        response.compra == null &&
        response.compraDetalles == null &&
        response.salio == null &&
        response.efectivo == null
      ) {
        setTimeout(() => {
          if(this.inputKey) this.inputKey.nativeElement.focus();
        }, 300);
      }
    });
  }

  /*-------------INICIALIZACION DE VARIABLES --------------------------- */

  inicializarVariables() {
    this.compra.total = 0;
    this.compra.caja = this.auth.getCaja();
    this.compra.enEspera = false;
    this.fecha = new Date();
    this.compra.fecha = this.utileria.dateFormate(this.fecha);
    this.empleadosService
      .getUsuarioByName(this.auth.usuario.username)
      .subscribe((response) => {
        this.compra.usuario = response as Usuarios;
      });
    this.detallescomprasarticulos = [];
    this.compra.articulos = this.detallescomprasarticulos;

    this.provedorSeleccionado.idProvedores = 1;
    this.provedorSeleccionado.codigo = 'SP';
    this.provedorSeleccionado.nombre = 'SIN PROVEDOR';
    this.compra.provedor = this.provedorSeleccionado;


    this.comprasService.getUltimoFolio().subscribe((response) => {
      let ultimoFolio = ++(response as number);
      this.compra.folio = ultimoFolio.toString();
      this.listo = true;
    });

    this.provedor = 0;
    this.articulosAgregados = [];

    this.key = '';
    this.coincidence = '';
    this.listo = false;
    this.articuloSeleccionado = null;
  }

  obtenerProvedores() {
    this.comprasService.getProvedores().subscribe((response) => {
      this.provedores = response as Provedores[];
    });
  }


  /*----------------------METODO PRINCIPAL EVENTO KEY--------------------------- */

  encontrarArticulos(event: any) {
    let keyValidado = this.key.trim();

    if (keyValidado == '') {
      //this.articulos = [];
      //this.coincidence = '';
      if (event.key == 'Enter') {
        this.buscarProducto();
      }
    }

    if (event.key == 'Escape') {
      this.cobrarCompra();
    } else if (event.key == 'Delete') {
      this.key = '';
      if (this.detallescomprasarticulos.length > 0)
        this.confirmarEliminarProductos();
    } else if (event.key == 'ArrowDown') {
      this.siguienteFoco(0);
    } else if (event.key == 'Enter' && keyValidado != "") {
      this.articulosService.getArticuloByCodigo(keyValidado).subscribe({
        next: response =>{
          if(this.inputKey) this.inputKey.nativeElement.select();
          if (this.articulosAgregados.includes(keyValidado.toLowerCase())) {
            let indiceArticulo = this.articulosAgregados.indexOf(keyValidado.toLowerCase());
            this.agregarProducto(response.idArticulos, indiceArticulo)
          } else {
            this.agregarProducto(response.idArticulos);
          }
        },
        error: e =>{
          this.buscarProducto();
        }

      })



    }
  }

  /*-------------------GET ARTICULOS LIKE -------------------- */
  /*obtenerArticulosLike(keyValidado: string) {
    this.articulosService
      .getArticulosLikeCodigo(keyValidado, 0)
      .subscribe((response) => {
        this.articulos = response as Articulos[];
        if (this.articulos.length > 0) {
          if (
            this.articulos[0].codigo.toLowerCase() == keyValidado.toLowerCase()
          ) {
            this.coincidence = this.articulos[0].nombre;
          } else this.coincidence = '';
        } else this.coincidence = '';
      });
  }*/

  /*---------------------- CREACION DE NUEVOS OBJETOS-------------------------------- */

  agregarProducto(idArticulos: number, indice: number = -1) {
    this.detallesArticulo(idArticulos, indice);
  }

  crearCompra() {
    let articulosDetalles = this.detallescomprasarticulos;
    this.compra.articulos = [];
    this.comprasService.createCompra(this.compra).subscribe((response) => {
      console.log('Se ha creado la compra con id: ' + response.compra.idCompras);
      articulosDetalles.forEach((detallescomprasarticulo) => {
        //Actualizacion de datos de articulo
        let articuloAActualizar: Articulos = detallescomprasarticulo.articulo;
        articuloAActualizar.existencias += detallescomprasarticulo.cantidad;
        articuloAActualizar.precio1 = detallescomprasarticulo.precio1Venta;
        articuloAActualizar.precio2 = detallescomprasarticulo.precio2Venta;
        articuloAActualizar.ultimoPrecioCompra = detallescomprasarticulo.precioCompra;
        articuloAActualizar.vecesComprado += 1;
        this.articulosService.updateArticulo(articuloAActualizar).subscribe();

        //Creacion o actualizacion de objeto detallesProvedoresArticulos
        this.detallesprovedoresarticulos.articulo = detallescomprasarticulo.articulo;
        this.detallesprovedoresarticulos.provedor = this.compra.provedor;
        this.detallesprovedoresarticulos.ultPrecio = detallescomprasarticulo.precioCompra;
        if(detallescomprasarticulo.articulo.provedores != null){
          detallescomprasarticulo.articulo.provedores.forEach(detallesprovedorarticulos =>{
            if(detallesprovedorarticulos.provedor.idProvedores == this.compra.provedor.idProvedores){
              this.detallesprovedoresarticulos.idDetallesProvedoresArticulos = detallesprovedorarticulos.idDetallesProvedoresArticulos;
            }
          })
        }
        if(this.detallesprovedoresarticulos.idDetallesProvedoresArticulos != null){
          this.articulosService.updateDetallesprovedoresarticulo(this.detallesprovedoresarticulos).subscribe();
        }else{
          this.articulosService.createDetallesprovedoresarticulo(this.detallesprovedoresarticulos).subscribe();
        }
        //Creacion de objeto detallescomprasarticulo
        detallescomprasarticulo.compra = response.compra as Compras;
        this.comprasService.createDetallescomprasarticulo(detallescomprasarticulo).subscribe();
      });
      this.compra.articulos = articulosDetalles;
      this.inicializarVariables();
    });
  }

  /*------------------- CALCULO DE TOTALES ------------------------------------------ */

  total(): string {
    let total = 0;
    for (let i = 0; i < this.detallescomprasarticulos.length; i++) {
      total +=
        this.detallescomprasarticulos[i].cantidad *
        this.detallescomprasarticulos[i].precioCompra;
    }
    this.compra.total = total;
    return total.toFixed(2);
  }

  calcularImporte(indice: number){
    this.detallescomprasarticulos[indice].importe = this.detallescomprasarticulos[indice].cantidad * this.detallescomprasarticulos[indice].precioCompra;
  }

  /*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
  siguienteFoco(indice: number) {
    if (this.detallescomprasarticulos[indice] != null) {
      let row = document.getElementById('input' + indice.toString());
      row.focus();
    }
  }

  seleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'active');

    this.articuloSeleccionado = (<HTMLInputElement>event.target).name;
  }

  deseleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', '');
  }

  dobleClick(indice: string) {
    let articulo = this.detallescomprasarticulos[indice].articulo.idArticulos;
    this.detallesArticulo(articulo, parseInt(indice));
  }

  goInputPrincipal() {
    let inputPrincipal = document.getElementById('key');
    inputPrincipal.focus();
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
    } else if (event.key == '+') {
      this.sumarUno(indice);
    } else if (event.key == '-') {
      this.restarUno(indice);
    } else if (event.key == 'Enter') {
      this.detallesArticulo(this.detallescomprasarticulos[indice].articulo.idArticulos, index);
    } else if (event.key == 'Delete') {
      this.eliminarArticulo();
    }
  }

  /*-----------------SUMAR Y RESTAR UNO--------------------- */

  sumarUno(indice: string) {
    let index = parseInt(indice);
    this.detallescomprasarticulos[index].cantidad += 1;
    this.calcularImporte(index);
  }
  restarUno(indice: string) {
    let index = parseInt(indice);
    if (this.detallescomprasarticulos[index].cantidad <= 1) {
      this.eliminarArticulo();
      this.goInputPrincipal();
    } else {
      this.detallescomprasarticulos[index].cantidad -= 1;
      this.calcularImporte(index);
    }
  }

  eliminarArticulo() {
    if(this.articuloSeleccionado != null){
      let indice = parseInt(this.articuloSeleccionado)
      this.detallescomprasarticulos.splice(indice, indice + 1);
      this.articulosAgregados.splice(indice, indice + 1);
    }

  }

  /*----------------ABRIR NUEVAS VENTANAS--------------------*/


  cambiarProvedor(){
    this.comprasService.getProvedor(this.provedor).subscribe(response =>{
      this.compra.provedor = response as Provedores;
    })
  }

  buscarProducto() {
    this.router.navigate(['menu/compras/producto-buscar']);
  }

  confirmarEliminarProductos() {
    this.router.navigate(['menu/compras/eliminar-productos']);
  }


  cobrarCompra() {
    if(!this.preguntadoProvedor && this.compra.provedor.idProvedores == 1){
      this.preguntadoProvedor = true;
      alert("Dejar sin provedor la compra?");
    }else{
      if (this.detallescomprasarticulos.length > 0) {
        this.router.navigate(['menu/compras/compra-detalles'], {
          queryParams: { total: this.compra.total,
                         provedor: this.compra.provedor.nombre,
                         fecha: this.compra.fecha,
                         cajero: this.compra.caja.nombre,
                         folio: this.compra.folio},
        });
      }
    }
  }

  detallesArticulo(idArticulos: number = 0, indice: number = -1){
    if(indice != -1){
      let cantidad = this.detallescomprasarticulos[indice].cantidad;
      let precioCompra = this.detallescomprasarticulos[indice].precioCompra;
      let precio1Venta = this.detallescomprasarticulos[indice].precio1Venta;
      let precio2Venta = this.detallescomprasarticulos[indice].precio2Venta;
      this.router.navigate(['menu/compras/articulo-nuevo'], {queryParams:{idArticulos: idArticulos,
                                                                          cantidad: cantidad,
                                                                          precioCompra: precioCompra,
                                                                          precio1Venta: precio1Venta,
                                                                          precio2Venta: precio2Venta}});
    }else{
      this.router.navigate(['menu/compras/articulo-nuevo'], {queryParams:{idArticulos: idArticulos,
                                                                          cantidad: 1,
                                                                          precioCompra: 1}});
    }


  }

  editarProducto(){
    if(this.articuloSeleccionado != null && this.articuloSeleccionado != ''){
      let idArticulos = this.detallescomprasarticulos[this.articuloSeleccionado].articulo.idArticulos;
      this.detallesArticulo(idArticulos, parseInt(this.articuloSeleccionado));
    }
  }

  crearProducto(){
    this.router.navigate(['menu/compras/articulo-nuevo']);
  }



  /*-------------------VENTAS EN ESPERA--------- */

  compraEnEspera(){
    if(this.detallescomprasarticulos.length >0){
      let articulosDetalles = this.detallescomprasarticulos;
      this.compra.articulos = [];
      this.compra.enEspera = true;
      this.comprasService.createCompra(this.compra).subscribe((response) => {
        console.log('Se ha creado la compra con id: ' + response.compra.idCompras);
        articulosDetalles.forEach((detallescomprasarticulo) => {

          //Creacion de objeto detallescomprasarticulo
          detallescomprasarticulo.compra = response.compra as Compras;
          this.comprasService.createDetallescomprasarticulo(detallescomprasarticulo).subscribe();
        });
        this.compra.articulos = articulosDetalles;
        this.inicializarVariables();
    });


    }
  }

  abrirEnEspera(){
    this.router.navigate(['menu/compras/compra-espera']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
