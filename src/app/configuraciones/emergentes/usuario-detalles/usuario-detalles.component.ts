import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleados } from 'src/app/models/Empleados.model';
import { Roles } from 'src/app/models/Roles.model';
import { Usuarios } from 'src/app/models/Usuarios.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-usuario-detalles',
  templateUrl: './usuario-detalles.component.html',
  styleUrls: ['./usuario-detalles.component.css']
})
export class UsuarioDetallesComponent implements OnInit {

  usuario: Usuarios = new Usuarios();
  empleados: Empleados[] = [];
  empleado: number;
  roles: Roles[] = [];
  rol: number;
  verificarPassword = 0;
  password2: string;

  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private empleadosService: EmpleadosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    },300);

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.empleadosService.getUsuario(params['id']).subscribe(response =>{
          this.usuario = response as Usuarios;
          this.empleadosService.getEmpleados().subscribe(response =>{
            this.empleados = response as Empleados[];
            this.empleado = this.empleados.findIndex(empleado =>{
              return empleado.idEmpleados == this.usuario.empleado.idEmpleados;
            });
          });
          this.empleadosService.getRoles().subscribe(response =>{
            this.roles = response as Roles[];
            this.rol = this.roles.findIndex(rol =>{
              return rol.idRoles == this.usuario.rol.idRoles;
            });
          });
        })
      }else{
        this.inicializarVariables();
      }
    })





  }

  inicializarVariables(){
    this.obtenerEmpleados();
    this.obtenerRoles();
  }

  /*-----------------------OBTENCION DE EMPLEADOS Y ROLES ------------------ */

  obtenerEmpleados(){
    this.empleadosService.getEmpleados().subscribe(response =>{
      this.empleados = response as Empleados[];
    });
  }
  obtenerRoles(){
    this.empleadosService.getRoles().subscribe(response =>{
      this.roles = response as Roles[];
    });
  }

  eventokey(event: any){
    if(event.key == "Escape"){
      this.emiter.notificarUpload.emit('nada');
      this.router.navigate(['menu/configuraciones']);
    }
  }

  guardarUsuario(): boolean{
    if(this.verificarPassword){
      if(this.usuario.password != this.password2){
        alert("Las constraseñas deben ser iguales");
        return false;
      }
    }
    if(this.empleado) this.usuario.empleado = this.empleados[this.empleado];
    if(this.rol) this.usuario.rol = this.roles[this.rol];

    if(this.usuario.idUsuarios != null){
      this.empleadosService.updateUsuario(this.usuario, this.verificarPassword).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      });
    }else{
      this.empleadosService.createUsuario(this.usuario).subscribe(response =>{
        console.log("Se creo el usuario: " + this.usuario.username);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/configuraciones']);
      })
    }
    return true;
  }

  cambioPassword(){
    if(!this.verificarPassword){
      let passwordConfirm = document.getElementById('passwordConfirm');
      passwordConfirm.setAttribute("class", "visible");
      passwordConfirm.setAttribute('required', "true")
      this.verificarPassword = 1;
    }
  }

}
