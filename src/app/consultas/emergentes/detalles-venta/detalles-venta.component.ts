import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Compras } from 'src/app/models/Compras.model';
import { Detallescomprasarticulos } from 'src/app/models/Detallescomprasarticulos.model';
import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Empresas } from 'src/app/models/Empresas.model';
import { Ventas } from 'src/app/models/Ventas.model';
import { ComprasService } from 'src/app/services/compras.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-detalles-venta',
  templateUrl: './detalles-venta.component.html',
  styleUrls: ['./detalles-venta.component.css']
})
export class DetallesVentaComponent implements OnInit {

  ventasActivo: string = "true";
  idVentaCompra: string;
  venta = new Ventas();
  compra = new Compras();
  detallescomprasarticulos: Detallescomprasarticulos[] =[];
  detallesventasarticulos: Detallesventasarticulos[] = [];
  empresa: Empresas = new Empresas();

  cliente: string;
  fecha: string;
  usuario: string;
  folio: string;
  total: number;


  constructor(private route: ActivatedRoute, private comprasService: ComprasService, private ventasService: VentasService, private empleadosService: EmpleadosService) { }

  ngOnInit(): void {
    this.empleadosService.getEmpresa(1).subscribe(response =>{
      this.empresa = response as Empresas;
    })

    this.route.queryParams.subscribe(params=>{
      this.ventasActivo = params['ventasActivo'];
      this.idVentaCompra = params['venta']
    })

    if(this.ventasActivo == "true"){
      this.ventasService.getVenta(parseInt(this.idVentaCompra)).subscribe(response =>{
        this.venta = response as Ventas;
        this.detallesventasarticulos = this.venta.articulos;
        this.cliente = this.venta.cliente.nombre;
        this.fecha = this.venta.fecha;
        this.usuario = this.venta.usuario.username;
        this.folio = this.venta.folio;
        this.total = this.venta.total;
      })
    }else{
      this.comprasService.getCompra(parseInt(this.idVentaCompra)).subscribe(response =>{
        this.compra = response as Compras;
        this.detallescomprasarticulos = this.compra.articulos;
        this.cliente = this.compra.provedor.nombre;
        this.fecha = this.compra.fecha;
        this.usuario = this.compra.usuario.username;
        this.folio = this.compra.folio;
        this.total = this.compra.total;
      })
    }

  }

  /*-------------------IMPRESION DE TICKET-------------------------------------- */

  imprSelec() {
    if(this.ventasActivo){
      var ficha = document.getElementById('imprimir');
      var ventimp = window.open(' ', '');
      if(ventimp){
        ventimp.document.write(ficha.innerHTML);
        ventimp.document.close();
        ventimp.print();
        ventimp.close();
      }
    }
  }
  recortarString(str: string): string {
    return str.substring(0, 17);
  }

}
