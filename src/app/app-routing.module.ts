import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { OtrosComponent } from './otros/otros.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VentasComponent } from './ventas/ventas.component';
import { ComprasComponent } from './compras/compras.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { EdicionArticuloComponent } from './catalogo/emergentes/edicion-articulo/edicion-articulo.component';
import { EliminarArticuloComponent } from './catalogo/emergentes/eliminar-articulo/eliminar-articulo.component';
import { NuevaCategoriaComponent } from './catalogo/emergentes/nueva-categoria/nueva-categoria.component';
import { NuevoArticuloComponent } from './catalogo/emergentes/nuevo-articulo/nuevo-articulo.component';
import { NuevoDepartamentoComponent } from './catalogo/emergentes/nuevo-departamento/nuevo-departamento.component';
import { NuevoProvedorComponent } from './catalogo/emergentes/nuevo-provedor/nuevo-provedor.component';
import { ClientesComponent } from './ventas/emergentes/clientes/clientes.component';
import { ImprimirTicketComponent } from './ventas/emergentes/imprimir-ticket/imprimir-ticket.component';
import { ProductoBuscarComponent } from './ventas/emergentes/producto-buscar/producto-buscar.component';
import { ProductoCantidadComponent } from './ventas/emergentes/producto-cantidad/producto-cantidad.component';
import { ProductoPrecioComponent } from './ventas/emergentes/producto-precio/producto-precio.component';
import { VentaDetallesComponent } from './ventas/emergentes/venta-detalles/venta-detalles.component';
import { VentaEnEsperaComponent } from './ventas/emergentes/venta-en-espera/venta-en-espera.component';
import { VentaConfirmarComponent } from './ventas/emergentes/venta-confirmar/venta-confirmar.component';
import { EliminarProductosComponent } from './ventas/emergentes/eliminar-productos/eliminar-productos.component';
import { ReporteProductosComponent } from './reportes/emergentes/reporte-productos/reporte-productos.component';
import { ReporteUsuariosComponent } from './reportes/emergentes/reporte-usuarios/reporte-usuarios.component';
import { CompraDetallesComponent } from './compras/emergentes/compra-detalles/compra-detalles.component';
import { ArticuloNuevoComponent } from './compras/emergentes/articulo-nuevo/articulo-nuevo.component';
import { CompraEnEsperaComponent } from './compras/emergentes/compra-en-espera/compra-en-espera.component';
import { CompraConfirmacionComponent } from './compras/emergentes/compra-confirmacion/compra-confirmacion.component';
import { DetallesVentaComponent } from './consultas/emergentes/detalles-venta/detalles-venta.component';
import { ConfirmarEliminarComponent } from './consultas/emergentes/confirmar-eliminar/confirmar-eliminar.component';
import { CategoriaDetallesComponent } from './otros/emergentes/categoria-detalles/categoria-detalles.component';
import { ClienteDetallesComponent } from './otros/emergentes/cliente-detalles/cliente-detalles.component';
import { DepartamentoDetallesComponent } from './otros/emergentes/departamento-detalles/departamento-detalles.component';
import { ProvedorDetallesComponent } from './otros/emergentes/provedor-detalles/provedor-detalles.component';
import { EliminarObjetoComponent } from './otros/emergentes/eliminar-objeto/eliminar-objeto.component';
import { EmpleadoDetallesComponent } from './configuraciones/emergentes/empleado-detalles/empleado-detalles.component';
import { RolDetallesComponent } from './configuraciones/emergentes/rol-detalles/rol-detalles.component';
import { UsuarioDetallesComponent } from './configuraciones/emergentes/usuario-detalles/usuario-detalles.component';
import { EliminarConfirmacionComponent } from './configuraciones/emergentes/eliminar-confirmacion/eliminar-confirmacion.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "menu", component: MenuPrincipalComponent, canActivate:[AuthGuard]},
  {path: "menu/consultas", component: ConsultasComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConsultas: true},
      children:[
        {path: "producto-buscar", component: ProductoBuscarComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConsultas: true} },
        {path: "detalles-venta", component:DetallesVentaComponent , canActivate:[AuthGuard, RoleGuard], data:{seccionConsultas: true}},
        {path: "confirmar-eliminar", component:ConfirmarEliminarComponent , canActivate:[AuthGuard, RoleGuard], data:{cancelarVenta: true, cancelarCompra: true}}
      ]},
  {path: "menu/catalogo", component: CatalogoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true},
    children:[
      {path: "nuevo-articulo", component: NuevoArticuloComponent, canActivate:[AuthGuard, RoleGuard], data:{agregarArticulo: true},
        children: [
          {path: "nueva-categoria", component: NuevaCategoriaComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true},
            children:[
              {path: "nuevo-departamento", component: NuevoDepartamentoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true}}
            ]},
          {path: "nuevo-provedor", component: NuevoProvedorComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true}}
        ]
      },
      {path: "edicion-articulo", component: EdicionArticuloComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true},
        children: [
          {path: "nueva-categoria", component: NuevaCategoriaComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true},
            children:[
              {path: "nuevo-departamento", component: NuevoDepartamentoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCatalogo: true}}
            ]}
        ]
      },
      {path: "eliminar-articulo", component: EliminarArticuloComponent, canActivate:[AuthGuard, RoleGuard], data:{eliminarArticulo: true}},



    ]
  },
  {path: "menu/ventas", component: VentasComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true},
    children:[
      {path: "clientes", component: ClientesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true}},
      {path: "producto-buscar", component: ProductoBuscarComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true}},
      {path: "producto-cantidad", component: ProductoCantidadComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true}},
      {path: "producto-precio", component: ProductoPrecioComponent, canActivate:[AuthGuard, RoleGuard], data:{cambiarPrecio: true}},
      {path: "eliminar-productos", component: EliminarProductosComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true}},
      {path: "venta-detalles", component: VentaDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{realizarVenta: true},
        children:[
          {path: "confirmar", component: VentaConfirmarComponent, canActivate:[AuthGuard, RoleGuard], data:{realizarVenta: true},
            children:[
              {path: "imprimir-ticket", component: ImprimirTicketComponent, canActivate:[AuthGuard, RoleGuard], data:{preguntarImprimir: true}}
            ]}
        ]},
      {path: "venta-espera", component: VentaEnEsperaComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionVentas: true}}
    ]},
  {path: "menu/reportes", component: ReportesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionReportes: true},
    children:[
      {path: "venta-productos", component: ReporteProductosComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionReportes: true}},
      {path: "venta-usuarios", component: ReporteUsuariosComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionReportes: true}},
      {path: "producto-buscar", component: ProductoBuscarComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionReportes: true}}
    ]},
  {path: "menu/compras", component: ComprasComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true},
    children:[
      {path: "compra-detalles", component: CompraDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true},
        children:[
          {path: "confirmacion", component: CompraConfirmacionComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true}}
        ]},
      {path: "articulo-nuevo", component: ArticuloNuevoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true},
        children:[
          {path: "nueva-categoria", component: NuevaCategoriaComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true},
            children:[
              {path: "nuevo-departamento", component: NuevoDepartamentoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true}}
            ]}
        ]},
      {path: "compra-espera", component: CompraEnEsperaComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true}},
      {path: "producto-buscar", component: ProductoBuscarComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true}},
      {path: "eliminar-productos", component: EliminarProductosComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionCompras: true}},
    ]},
  {path: "menu/otros", component: OtrosComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true},
    children:[
      {path: "categoria-detalles", component: CategoriaDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true}},
      {path: "cliente-detalles", component: ClienteDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true}},
      {path: "departamento-detalles", component: DepartamentoDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true}},
      {path: "provedor-detalles", component: ProvedorDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true}},
      {path: "eliminar-objeto", component: EliminarObjetoComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionOtros: true}}
    ]},
  {path: "menu/configuraciones", component: ConfiguracionesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConfiguraciones: true},
    children:[
      {path: "empleado-detalles", component: EmpleadoDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConfiguraciones: true}},
      {path: "rol-detalles", component: RolDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConfiguraciones: true}},
      {path: "usuario-detalles", component: UsuarioDetallesComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConfiguraciones: true}},
      {path: "eliminar-confirmacion", component: EliminarConfirmacionComponent, canActivate:[AuthGuard, RoleGuard], data:{seccionConfiguraciones: true}}
    ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
