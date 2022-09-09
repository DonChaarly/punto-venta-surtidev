import { ReportesUsuarios } from './../../../models/reportesusuarios.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentasService } from 'src/app/services/ventas.service';
import { ComprasService } from 'src/app/services/compras.service';

@Component({
  selector: 'app-reporte-usuarios',
  templateUrl: './reporte-usuarios.component.html',
  styleUrls: ['./reporte-usuarios.component.css']
})
export class ReporteUsuariosComponent implements OnInit {

  fechaInicio: string;
  inicio: string;
  fechaFin: string;
  usuario:string;
  fin: string
  reportesUsuaros: ReportesUsuarios[];
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
      this.ventaActivo = params['venta'];

    })


    if(this.ventaActivo == "true"){
      this.ventasService.getReporteUsuarios(this.usuario, parseInt(this.inicio), parseInt(this.fin)).subscribe(response =>{
        this.reportesUsuaros = response as ReportesUsuarios[];
        this.reportesUsuaros.forEach(reporte =>{
          this.totalVenta += reporte.venta;
        })
        setTimeout(()=>{
          this.exportTableToExcel();
        },200);

      })
    }else{
      this.comprasService.getReporteUsuarios(this.usuario, parseInt(this.inicio), parseInt(this.fin)).subscribe(response =>{
        this.reportesUsuaros = response as ReportesUsuarios[];
        this.reportesUsuaros.forEach(reporte =>{
          this.totalVenta += reporte.venta;
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

    let filename = 'reporteUsuarios.xls';


    downloadLink.setAttribute("href", 'data:' + dataType + ', ' + tableHTMLReporte)
    downloadLink.setAttribute("download", filename)

  }



}
