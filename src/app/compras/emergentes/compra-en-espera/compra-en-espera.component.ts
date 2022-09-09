import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Compras } from 'src/app/models/Compras.model';
import { Detallescomprasarticulos } from 'src/app/models/Detallescomprasarticulos.model';
import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-compra-en-espera',
  templateUrl: './compra-en-espera.component.html',
  styleUrls: ['./compra-en-espera.component.css']
})
export class CompraEnEsperaComponent implements OnInit {

  compra: Compras;
  @ViewChild("inputInWait") inputInWait: ElementRef;
  compras: Compras[];
  compraSeleccionada: string;

  constructor(private comprasService: ComprasService, private router: Router, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    setTimeout(()=>{
      if(this.inputInWait) this.inputInWait.nativeElement.focus();
    },200);

    this.obtenerVentas();

  }

  /*-----------------OBTENCION DE VENTAS EN ESPERA -------------------------- */
  obtenerVentas(){
    this.comprasService.getComprasEspera().subscribe(response =>{
      this.compras = response as Compras[];
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
    if (this.compras[indice] != null) {
      let row = document.getElementById('inp' + indice.toString());
      row.focus();
    }
  }

  seleccionarFila(event: Event) {
    const row = document.getElementById(
      'tr' + (<HTMLInputElement>event.target).id
    );
    row.setAttribute('class', 'active');

    this.compraSeleccionada = (<HTMLInputElement>event.target).name;
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
    if(this.compraSeleccionada != null){
      let compraSelect = {
        compraSeleccionada: this.compraSeleccionada
      }
      this.emiter.notificarUpload.emit(compraSelect);
      this.router.navigate(['menu/compras']);
    }
  }

  goInputPrincipal() {
    let inputPrincipal = document.getElementById('inwait-window');
    inputPrincipal.focus();
  }

  cantidadProductos(articulos: Detallescomprasarticulos[]): number{
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
