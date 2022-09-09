import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VentasService } from 'src/app/services/ventas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-producto-cantidad',
  templateUrl: './producto-cantidad.component.html',
  styleUrls: ['./producto-cantidad.component.css']
})
export class ProductoCantidadComponent implements OnInit {

  detallesventasarticulos: Detallesventasarticulos;
  indice: number;
  cantidad: number;
  @ViewChild("inputAmount") inputAmount: ElementRef;

  constructor(private ventasService: VentasService, private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params =>{
      this.indice = params['indice'];
      this.cantidad = params['cantidad'];

      setTimeout(()=>{
        if(this.inputAmount) this.inputAmount.nativeElement.focus();
      },100);
    })



  }

  cambiarCantidad(){
    let cantidad = {
      cantidad: this.cantidad,
      indice: this.indice
    }
    this.emiter.notificarUpload.emit(cantidad)
    this.router.navigate(['menu/ventas'])
  }

  eventoKey(event: any){
    if(event.key == "Escape"){
      this.router.navigate(['menu/ventas']);
      this.emiter.notificarUpload.emit("nada");
    }
  }

}
