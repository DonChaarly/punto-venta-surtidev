import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-compra-confirmacion',
  templateUrl: './compra-confirmacion.component.html',
  styleUrls: ['./compra-confirmacion.component.css']
})
export class CompraConfirmacionComponent implements OnInit {

  @ViewChild('saleWindow') saleWindow: ElementRef;

  constructor(private emiter: EventEmitterService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.saleWindow) this.saleWindow.nativeElement.focus();
    },300);

  }

  eventoKey(event: any){
    if(event.key == "Escape"){
      this.router.navigate(['menu/compras/compra-detalles']);
    }else if(event.key == "Enter"){
      this.realizarCompra();
    }
  }

  realizarCompra(){
    let compraRealizada = {
      compraRealizada: true
    }
    this.emiter.notificarUpload.emit(compraRealizada);
    this.router.navigate(['menu/compras']);
  }

}
