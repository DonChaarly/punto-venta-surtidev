import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-imprimir-ticket',
  templateUrl: './imprimir-ticket.component.html',
  styleUrls: ['./imprimir-ticket.component.css']
})
export class ImprimirTicketComponent implements OnInit {

  @ViewChild('printWindow') printWindow: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emiter: EventEmitterService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      if(this.printWindow) this.printWindow.nativeElement.focus();
    }, 200);
  }

  /*-----------------------EVENTO KEY -------------------------- */

  eventoKey(event: any) {
    if (event.key == 'Escape') {
      if(this.printWindow) this.printWindow.nativeElement.setAttribute('disabled', 'true');
      this.ventaHecha(false);
    } else if (event.key == 'Enter') {
      if(this.printWindow) this.printWindow.nativeElement.setAttribute('disabled', 'true');
      this.ventaHecha(true);
    }
  }


  /*-----------------VENTA HECHA -------------------------------- */
  ventaHecha(imprimir: boolean) {
    let ventaHecha = {
      ventaHecha: true,
      imprimir: imprimir
    };
    this.emiter.notificarUpload.emit(ventaHecha);
    this.router.navigate(['menu/ventas']);
  }

}
