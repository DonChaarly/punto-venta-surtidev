import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ventas } from 'src/app/models/Ventas.model';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { VentasService } from 'src/app/services/ventas.service';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-venta-detalles',
  templateUrl: './venta-detalles.component.html',
  styleUrls: ['./venta-detalles.component.css'],
})
export class VentaDetallesComponent implements OnInit {
  venta: Ventas;
  takenSale: number = 0;
  cambio: number;
  @ViewChild('inputTaken') inputTaken: ElementRef;
  perdida = true;
  fecha: Date;
  articulosDetalles: Detallesventasarticulos[];
  idVentas: number;
  listo = false;

  constructor(
    private ventasService: VentasService,
    private route: ActivatedRoute,
    private router: Router,
    private emiter: EventEmitterService,
    private articulosService: ArticulosService
  ) {}

  ngOnInit(): void {
    /*----OBTENCION DE PARAMETROS EN URL--- */
    if (!this.listo) {
      this.route.queryParams.subscribe((params) => {
        if (!this.listo) {
          this.idVentas = params['idVentas'];
          this.ventasService.getVenta(this.idVentas).subscribe((response) => {
            this.fecha = new Date();
            this.venta = response as Ventas;
          });
          setTimeout(() => {
            if(this.inputTaken) this.inputTaken.nativeElement.focus();
          }, 400);
          this.listo = true;
        }
      });
    }
  }

  /*-----------------CALCULO DE TOTALES---------------------------- */
  calcularCambio(): string {
    let cambio = (this.cambio = this.takenSale - this.venta.total).toFixed(2);
    let inputChange = document.getElementById('change-sale');
    if (parseFloat(cambio) >= 0) {
      inputChange.setAttribute('class', 'blue');
      this.perdida = false;
    } else {
      inputChange.setAttribute('class', 'red');
      this.perdida = true;
    }
    return cambio;
  }

  importe(cantidad: number, precio: number): string {
    return (cantidad * precio).toFixed(2);
  }

  /*------------EVENTO KEY------------------------ */
  eventoKey(event: any) {
    if (event.key == 'Escape') {
      let eliminar = {
        eliminarId :this.idVentas
      }
      this
      this.emiter.notificarUpload.emit(eliminar);
      this.router.navigate(['menu/ventas']);
    } else if (event.key == 'Enter') {
      this.abrirConfirmar();
    }
  }

  /*------------------------MANEJO DE VENTANAS-------------------------- */

  abrirConfirmar() {
    if (!this.perdida) {
      let datosVenta = {
        efectivo: this.takenSale,
        cambio: this.calcularCambio(),
      };
      this.router.navigate(['menu/ventas/venta-detalles/confirmar']);
      this.emiter.notificarUpload.emit(datosVenta);
    }
  }


}
