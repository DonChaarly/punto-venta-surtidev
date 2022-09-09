import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Ventas } from 'src/app/models/Ventas.model';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-venta-en-espera',
  templateUrl: './venta-en-espera.component.html',
  styleUrls: ['./venta-en-espera.component.css']
})
export class VentaEnEsperaComponent implements OnInit {

  venta: Ventas;
  @ViewChild("inputInWait") inputInWait: ElementRef;
  ventas: Ventas[];
  ventaSeleccionada: string;

  constructor(private ventasService: VentasService, private router: Router, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    setTimeout(()=>{
      if(this.inputInWait) this.inputInWait.nativeElement.focus();
    },200);

    this.obtenerVentas();

  }

  /*-----------------OBTENCION DE VENTAS EN ESPERA -------------------------- */
  obtenerVentas(){
    this.ventasService.getVentasEspera().subscribe(response =>{
      this.ventas = response as Ventas[];
    })
  }

  /*--------------------------EVENTO KEY en input escondido------------------------------ */
  eventoKey(event: any){

    if(event.key == "ArrowDown"){
      this.siguienteFoco(0);
    }else if(event.key == "Escape"){
      this.emiter.notificarUpload.emit("nada");
      this.router.navigate(['../'])
    }
  }

  /*------------------EVENTO KEYUP EN FILAS--------------------------------- */
  inputKeypress(event: any, indice: string){
    let index = parseInt(indice);

    if(event.key == "ArrowDown"){
      this.siguienteFoco(index + 1)
    }else if(event.key == "ArrowUp"){
      if(index == 0){
        this.goInputPrincipal();
      }
      this.siguienteFoco(index - 1)
    }else if(event.key == "Enter"){
      this.seleccionarVenta();
    }

  }


  /*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
  siguienteFoco(indice: number) {
    if (this.ventas[indice] != null) {
      let row = document.getElementById('inp' + indice.toString());
      row.focus();
    }
  }

  seleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'active');

    this.ventaSeleccionada = (<HTMLInputElement>event.target).name;
  }

  deseleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', '');
  }


  dobleClick(indice: string) {
    this.seleccionarVenta();
  }

  seleccionarVenta(){
    if(this.ventaSeleccionada != null){
      let ventaSelect = {
        ventaSeleccionada: this.ventaSeleccionada
      }
      this.emiter.notificarUpload.emit(ventaSelect);
      this.router.navigate(['menu/ventas']);
    }
  }

  goInputPrincipal() {
    let inputPrincipal = document.getElementById('inwait-window');
    inputPrincipal.focus();
  }

  cantidadProductos(articulos: Detallesventasarticulos[]): number{
    let cantidad = 0;
    articulos.forEach(articulo=>{
      cantidad += articulo.cantidad;
    })
    return cantidad;

  }

  total(articulos: Detallesventasarticulos[]): number{
    let total = 0;
    articulos.forEach(articulo =>{
      total += articulo.cantidad * articulo.precioUnitario;
    })
    return total;
  }

}
