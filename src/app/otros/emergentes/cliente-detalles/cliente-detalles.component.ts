import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from 'src/app/models/Clientes.model';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-cliente-detalles',
  templateUrl: './cliente-detalles.component.html',
  styleUrls: ['./cliente-detalles.component.css']
})
export class ClienteDetallesComponent implements OnInit {

  cliente: Clientes = new Clientes();
  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private ventasService: VentasService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    })

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.ventasService.getCliente(params['id']).subscribe(response =>{
          this.cliente = response as Clientes;
        })
      }
    })


  }

  eventokey(event: any){
    if(event.key == "Escape"){
      this.emiter.notificarUpload.emit('nada');
      this.router.navigate(['menu/otros']);
    }
  }

  guardarCliente(){
    if(this.cliente.idClientes != null){
      this.ventasService.updateCliente(this.cliente).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      });
    }else{
      this.ventasService.createCliente(this.cliente).subscribe(response =>{
        console.log("Se creo el cliente: " + this.cliente.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      })
    }
  }


}
