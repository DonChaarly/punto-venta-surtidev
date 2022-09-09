import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-departamento-detalles',
  templateUrl: './departamento-detalles.component.html',
  styleUrls: ['./departamento-detalles.component.css']
})
export class DepartamentoDetallesComponent implements OnInit {

  departamento: Departamentos = new Departamentos();
  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private articulosService: ArticulosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    })

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.articulosService.getDepartamento(params['id']).subscribe(response =>{
          this.departamento = response as Departamentos;
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

  guardarDepartamento(){
    if(this.departamento.idDepartamentos != null){
      this.articulosService.updateDepartamento(this.departamento).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      });
    }else{
      this.articulosService.createDepartamento(this.departamento).subscribe(response =>{
        console.log("Se creo el departamento: " + this.departamento.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      })
    }
  }

}
