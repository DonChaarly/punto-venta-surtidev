import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, Observable, throwError } from 'rxjs';
import { Articulos } from '../models/articulos.model';
import { Cajas } from '../models/cajas.model';
import { Clientes } from '../models/Clientes.model';
import { Detallesventasarticulos } from '../models/Detallesventasarticulos';
import { Empresas } from '../models/Empresas.model';
import { Roles } from '../models/Roles.model';
import { Usuarios } from '../models/Usuarios.model';
import { Ventas } from '../models/Ventas.model';
import { ArticulosService } from '../services/articulos.service';
import { AuthService } from '../services/auth.service';
import { EmpleadosService } from '../services/empleados.service';
import { EventEmitterService } from '../services/event-emitter.service';
import { UtileriaService } from '../services/utileria.service';
import { VentasService } from '../services/ventas.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  venta: Ventas = new Ventas();
  caja: Cajas;
  clientes: Clientes[];
  clienteSeleccionado: Clientes = new Clientes();
  cliente: number = 0;
  //articulosTodos: Articulos[] = [];
  //articulos: Articulos[] = [];
  articulo: Articulos = new Articulos();
  detallesventasarticulos: Detallesventasarticulos[] = [];
  detallesventasarticulo: Detallesventasarticulos =
    new Detallesventasarticulos();
  articulosAgregados = [];
  empresa: Empresas;

  key: string = '';
  coincidence: string;
  listo = false;
  @ViewChild('inputKey') inputKey: ElementRef;
  articuloSeleccionado: string;
  fecha: Date;
  efectivo: number = 0;
  cambio: string = '';
  ventaCreada = false;

  subscription: Subscription;
  rol: Roles;

  constructor(
    private ventasService: VentasService,
    private articulosService: ArticulosService,
    private auth: AuthService,
    private utileria: UtileriaService,
    private router: Router,
    private emiter: EventEmitterService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.empleadosService.getEmpresa(1).subscribe(response =>{
      this.empresa = response as Empresas;
    })
    this.rol = this.auth.rol;
    this.inicializarVariables();
    //this.obtenerArticulos();

    this.obtenerClientes();

    this.subscription = this.emiter.notificarUpload.subscribe((response) => {
      if (response.cantidad != null) {
        if(this.detallesventasarticulos[this.articuloSeleccionado] != undefined){
          this.detallesventasarticulos[this.articuloSeleccionado].cantidad =
          response.cantidad;
          this.calcularImporte(parseInt(this.articuloSeleccionado));
        }

      } else if (response.precio != null) {
        if(this.detallesventasarticulo[this.articuloSeleccionado] != undefined){
          this.detallesventasarticulos[this.articuloSeleccionado].precioUnitario =
          response.precio;
          this.calcularImporte(parseInt(this.articuloSeleccionado));
        }
      } else if (response.eliminar != null) {
        this.detallesventasarticulos = [];
        this.articulosAgregados = [];
        this.articuloSeleccionado = null;
      } else if (response.efectivo != null) {
        this.efectivo = response.efectivo;
        this.cambio = response.cambio;
      } else if (response.ventaHecha != null) {
        if(response.imprimir){
          this.imprSelec();
        }
        this.inicializarVariables();
      }else if(response.ventaSeleccionada != null){
        this.ventasService.getVenta(response.ventaSeleccionada).subscribe(response =>{
          this.venta = response;
          this.detallesventasarticulos = this.venta.articulos;
          this.articulosAgregados = [];
          this.venta.articulos.forEach(articulo =>{
            this.articulosAgregados.push((articulo.articulo.codigo).toLowerCase());
          })
          this.venta.articulos = [];
          this.ventasService.deleteVenta(this.venta.idVentas).subscribe();
          this.venta.idVentas = null;
        })
      }else if(response.eliminarId != null){
        if(this.ventaCreada == true){
          this.eliminarVenta(response.eliminarId);
        }
      }
      if (response.articuloSeleccionado != null) {
        if(this.inputKey) this.inputKey.nativeElement.focus();
        this.key = response.articuloSeleccionado;
        //this.obtenerArticulosLike(this.key);
      } else if (
        response.venta == null &&
        response.ventaDetalles == null &&
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
    this.venta.total = 0;
    this.venta.caja = this.auth.getCaja();
    this.venta.enEspera = false;
    this.fecha = new Date();
    this.venta.fecha = this.utileria.dateFormate(this.fecha);
    this.empleadosService
      .getUsuarioByName(this.auth.usuario.username)
      .subscribe((response) => {
        this.venta.usuario = response as Usuarios;
      });
    this.detallesventasarticulos = [];
    this.venta.articulos = this.detallesventasarticulos;

    this.clienteSeleccionado.idClientes = 1;
    this.clienteSeleccionado.codigo = 'PG';
    this.clienteSeleccionado.nombre = 'PUBLICO GENERAL';
    this.venta.cliente = this.clienteSeleccionado;

    this.ventasService.getUltimoFolio().subscribe((response) => {
      let ultimoFolio = ++(response as number);
      this.venta.folio = ultimoFolio.toString();
      this.listo = true;
    });

    this.cliente = 0;
    this.articulosAgregados = [];

    this.key = '';
    this.coincidence = '';
    this.listo = false;
    this.articuloSeleccionado = null;
  }

  obtenerClientes() {
    this.ventasService.getClientes().subscribe((response) => {
      this.clientes = response as Clientes[];
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
      this.cobrarVenta();
    } else if (event.key == 'Delete') {
      this.key = '';
      if (this.detallesventasarticulos.length > 0)
        this.confirmarEliminarProductos();
    } else if (event.key == 'ArrowDown') {
      this.siguienteFoco(0);
    } else if (event.key == 'Enter' && keyValidado != "") {
        this.articulosService.getArticuloByCodigo(keyValidado).subscribe({
          next: response =>{
            if(this.inputKey) this.inputKey.nativeElement.select();
            if (this.articulosAgregados.includes(keyValidado.toLowerCase())) {
              this.detallesventasarticulos[
                this.articulosAgregados.indexOf(keyValidado.toLowerCase())
              ].cantidad += 1;
            } else {
              this.articulosAgregados.push(keyValidado.toLowerCase());
              this.agregarProducto(response as Articulos);
            }
          },
          error: (e) =>{
          this.buscarProducto();
        }
      })
    }
  }

  /*-------------------GET ARTICULOS LIKE -------------------- */

  /*obtenerArticulos(){
    this.articulosService.getArticulos().subscribe(response =>{
      this.articulosTodos = response as Articulos[];
    })
  }*/

 /* obtenerArticulosLike(keyValidado: string) {
    this.articulos = this.articulosTodos.filter(articulo =>{
      return articulo.codigo.includes(keyValidado.toUpperCase()) || articulo.codigo.includes(keyValidado.toLowerCase());
    });
    if (this.articulos.length > 0) {
      if (
        this.articulos[0].codigo.toLowerCase() == keyValidado.toLowerCase()
      ) {
        this.coincidence = this.articulos[0].nombre;
      } else this.coincidence = '';
    } else this.coincidence = '';
  }*/

  /*---------------------- CREACION DE NUEVOS OBJETOS-------------------------------- */

  agregarProducto(articulo: Articulos) {
    let articuloNuevo = new Detallesventasarticulos();
    articuloNuevo.venta = this.venta;
    articuloNuevo.articulo = articulo;
    articuloNuevo.cantidad = 1;
    articuloNuevo.precioUnitario = articulo.precio1;
    articuloNuevo.importe = 1 * articuloNuevo.precioUnitario;
    this.detallesventasarticulos.push(articuloNuevo);
    this.articuloSeleccionado = (this.detallesventasarticulos.length-1).toString();
    this.cambiarPrecio();
  }

  cambiarPrecioUnitario(indice: number , primerPrecio: boolean){
    let button1 = document.getElementById("inputprice1" + indice);
    let button2 = document.getElementById("inputprice2" + indice);
    if(primerPrecio){
      this.detallesventasarticulos[indice].precioUnitario = this.detallesventasarticulos[indice].articulo.precio1;
      this.calcularImporte(indice);
      button1.setAttribute("class", "priceActive");
      button2.setAttribute("class", "");
    }else{
      this.detallesventasarticulos[indice].precioUnitario = this.detallesventasarticulos[indice].articulo.precio2;
      this.calcularImporte(indice);
      button1.setAttribute("class", "");
      button2.setAttribute("class", "priceActive");
    }

  }

  crearVenta() {
    this.venta.articulos = [];
    this.ventasService.createVenta(this.venta).subscribe((response) => {
      this.venta.idVentas = response.venta.idVentas;
      console.log('Se ha creado la venta con id: ' + response.venta.idVentas);
      this.detallesventasarticulos.forEach((articulo) => {
        articulo.venta = response.venta as Ventas;
        this.ventasService.createDetallesventasarticulo(articulo).subscribe();
        articulo.articulo.existencias -= articulo.cantidad;
        this.articulosService.updateArticulo(articulo.articulo).subscribe();
      });
      this.venta.articulos = this.detallesventasarticulos;
      this.ventaCreada = true;
      this.router.navigate(['menu/ventas/venta-detalles'], {
        queryParams: { idVentas: response.venta.idVentas},
      });
    });
  }

  eliminarVenta(id: number){
    this.detallesventasarticulos.forEach(detallesArticulo =>{
      detallesArticulo.articulo.existencias += detallesArticulo.cantidad;
      this.articulosService.updateArticulo(detallesArticulo.articulo).subscribe();
    })
    this.ventasService.deleteVenta(id).subscribe();
    this.ventaCreada = false;
  }

  /*------------------- CALCULO DE TOTALES ------------------------------------------ */

  total(): string {
    let total = 0;
    for (let i = 0; i < this.detallesventasarticulos.length; i++) {
      total +=
        this.detallesventasarticulos[i].cantidad *
        this.detallesventasarticulos[i].precioUnitario;
    }
    this.venta.total = total;
    return total.toFixed(2);
  }

  calcularImporte(indice: number){
    this.detallesventasarticulos[indice].importe = this.detallesventasarticulos[indice].cantidad * this.detallesventasarticulos[indice].precioUnitario;
  }

  /*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
  siguienteFoco(indice: number) {
    if (this.detallesventasarticulos[indice] != null) {
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
    this.cambiarPrecio();
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
    } else if (event.key == '*' || event.key == 'Enter') {
      this.cambiarCantidad();
    } else if (event.key == '/') {
      this.cambiarPrecio();
    } else if (event.key == 'Delete') {
      this.eliminarArticulo();
    }
  }

  /*-----------------SUMAR Y RESTAR UNO--------------------- */

  sumarUno(indice: string) {
    let index = parseInt(indice);
    this.detallesventasarticulos[index].cantidad += 1;
    this.calcularImporte(index);
  }
  restarUno(indice: string) {
    let index = parseInt(indice);
    if (this.detallesventasarticulos[index].cantidad <= 1) {
      this.eliminarArticulo();
      this.goInputPrincipal();
    } else {
      this.detallesventasarticulos[index].cantidad -= 1;
      this.calcularImporte(index);
    }
  }

  eliminarArticulo() {
    if(this.articuloSeleccionado != null){
      let indice = parseInt(this.articuloSeleccionado)
      this.detallesventasarticulos.splice(indice, indice + 1);
      this.articulosAgregados.splice(indice, indice + 1);
    }

  }

  /*----------------ABRIR NUEVAS VENTANAS--------------------*/

  cambiarCantidad() {
    if (this.articuloSeleccionado != null) {
      console.log(this.articuloSeleccionado);
      let index = parseInt(this.articuloSeleccionado);
      let cantidad = this.detallesventasarticulos[index].cantidad;
      this.router.navigate(['menu/ventas/producto-cantidad'], {
        queryParams: { cantidad: cantidad, indice: index },
      });
    }
  }
  cambiarPrecio() {
    if(this.rol.cambiarPrecio){
      if (this.articuloSeleccionado != null ) {
        let index = parseInt(this.articuloSeleccionado);
          if(this.detallesventasarticulos[index].articulo.modificacionPrecio){
            let precio = this.detallesventasarticulos[index].precioUnitario;
            this.router.navigate(['menu/ventas/producto-precio'], {
              queryParams: { precio: precio, indice: index },
            });
          }
      }
    }

  }

  cambiarCliente(){
    this.ventasService.getCliente(this.cliente).subscribe(response =>{
      this.venta.cliente = response as Clientes;
    })
  }

  buscarProducto() {
    this.router.navigate(['menu/ventas/producto-buscar']);
  }

  confirmarEliminarProductos() {
    this.router.navigate(['menu/ventas/eliminar-productos']);
  }


  cobrarVenta() {
    if(this.rol.realizarVenta){
      if (this.detallesventasarticulos.length > 0) {
        this.crearVenta();
      }
    }
  }


  /*-------------------IMPRESION DE TICKET-------------------------------------- */

  imprSelec() {
    var ficha = document.getElementById('imprimirEsto');
    var ventimp = window.open(' ', '');
    if(ventimp){
      ventimp.document.write(ficha.innerHTML);
      ventimp.document.close();
      ventimp.print();
      ventimp.close();
    }
  }
  recortarString(str: string): string {
    return str.substring(0, 17);
  }

  /*-------------------VENTAS EN ESPERA--------- */

  ventaEnEspera(){
    if(this.detallesventasarticulos.length >0){
      this.venta.enEspera = true;
      let articulosDetalles = this.detallesventasarticulos;
      this.venta.articulos = [];
      this.ventasService.createVenta(this.venta).subscribe((response) => {
        console.log('Se ha creado la venta con id: ' + response.venta.idVentas);
        articulosDetalles.forEach((articulo) => {
          articulo.venta = response.venta as Ventas;
          this.ventasService.createDetallesventasarticulo(articulo).subscribe();
        });
        this.inicializarVariables();
      });


    }
  }

  abrirEnEspera(){
    this.router.navigate(['menu/ventas/venta-espera']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
