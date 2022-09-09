import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuarios } from 'src/app/models/Usuarios.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-eliminar-confirmacion',
  templateUrl: './eliminar-confirmacion.component.html',
  styleUrls: ['./eliminar-confirmacion.component.css']
})
export class EliminarConfirmacionComponent implements OnInit {

  usuario: Usuarios;
  ventana: string = "cliente";
  nombre: string = "";
  id: string = "";
  @ViewChild("inputEliminar") inputEliminar: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private emiter: EventEmitterService,
              private empleadosService: EmpleadosService, private authService: AuthService) { }

  ngOnInit(): void {

    this.obtenerUsuario();

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

  obtenerUsuario(){
    this.empleadosService.getUsuarioByName(this.authService.usuario.username).subscribe(response =>{
      this.usuario = response as Usuarios;
    })
  }

  eventoKey(event: any){

    if(event.key == "Escape"){
      this.router.navigate(['menu/configuraciones']);
      this.emiter.notificarUpload.emit("nada");
    }else if(event.key == "Enter"){
      this.eliminarObjeto();
    }
  }

  eliminarObjeto(){
    switch(this.ventana){
      case "empleado":{
        this.empleadosService.deleteEmpleado(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          if(this.usuario.empleado.nombre == this.nombre){
            this.cerrarSesion();
          }else{
            this.router.navigate(['menu/configuraciones']);
          }
        });
        break;
      }
      case "rol":{
        this.empleadosService.deleteRol(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          if(this.usuario.rol.nombre == this.nombre){
            this.cerrarSesion();
          }else{
            this.router.navigate(['menu/configuraciones']);
          }
        });
        break;
      }
      case "usuario":{
        let username = this.authService.usuario.username;

        this.empleadosService.deleteUsuario(parseInt(this.id)).subscribe(response =>{
          this.emiter.notificarUpload.emit('actualizar');
          if(username == this.nombre){
            this.cerrarSesion();
          }else{
            this.router.navigate(['menu/configuraciones']);
          }
        });
        break;
      }
    }
  }

  cerrarSesion(){
    this.authService.logout();
    this.router.navigate(['/']);
    alert("Se elimino informacion del usuario actual");
  }

}
