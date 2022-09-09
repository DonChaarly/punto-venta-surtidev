import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesProductos } from 'src/app/models/reportesproductos.model';
import { ComprasService } from 'src/app/services/compras.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit {

  fechaInicio: string;
  inicio: string;
  fechaFin: string;
  cliente: string;
  usuario:string;
  codigo: string;
  departamento: string;
  fin: string
  reportesProductos: ReportesProductos[];
  totalVenta: number = 0;
  ventaActivo: string;



  constructor(private route: ActivatedRoute, private ventasService: VentasService, private comprasService: ComprasService) { }

  ngOnInit(): void {


    this.route.queryParams.subscribe(params =>{
      this.fechaInicio = params['fechaInicio'];
      this.inicio = this.fechaInicio.replace("-", "")
      this.inicio = this.inicio.replace("-", "")
      this.fechaFin = params['fechaFin']
      this.fin = this.fechaFin.replace("-", "")
      this.fin = this.fin.replace("-", "")
      this.usuario = params['usuario']
      this.cliente = params['cliente']
      this.codigo = params['codigo']
      this.departamento = params['departamento']
      this.ventaActivo = params['venta']

    })

    if(this.ventaActivo == 'true'){
      this.ventasService.getReporteProductos(this.cliente, this.usuario,this.codigo, this.departamento, parseInt(this.inicio), parseInt(this.fin)).subscribe(response =>{
        this.reportesProductos = response as ReportesProductos[];
        this.reportesProductos.forEach(reporte =>{
          this.totalVenta += reporte.importe;
        })
        setTimeout(()=>{
          this.exportTableToExcel();
        },200);
      })
    }else{
      this.comprasService.getReporteProductos(this.cliente, this.usuario,this.codigo, this.departamento, parseInt(this.inicio), parseInt(this.fin)).subscribe(response =>{
        this.reportesProductos = response as ReportesProductos[];
        this.reportesProductos.forEach(reporte =>{
          this.totalVenta += reporte.importe;
        })
        setTimeout(()=>{
          this.exportTableToExcel();
        },200);
      })
    }

  }

  exportTableToExcel(){
    let downloadLink = document.getElementById("linkDownload");
    var dataType = 'application/vnd.ms-excel';
    let tableReporte = document.getElementById("reporte");
    let tableHTMLReporte = tableReporte.outerHTML.replace(/ /g, '%20');

    let filename = 'reporteProductos.xls';

    downloadLink.setAttribute("href", 'data:' + dataType + ', ' + tableHTMLReporte)
    downloadLink.setAttribute("download", filename)

  }

}
