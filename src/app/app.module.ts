import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { LoginComponent } from './login/login.component';
import { VentasComponent } from './ventas/ventas.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { ComprasComponent } from './compras/compras.component';
import { OtrosComponent } from './otros/otros.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { EdicionArticuloComponent } from './catalogo/emergentes/edicion-articulo/edicion-articulo.component';
import { NuevoArticuloComponent } from './catalogo/emergentes/nuevo-articulo/nuevo-articulo.component';
import { EliminarArticuloComponent } from './catalogo/emergentes/eliminar-articulo/eliminar-articulo.component';
import { NuevaCategoriaComponent } from './catalogo/emergentes/nueva-categoria/nueva-categoria.component';
import { NuevoProvedorComponent } from './catalogo/emergentes/nuevo-provedor/nuevo-provedor.component';
import { NuevoDepartamentoComponent } from './catalogo/emergentes/nuevo-departamento/nuevo-departamento.component';
import { ProductoPrecioComponent } from './ventas/emergentes/producto-precio/producto-precio.component';
import { ProductoCantidadComponent } from './ventas/emergentes/producto-cantidad/producto-cantidad.component';
import { VentaEnEsperaComponent } from './ventas/emergentes/venta-en-espera/venta-en-espera.component';
import { ClientesComponent } from './ventas/emergentes/clientes/clientes.component';
import { VentaDetallesComponent } from './ventas/emergentes/venta-detalles/venta-detalles.component';
import { ImprimirTicketComponent } from './ventas/emergentes/imprimir-ticket/imprimir-ticket.component';
import { VentaConfirmarComponent } from './ventas/emergentes/venta-confirmar/venta-confirmar.component';
import { ProductoBuscarComponent } from './ventas/emergentes/producto-buscar/producto-buscar.component';
import { ArticuloNuevoComponent } from './compras/emergentes/articulo-nuevo/articulo-nuevo.component';
import { CompraEnEsperaComponent } from './compras/emergentes/compra-en-espera/compra-en-espera.component';
import { ProvedoresComponent } from './compras/emergentes/provedores/provedores.component';
import { CompraDetallesComponent } from './compras/emergentes/compra-detalles/compra-detalles.component';
import { CompraConfirmacionComponent } from './compras/emergentes/compra-confirmacion/compra-confirmacion.component';
import { ClienteDetallesComponent } from './otros/emergentes/cliente-detalles/cliente-detalles.component';
import { ProvedorDetallesComponent } from './otros/emergentes/provedor-detalles/provedor-detalles.component';
import { DepartamentoDetallesComponent } from './otros/emergentes/departamento-detalles/departamento-detalles.component';
import { CategoriaDetallesComponent } from './otros/emergentes/categoria-detalles/categoria-detalles.component';
import { RolDetallesComponent } from './configuraciones/emergentes/rol-detalles/rol-detalles.component';
import { EmpleadoDetallesComponent } from './configuraciones/emergentes/empleado-detalles/empleado-detalles.component';
import { UsuarioDetallesComponent } from './configuraciones/emergentes/usuario-detalles/usuario-detalles.component';
import { ArticulosService } from './services/articulos.service';
import { ComprasService } from './services/compras.service';
import { EmpleadosService } from './services/empleados.service';
import { VentasService } from './services/ventas.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EliminarProductosComponent } from './ventas/emergentes/eliminar-productos/eliminar-productos.component';
import { ReporteProductosComponent } from './reportes/emergentes/reporte-productos/reporte-productos.component';
import { ReporteUsuariosComponent } from './reportes/emergentes/reporte-usuarios/reporte-usuarios.component';
import { DetallesVentaComponent } from './consultas/emergentes/detalles-venta/detalles-venta.component';
import { ConfirmarEliminarComponent } from './consultas/emergentes/confirmar-eliminar/confirmar-eliminar.component';
import { EliminarObjetoComponent } from './otros/emergentes/eliminar-objeto/eliminar-objeto.component';
import { EliminarConfirmacionComponent } from './configuraciones/emergentes/eliminar-confirmacion/eliminar-confirmacion.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuPrincipalComponent,
    LoginComponent,
    VentasComponent,
    ReportesComponent,
    CatalogoComponent,
    ConsultasComponent,
    ComprasComponent,
    OtrosComponent,
    ConfiguracionesComponent,
    EdicionArticuloComponent,
    NuevoArticuloComponent,
    EliminarArticuloComponent,
    NuevaCategoriaComponent,
    NuevoProvedorComponent,
    NuevoDepartamentoComponent,
    ProductoPrecioComponent,
    ProductoCantidadComponent,
    VentaEnEsperaComponent,
    ClientesComponent,
    VentaDetallesComponent,
    ImprimirTicketComponent,
    VentaConfirmarComponent,
    ProductoBuscarComponent,
    ArticuloNuevoComponent,
    CompraEnEsperaComponent,
    ProvedoresComponent,
    CompraDetallesComponent,
    CompraConfirmacionComponent,
    ClienteDetallesComponent,
    ProvedorDetallesComponent,
    DepartamentoDetallesComponent,
    CategoriaDetallesComponent,
    RolDetallesComponent,
    EmpleadoDetallesComponent,
    UsuarioDetallesComponent,
    EliminarProductosComponent,
    ReporteProductosComponent,
    ReporteUsuariosComponent,
    DetallesVentaComponent,
    ConfirmarEliminarComponent,
    EliminarObjetoComponent,
    EliminarConfirmacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ArticulosService,
    ComprasService,
    EmpleadosService,
    VentasService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
