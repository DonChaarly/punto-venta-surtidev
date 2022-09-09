import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticulosService } from 'src/app/services/articulos.service';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-eliminar-objeto',
  templateUrl: './eliminar-objeto.component.html',
  styleUrls: ['./eliminar-objeto.component.css']
})
export class EliminarObjetoComponent implements OnInit {

  ventana: string = "cliente";
  nombre: string = "";
  id: string = "";
  @ViewChild("inputEliminar") inputEliminar: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService,
              private ventasService: VentasService,
              private articulosService: ArticulosService,
              private comprasService: ComprasService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params=>{
      this.ventana = params['ventana'];
      this.nombre = params['nombre'];
      this.nombre = this.nombre.substring(0, 20);
      this.id = params['id'];
    })

    setTimeout(()=>{
      if(this.inputEliminar) this.inputEliminar.nativeElement.focus();
    },300);



  }

  eventoKey(event: any){

    if(event.key == "Escape"){
      this.router.navigate(['menu/otros']);
      this.emiter.notificarUpload.emit("nada");
    }else if(event.key == "Enter"){
      this.eliminarObjeto();
    }
  }

  eliminarObjeto(){
    switch(this.ventana){
      case "clientes":{
        this.ventasService.deleteCliente(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          this.router.navigate(['menu/otros']);
        });
        break;
      }
      case "provedores":{
        this.comprasService.deleteProvedor(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          this.router.navigate(['menu/otros']);
        });
        break;
      }
      case "departamentos":{
        this.articulosService.deleteDepartamento(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          this.router.navigate(['menu/otros']);
        });
        break;
      }
      case "categorias":{
        this.articulosService.deleteCategoria(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          this.router.navigate(['menu/otros']);
        });
        break;
      }
    }
  }

}
