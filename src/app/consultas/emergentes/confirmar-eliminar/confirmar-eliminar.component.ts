import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-confirmar-eliminar',
  templateUrl: './confirmar-eliminar.component.html',
  styleUrls: ['./confirmar-eliminar.component.css']
})
export class ConfirmarEliminarComponent implements OnInit {

  ventaCompra: string = "venta";
  folio: string = "";
  @ViewChild("inputEliminar") inputEliminar: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params=>{
      this.folio = params['folio'];
      if(params['ventasActivo']== "true"){
        this.ventaCompra = "venta";
      }else{
        this.ventaCompra = "compra";
      }
    })

    setTimeout(()=>{
      if(this.inputEliminar) this.inputEliminar.nativeElement.focus();
    },300);



  }

  eventoKey(event: any){

    if(event.key == "Escape"){
      this.router.navigate(['menu/consultas']);
      this.emiter.notificarUpload.emit("nada");
    }else if(event.key == "Enter"){
      this.eliminarVentaCompra();
    }
  }

  eliminarVentaCompra(){
    let eliminar = {
      eliminar: true
    }
    this.router.navigate(['menu/consultas']);
    this.emiter.notificarUpload.emit(eliminar);
  }

}
