import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from 'src/app/models/Roles.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-venta-confirmar',
  templateUrl: './venta-confirmar.component.html',
  styleUrls: ['./venta-confirmar.component.css'],
})
export class VentaConfirmarComponent implements OnInit {
  @ViewChild('saleWindow') saleWindow: ElementRef;
  rol: Roles;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emiter: EventEmitterService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.rol = this.auth.rol;


    setTimeout(() => {
      if(this.saleWindow) this.saleWindow.nativeElement.focus();
    }, 200);
  }

  /*-----------------------EVENTO KEY -------------------------- */

  eventoKey(event: any) {
    if (event.key == 'Escape') {
      this.router.navigate(['menu/ventas/venta-detalles']);
    } else if (event.key == 'Enter') {
      if(this.saleWindow) this.saleWindow.nativeElement.setAttribute('disabled', 'true');
      this.ventaHecha();
    }
  }


  /*-----------------VENTA HECHA -------------------------------- */
  ventaHecha() {
    if(this.rol.preguntarImprimir){
      this.router.navigate(['menu/ventas/venta-detalles/confirmar/imprimir-ticket'])
    }else{
      let ventaHecha = {
        ventaHecha: true,
        imprimir: true
      };
      this.emiter.notificarUpload.emit(ventaHecha);
      this.router.navigate(['menu/ventas']);
    }

  }
}
