import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleados } from 'src/app/models/Empleados.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { UtileriaService } from 'src/app/services/utileria.service';

@Component({
  selector: 'app-empleado-detalles',
  templateUrl: './empleado-detalles.component.html',
  styleUrls: ['./empleado-detalles.component.css']
})
export class EmpleadoDetallesComponent implements OnInit {


  empleado: Empleados = new Empleados();
  date: string;

  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private empleadosService: EmpleadosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute
              ,private utileria: UtileriaService) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    },300);

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.empleadosService.getEmpleado(params['id']).subscribe(response =>{
          this.empleado = response as Empleados;
          this.date = this.empleado.fechaIngreso;
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

  guardarEmpleado(){
    this.empleado.fechaIngreso = this.date;
    if(this.empleado.idEmpleados != null){
      this.empleadosService.updateEmpleado(this.empleado).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      });
    }else{
      this.empleadosService.createEmpleado(this.empleado).subscribe(response =>{
        console.log("Se creo el empleado: " + this.empleado.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      })
    }
  }

}
