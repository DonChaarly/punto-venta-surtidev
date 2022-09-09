import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-producto-precio',
  templateUrl: './producto-precio.component.html',
  styleUrls: ['./producto-precio.component.css']
})
export class ProductoPrecioComponent implements OnInit {

  detallesventaarticulos: Detallesventasarticulos;
  indice: number;
  precio: number;
  @ViewChild('inputPrice') inputPrice: ElementRef

  constructor(private ventasService: VentasService, private route: ActivatedRoute, private router: Router, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params=>{
      this.indice = params['indice'];
      this.precio = params['precio'];

      setTimeout(()=>{
        if(this.inputPrice) this.inputPrice.nativeElement.focus();
      },100);
    })

  }

  cambiarPrecio(){
    let precio = {
      precio: this.precio,
      indice: this.indice
    }
    this.emiter.notificarUpload.emit(precio);
    this.router.navigate(['menu/ventas'])
  }

  eventoKey(event: any){
    if(event.key == "Escape"){
      this.router.navigate(['menu/ventas']);
      this.emiter.notificarUpload.emit("nada");
    }
  }

}
