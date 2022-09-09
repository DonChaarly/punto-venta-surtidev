import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clientes } from '../models/Clientes.model';
import { Departamentos } from '../models/Departamentos.model';
import { Provedores } from '../models/Provedores.model';
import { Roles } from '../models/Roles.model';
import { Usuarios } from '../models/Usuarios.model';
import { ArticulosService } from '../services/articulos.service';
import { AuthService } from '../services/auth.service';
import { ComprasService } from '../services/compras.service';
import { EmpleadosService } from '../services/empleados.service';
import { EventEmitterService } from '../services/event-emitter.service';
import { UtileriaService } from '../services/utileria.service';
import { VentasService } from '../services/ventas.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  fechaInicio: string = this.util.dateFormate(new Date());
  fechaFin: string = this.util.dateFormate(new Date());
  usuarios: Usuarios[];
  usuarioSelec: string = "all";
  clientes: Clientes[];
  provedores: Provedores[];
  clienteSelec: string = "all";
  departamentos: Departamentos[];
  departamentoSelec: string = "all";
  productoSelec: string = "Todos";
  ventasActivo: boolean = true;

  subscription: Subscription;
  rol: Roles;




  constructor(private util: UtileriaService,
              private empleadosService: EmpleadosService,
              private ventasService: VentasService,
              private articulosService: ArticulosService,
              private router: Router,
              private emiter: EventEmitterService,
              private comprasService: ComprasService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.rol = this.auth.rol;
    this.inicializarVariables();

    this.subscription = this.emiter.notificarUpload.subscribe(response =>{
      if(response.articuloSeleccionado != null){
        this.productoSelec = response.articuloSeleccionado
      }else{
        this.productoSelec = response
      }
    })

  }


  /*-------------------OBTENCION DE OBJETOS--------------------- */

  inicializarVariables(){
    this.obtenerUsuarios();
    this.obtenerClientes();
    this.obtenerProvedores();
    this.obtenerDepartamentos();
  }

  obtenerUsuarios(){
    this.empleadosService.getUsuarios().subscribe(response =>{
      this.usuarios = response as Usuarios[];
    })
  }
  obtenerClientes(){
    this.ventasService.getClientes().subscribe(response =>{
      this.clientes = response as Clientes[];
    })
  }
  obtenerDepartamentos(){
    this.articulosService.getDepartamentos().subscribe(response =>{
      this.departamentos = response as Departamentos[];
    })
  }
  obtenerProvedores(){
    this.comprasService.getProvedores().subscribe(response =>{
      this.provedores = response as Provedores[];
    })
  }

  /*--------------MOSTRAR VENTANA BUSCAR PRODUCTO--------------- */

  ventanaBuscarProductos(){
    this.router.navigate(['menu/reportes/producto-buscar']);
  }

  /*-------------CLICK BOTON PRINCIPAL----------------- */
  verReporte(){
    let usuario = this.usuarioSelec;
    let cliente = this.clienteSelec;
    let departamento = this.departamentoSelec;
    let producto = this.productoSelec;
    if(!this.rol.cambiarFechaReporte){
      this.fechaInicio = this.util.dateFormate(new Date());
      this.fechaFin = this.util.dateFormate(new Date());
    }
    if(cliente == "all" && departamento == "all" && producto == "Todos"){
      if(usuario == "all") usuario = "**"
      this.router.navigate(['menu/reportes/venta-usuarios'], {queryParams:{usuario: usuario,
                                                                           fechaInicio: this.fechaInicio,
                                                                           fechaFin: this.fechaFin,
                                                                           venta: this.ventasActivo}})
    }else{
      if(usuario == "all") usuario = "**"
      if(cliente == "all") cliente = "**"
      if(departamento == "all") departamento = "**"
      if(producto == "Todos") producto = "**"
      this.router.navigate(['menu/reportes/venta-productos'],
        {queryParams:{cliente: cliente,
                      usuario: usuario,
                      departamento: departamento,
                      codigo: producto,
                      fechaInicio: this.fechaInicio,
                      fechaFin: this.fechaFin,
                      venta: this.ventasActivo}})
    }
  }

  cambiarEstiloActivo(event: Event){
    if((<HTMLDivElement>event.target).id == 'ventas'){
      this.ventasActivo = true;
      let ventasDiv = document.getElementById('ventas');
      ventasDiv.setAttribute('class', 'container-reportes__nav--active');
      let comprasDiv = document.getElementById('compras');
      comprasDiv.setAttribute('class', 'container-reportes__nav');
    }else{
      this.ventasActivo = false;
      let comprasDiv = document.getElementById('compras');
      comprasDiv.setAttribute('class', 'container-reportes__nav--active');
      let ventasDiv = document.getElementById('ventas');
      ventasDiv.setAttribute('class', 'container-reportes__nav');
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
