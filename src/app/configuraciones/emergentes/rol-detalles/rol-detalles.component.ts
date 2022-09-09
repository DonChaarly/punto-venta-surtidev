import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from 'src/app/models/Roles.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-rol-detalles',
  templateUrl: './rol-detalles.component.html',
  styleUrls: ['./rol-detalles.component.css']
})
export class RolDetallesComponent implements OnInit {

  rol: Roles = new Roles();

  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private empleadosService: EmpleadosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    },300);

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.empleadosService.getRol(params['id']).subscribe(response =>{
          this.rol = response as Roles;
        })
      }
    })


  }

  eventokey(event: any){
    if(event.key == "Escape"){
      this.emiter.notificarUpload.emit('nada');
      this.router.navigate(['menu/configuraciones']);
    }
  }

  guardarRol(){
    if(this.rol.idRoles != null){
      this.empleadosService.updateRol(this.rol).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      });
    }else{
      this.empleadosService.createRol(this.rol).subscribe(response =>{
        console.log("Se creo el rol: " + this.rol.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      })
    }
  }

}
