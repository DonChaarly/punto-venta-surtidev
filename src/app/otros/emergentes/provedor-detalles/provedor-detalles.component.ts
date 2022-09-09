import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Provedores } from 'src/app/models/Provedores.model';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-provedor-detalles',
  templateUrl: './provedor-detalles.component.html',
  styleUrls: ['./provedor-detalles.component.css']
})
export class ProvedorDetallesComponent implements OnInit {

  provedor: Provedores = new Provedores();
  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private comprasService: ComprasService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    })

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.comprasService.getProvedor(params['id']).subscribe(response =>{
          this.provedor = response as Provedores;
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

  guardarProvedor(){
    if(this.provedor.idProvedores != null){
      this.comprasService.updateProvedor(this.provedor).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      });
    }else{
      this.comprasService.createProvedor(this.provedor).subscribe(response =>{
        console.log("Se creo el provedor: " + this.provedor.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      })
    }
  }

}
