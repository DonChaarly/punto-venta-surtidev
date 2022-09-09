import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cajas } from '../models/cajas.model';
import { Empleados } from '../models/Empleados.model';
import { Empresas } from '../models/Empresas.model';
import { Roles } from '../models/Roles.model';
import { Usuarios } from '../models/Usuarios.model';
import { EmpleadosService } from '../services/empleados.service';
import { EventEmitterService } from '../services/event-emitter.service';
import { VentasService } from '../services/ventas.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit {

  empresa: Empresas = new Empresas();
  rolesTodos: Roles[] = [];
  roles: Roles[] = [];
  rol: Roles;
  empleadosTodos: Empleados[] = [];
  empleados: Empleados[] = [];
  empleado: Empleados;
  usuariosTodos: Usuarios[] = [];
  usuarios: Usuarios[] = [];
  usuario: Usuarios;


  ventanaSelc: string;
  objetoSelec: string;
  key: string = "";
  subscription :Subscription;




constructor(private empleadosService: EmpleadosService, private router: Router, private emiter: EventEmitterService) { }

ngOnInit(): void {
  this.inicializarVariables();
  this.goInputPrincipal();

  this.subscription = this.emiter.notificarUpload.subscribe(response =>{
    if(response == "actualizar"){
      this.key = "";
      this.objetoSelec = "";
      switch(this.ventanaSelc){
        case "rol": this.obtenerRoles(); break;
        case "empleado": this.obtenerEmpleados(); break;
        case "usuario": this.obtenerUsuarios(); break;
      }
      this.goInputPrincipal();
    }else{
      this.goInputPrincipal();
    }
  })

}

inicializarVariables(){
  this.obtenerDatosEmpresa();
  this.obtenerRoles();
  this.obtenerEmpleados();
  this.obtenerUsuarios();
  this.ventanaSelc = "empresa";
  this.cambiarVentana(this.ventanaSelc);
}

guardarDatosEmpresa(){
  this.empleadosService.updateEmpresa(this.empresa).subscribe(response =>{
    console.log("Los datos de la empresa han sido actualizados")
  })

}

/*---------------------OBTENCION DE OBJETOS------------------- */

obtenerDatosEmpresa(){
  this.empleadosService.getEmpresa(1).subscribe(response =>{
    this.empresa = response as Empresas;
  })
}

obtenerRoles(){
  this.empleadosService.getRoles().subscribe(response =>{
    this.rolesTodos = response as Roles[];

    let indice = this.rolesTodos.findIndex(rol =>{
      return rol.idRoles == 1;
    })
    this.rolesTodos.splice(indice, indice +1);
    this.roles = this.rolesTodos;

  })
}
obtenerEmpleados(){
  this.empleadosService.getEmpleados().subscribe(response =>{
    this.empleadosTodos = response as Empleados[];

    let indice = this.empleadosTodos.findIndex(empleado =>{
      return empleado.idEmpleados == 1;
    })
    this.empleadosTodos.splice(indice, indice +1);
    this.empleados = this.empleadosTodos;
  })
}
obtenerUsuarios(){
  this.empleadosService.getUsuarios().subscribe(response =>{
    this.usuariosTodos = response as Usuarios[];

    let indice = this.usuariosTodos.findIndex(usuario =>{
      return usuario.idUsuarios == 1;
    })
    this.usuariosTodos.splice(indice, indice +1);
    this.usuarios = this.usuariosTodos;
  })
}



/*---------------------CAMBIO DE VENTANAS ------------------------------------- */
cambiarVentana(ventana: string){
  let divNav = document.getElementById('nav');
  if(ventana == 'empresa'){
    divNav.setAttribute("class", "gone")
  }else{
    divNav.setAttribute("class", "container-configuraciones__buttons")
  }

  let divEmpresa = document.getElementById('empresa');
  divEmpresa.setAttribute("class", "container-configuraciones__nav")
  let divRol = document.getElementById('rol');
  divRol.setAttribute("class", "container-configuraciones__nav");
  let divEmpleado = document.getElementById('empleado');
  divEmpleado.setAttribute("class", "container-configuraciones__nav");
  let divUsuario = document.getElementById('usuario');
  divUsuario.setAttribute("class", "container-configuraciones__nav");

  let div = document.getElementById(ventana);
  div.setAttribute("class", "container-configuraciones__nav--active");


  let sectionEmpresa = document.getElementById('divempresa');
  sectionEmpresa.setAttribute("class", "gone")
  let sectionRol = document.getElementById('divrol');
  sectionRol.setAttribute("class", "gone");
  let sectionEmpleado = document.getElementById('divempleado');
  sectionEmpleado.setAttribute("class", "gone");
  let sectionUsuario = document.getElementById('divusuario');
  sectionUsuario.setAttribute("class", "gone");


  let section = document.getElementById("div" + ventana);
  section.setAttribute("class", "visible");


  this.ventanaSelc = ventana;
  this.goInputPrincipal();


}


/*--------------------------MANEJO DE SELECCION DE FILAS--------------------------- */
siguienteFoco(indice: number) {
  switch(this.ventanaSelc){
    case "rol":{
      if (this.roles[indice] != null) {
        let row = document.getElementById('inputrol' + indice.toString());
        row.focus();
      }
      break;
    }
    case "empleado":{
      if (this.empleados[indice] != null) {
        let row = document.getElementById('inputempleado' + indice.toString());
        row.focus();
      }
      break;
    }
    case "usuario":{
      if (this.usuarios[indice] != null) {
        let row = document.getElementById('inputusuario' + indice.toString());
        row.focus();
      }
      break;
    }
  }

}

seleccionarFila(event: Event) {
  const row = document.getElementById(
    'tr' + (<HTMLInputElement>event.target).id
  );
  row.setAttribute('class', 'section__table-data--active');

  this.objetoSelec = (<HTMLInputElement>event.target).name;
}

deseleccionarFila(event: Event) {
  const row = document.getElementById(
    'tr' + (<HTMLInputElement>event.target).id
  );
  row.setAttribute('class', 'section__table-data');
}


dobleClick(indice: string) {
  this.abrirDetalles();
}

goInputPrincipal() {
  let id = "configuraciones-rol"
  switch(this.ventanaSelc){
    case "rol": id = "configuraciones-rol"; break;
    case "empleado": id= "configuraciones-employee" ; break;
    case "usuario": id= "configuraciones-usuario" ; break;
  }
  let inputPrincipal = document.getElementById(id);
  inputPrincipal.focus();
}

/*--------------------EVENTO KEYUP PRINCIPAL---------------------- */
eventoKeyPrincipal(event: any){
  let keyValidado = this.key.trim();
  if(event.key == "ArrowDown"){
    this.siguienteFoco(0);
  }else if(event.key != "ArrowDown"){
    switch(this.ventanaSelc){
      case "rol":{
        if(keyValidado == "") this.roles = this.rolesTodos;
        else{
          this.roles = this.rolesTodos.filter(rol =>{
            return rol.nombre.toLowerCase().includes(keyValidado.toLowerCase());
          })
        }
        break;
      }
      case "empleado":{
        if(keyValidado == "") this.empleados = this.empleadosTodos;
        else{
          this.empleados = this.empleadosTodos.filter(empleado =>{
            return empleado.nombre.toLowerCase().includes(keyValidado.toLowerCase());
          })
        }
        break;
      }
      case "usuario":{
        if(keyValidado == "") this.usuarios = this.usuariosTodos;
        else{
          this.usuarios = this.usuariosTodos.filter(usuario =>{
            return usuario.username.toLowerCase().includes(keyValidado.toLowerCase());
          })
        }
        break;
      }
    }
  }

}

/*------------------EVENTO KEYUP EN FILAS--------------------------------- */
inputKeypress(event: any, indice: string) {
  let index = parseInt(indice);
  if (event.key == 'ArrowDown') {
    this.siguienteFoco(index + 1);
  } else if (event.key == 'ArrowUp') {
    if (index == 0) {
      this.goInputPrincipal();
    }
    this.siguienteFoco(index - 1);
  } else if (event.key == '*' || event.key == 'Enter') {
    this.abrirDetalles();
  }
}

/*--------------------MANEJO DE VENTANAS NUEVAS ------------------------------- */

abrirDetalles(){
  if(this.objetoSelec != null){
    switch(this.ventanaSelc){
      case "rol":{
        this.router.navigate(['menu/configuraciones/rol-detalles'], {queryParams:{id: this.roles[this.objetoSelec].idRoles}})
        break;
      }
      case "empleado":{
        this.router.navigate(['menu/configuraciones/empleado-detalles'], {queryParams:{id: this.empleados[this.objetoSelec].idEmpleados}})
        break;
      }
      case "usuario":{
        this.router.navigate(['menu/configuraciones/usuario-detalles'], {queryParams:{id: this.usuarios[this.objetoSelec].idUsuarios}})
        break;
      }
    }
  }
}

crearObjeto(){
  switch(this.ventanaSelc){
    case "rol":{
      this.router.navigate(['menu/configuraciones/rol-detalles'])
      break;
    }
    case "empleado":{
      this.router.navigate(['menu/configuraciones/empleado-detalles'])
      break;
    }
    case "usuario":{
      this.router.navigate(['menu/configuraciones/usuario-detalles'])
      break;
    }
  }
}

eliminarObjeto(){
  if(this.objetoSelec != null){
    let nombre = "";
    let id: number;
  switch(this.ventanaSelc){
    case "rol":{
      nombre = this.roles[this.objetoSelec].nombre;
      id =this.roles[this.objetoSelec].idRoles;
      break;
    }
    case "empleado":{
      nombre = this.empleados[this.objetoSelec].nombre;
      id = this.empleados[this.objetoSelec].idEmpleados;
      break;
    }
    case "usuario":{
      nombre = this.usuarios[this.objetoSelec].username;
      id = this.usuarios[this.objetoSelec].idUsuarios;
      break;
    }

  }
    this.router.navigate(['menu/configuraciones/eliminar-confirmacion'], {queryParams:{id: id,ventana: this.ventanaSelc, nombre: nombre}});
  }
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

}
