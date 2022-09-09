import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-eliminar-productos',
  templateUrl: './eliminar-productos.component.html',
  styleUrls: ['./eliminar-productos.component.css']
})
export class EliminarProductosComponent implements OnInit {

  @ViewChild("inputEliminar") inputEliminar: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    setTimeout(()=>{
      if(this.inputEliminar) this.inputEliminar.nativeElement.focus();
    },300);



  }

  eventoKey(event: any){

    if(event.key == "Escape"){
      this.router.navigate(['menu/ventas']);
      this.emiter.notificarUpload.emit("nada");
    }else if(event.key == "Enter"){
      this.eliminarProductos();
    }
  }

  eliminarProductos(){
    let eliminar = {
      eliminar: true
    }
    this.router.navigate(['menu/ventas']);
    this.emiter.notificarUpload.emit(eliminar);
  }
}
