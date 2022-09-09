import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Compras } from 'src/app/models/Compras.model';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-compra-detalles',
  templateUrl: './compra-detalles.component.html',
  styleUrls: ['./compra-detalles.component.css']
})
export class CompraDetallesComponent implements OnInit {

  total: number = 0
  provedor: string = '';
  fecha: string = '';
  cajero: string = '';
  folio: string = '';
  @ViewChild('inputEfectivo') inputEfectivo: ElementRef;
  listo: boolean;


  constructor(private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService) { }

  ngOnInit(): void {




    this.route.queryParams.subscribe(params=>{
      if(params['total'] != null){
        this.total = params['total'];
        this.provedor = params['provedor'];
        this.fecha = params['fecha'];
        this.cajero = params['cajero'];
        this.folio = params['folio'];
        this.listo = true;
        setTimeout(() => {
          if(this.inputEfectivo) this.inputEfectivo.nativeElement.focus();
        }, 300);
      }
    })

  }

  eventoKey(event: any){
    if(event.key == 'Escape'){
      this.emiter.notificarUpload.emit('nada');
      this.router.navigate(['menu/compras']);
    }else if(event.key == 'Enter'){
      this.abrirConfirmacion();
    }
  }

  abrirConfirmacion(){
    this.router.navigate(['menu/compras/compra-detalles/confirmacion']);
  }

}
