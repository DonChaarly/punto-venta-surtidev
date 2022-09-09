import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Articulos } from '../models/articulos.model';
import { Cajas } from '../models/cajas.model';
import { Compras } from '../models/Compras.model';
import { Roles } from '../models/Roles.model';
import { Usuarios } from '../models/Usuarios.model';
import { Ventas } from '../models/Ventas.model';
import { ArticulosService } from '../services/articulos.service';
import { AuthService } from '../services/auth.service';
import { ComprasService } from '../services/compras.service';
import { EmpleadosService } from '../services/empleados.service';
import { EventEmitterService } from '../services/event-emitter.service';
import { UtileriaService } from '../services/utileria.service';
import { VentasService } from '../services/ventas.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  cajas: Cajas[] = [];
  caja: Cajas;
  articulo: Articulos;
  ventas: Ventas[] = [];
  venta: Ventas;
  compras: Compras[] = [];
  compra: Compras;
  usuarios: Usuarios[];
  fechaInicio = this.utileria.dateFormate(new Date());
  fechaFin = this.utileria.dateFormate(new Date());
  usuarioSelec: string = "0";
  ventasActivo: boolean = true;
  clienteProvedor = "Cliente";
  findBy = "article";
  ventaCompraSeleccionada: string;
  strToSearch: string = "";
  @ViewChild("consultasFinder") consultasFinder: ElementRef;

  subscription: Subscription;
  rol: Roles;
  page: number = 0;
  totalPages: number;


  constructor(private ventasService: VentasService, private comprasService: ComprasService,
    private articulosService: ArticulosService,
    private empeladosService: EmpleadosService,
    private utileria: UtileriaService,
    private router: Router,
    private emiter: EventEmitterService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.rol = this.auth.rol;

    this.obtenerVentas(0);
    this.obtenerUsuarios();


    setTimeout(()=>{
      if(this.consultasFinder) this.consultasFinder.nativeElement.focus();
    }, 300);
    this.inicializarVariables();

    this.subscription = this.emiter.notificarUpload.subscribe(response =>{
      if(response.articuloSeleccionado != null){
        if(this.consultasFinder) this.consultasFinder.nativeElement.focus();
        this.strToSearch = response.articuloSeleccionado;
      }else if(response.eliminar){
        this.eliminarVentaCompra();
      }else{
        setTimeout(()=>{
          if(this.consultasFinder) this.consultasFinder.nativeElement.focus();
        },300);
      }
    })


  }

  inicializarVariables(){

    this.usuarioSelec = "0";
    this.strToSearch = "";
    this.fechaInicio = this.utileria.dateFormate(new Date());
    this.fechaFin = this.utileria.dateFormate(new Date());
    this.findBy = "article"

  }

  /*-----------------OBTENCION DE VENTAS Y COMPRAS ---------------------- */
  obtenerUsuarios(){
    this.empeladosService.getUsuarios().subscribe(response =>{
      this.usuarios = response as Usuarios[];
    })
  }
  obtenerVentas(page: number, codigo: string = "**", usuario: string = "**", folio: string = "**", cliente: string = "**", total: string = "**"){
    //Cambio de fecha a la actual en caso de que el usuario no tenga permiso de cambiar la fecha
    if(!this.rol.cambiarFechaConsulta){
      this.fechaInicio = this.utileria.dateFormate(new Date());
      this.fechaFin = this.utileria.dateFormate(new Date());
    }

    let fechaInicio = this.fechaInicio.replace("-", "");
    fechaInicio = fechaInicio.replace("-", "");
    let fechaFin = this.fechaFin.replace("-", "");
    fechaFin = fechaFin.replace("-", "");

    this.ventasService.getVentasByDate(codigo, usuario, folio, cliente, total, parseInt(fechaInicio), parseInt(fechaFin), page).subscribe(response =>{
      this.ventas = response.content as Ventas[];
      this.totalPages = response.totalPages;
    })
  }
  obtenerCompras(page: number, codigo: string = "**", usuario: string = "**", folio: string = "**", provedor: string = "**", total: string = "**"){
    let fechaInicio = this.fechaInicio.replace("-", "");
    fechaInicio = fechaInicio.replace("-", "");
    let fechaFin = this.fechaFin.replace("-", "");
    fechaFin = fechaFin.replace("-", "");

    this.comprasService.getComprasByDate(codigo, usuario, folio, provedor, total, parseInt(fechaInicio), parseInt(fechaFin), page).subscribe(response =>{
      this.compras = response.content as Compras[];
      this.totalPages = response.totalPages;
    })
  }


  /*-----------------CAMBIO DE VENTAS A COMPRAS--------------------------- */
  cambiarEstiloActivo(ventana: string){

    if(ventana == 'ventas'){
      this.ventasActivo = true;
      let ventasDiv = document.getElementById('ventas');
      ventasDiv.setAttribute('class', 'container-consultas__nav--active');
      let comprasDiv = document.getElementById('compras');
      comprasDiv.setAttribute('class', 'container-consultas__nav');
      this.clienteProvedor = "Cliente";
      this.inicializarVariables();
      this.obtenerVentas(0);
    }else{
      this.ventasActivo = false;
      let comprasDiv = document.getElementById('compras');
      comprasDiv.setAttribute('class', 'container-consultas__nav--active');
      let ventasDiv = document.getElementById('ventas');
      ventasDiv.setAttribute('class', 'container-consultas__nav');
      this.clienteProvedor = "Provedor";
      this.inicializarVariables();
      this.obtenerCompras(0);
    }
  }

  /*------------------------EVENTO KEY PRINCIPAL-------------------------- */

  eventoKeyPrincipal(event: any){


    if(event.key == "Enter" || event == "Enter"){
      this.buscarVentaCompra(this.page-1);
    }else if(event.key == "ArrowDown"){
        this.siguienteFoco(0);
    }else{
      if(this.findBy == "article"){
        this.abrirBuscarArticulo();
      }
    }



  }

  buscarVentaCompra(page: number){
    let strToSearchValidate = this.strToSearch.trim();
    let codigo = strToSearchValidate;
    let folio = strToSearchValidate;
    let cliente = strToSearchValidate;
    let total = strToSearchValidate;
    let usuario = this.usuarioSelec;
    if(this.findBy != "article") codigo = "**";
    if(this.findBy != "folio") folio = "**";
    if(this.findBy != "client") cliente = "**";
    if(this.findBy != "total") total = "**";
    if(this.usuarioSelec == "0") usuario = "**";

    if(strToSearchValidate == ""){
      if(this.ventasActivo) this.obtenerVentas(page, "**", usuario, "**", "**", "**");
      else this.obtenerCompras(page, "**", usuario, "**", "**", "**");
    }else{
      if(this.ventasActivo) this.obtenerVentas(page, codigo, usuario, folio, cliente, total);
      else this.obtenerCompras(page, codigo, usuario, folio, cliente, total);
    }
  }

  /*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
  siguienteFoco(indice: number) {
    if (this.ventas[indice] != null) {
      let row = document.getElementById('input' + indice.toString());
      row.focus();
    }
  }

  seleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'active');

    this.ventaCompraSeleccionada = (<HTMLInputElement>event.target).name;
  }

  deseleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', '');
  }


  dobleClick(indice: string) {
    this.detallesCompra();
  }

  goInputPrincipal() {
    let inputPrincipal = document.getElementById('consultas-finder');
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
    } else if (event.key == '*' || event.key == 'Enter') {
      this.detallesCompra();
    }
  }

  /*------------------MAMEJO DE VENTANAS------------------------------ */

  abrirBuscarArticulo(){
    this.router.navigate(['menu/consultas/producto-buscar']);
  }

  detallesCompra(){
    let id = this.ventas[this.ventaCompraSeleccionada].idVentas
    if(!this.ventasActivo) id = this.compras[this.ventaCompraSeleccionada].idCompras;
    this.router.navigate(['menu/consultas/detalles-venta'], {queryParams:{venta: id, ventasActivo: this.ventasActivo}})
  }

  cancelarVentaCompra(folio: string){
    this.router.navigate(['menu/consultas/confirmar-eliminar'], {queryParams:{ventasActivo: this.ventasActivo, folio: folio }})
  }


  /*-------------ELIMINAR VENTA O COMPRA ---------------------- */
  eliminarVentaCompra(){
    let articulo: Articulos;

    if(this.ventasActivo){
      //Verificacion de permisos del usuario para eliminar Ventas
      if(this.rol.cancelarVenta){
        this.ventas[this.ventaCompraSeleccionada].articulos.forEach(articulosDetalles=>{
          articulo = articulosDetalles.articulo;
          articulo.existencias += articulosDetalles.cantidad;
          this.articulosService.updateArticulo(articulo).subscribe();
        })
        this.ventasService.deleteVenta(this.ventas[this.ventaCompraSeleccionada].idVentas).subscribe(response =>{
          this.obtenerVentas(this.page);
          this.ventaCompraSeleccionada = "";
        });
      }
    }else{
      //Verificacion de permisos del usuario para eliminar Compras
      if(this.rol.cancelarCompra){
        this.compras[this.ventaCompraSeleccionada].articulos.forEach(articulosDetalles=>{
          articulo = articulosDetalles.articulo;
          articulo.existencias -= articulosDetalles.cantidad;
          this.articulosService.updateArticulo(articulo).subscribe();
        })
        this.comprasService.deleteCompra(this.compras[this.ventaCompraSeleccionada].idCompras).subscribe(response =>{
          this.obtenerCompras(this.page);
          this.ventaCompraSeleccionada = "";
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /*---------------------CAMBIAR EL NUMERO DE PAGINA------------------------------ */

  cambiarPagina(event: any, page){
    if(event.key == "Enter" || event == "Enter"){
      if(this.page >= 1 && this.page <= this.totalPages){
        this.buscarVentaCompra(page -1);
      }
      let arrowleft = document.getElementById("arrowLeftConsulta");
      let arrowRight = document.getElementById("arrowRightConsulta");
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
