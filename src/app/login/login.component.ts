import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../models/Usuarios.model';
import { AuthService } from '../services/auth.service';
import { EmpleadosService } from '../services/empleados.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuarios;
  @ViewChild("inputUser") inputUser: ElementRef;

  constructor(private empleadosService: EmpleadosService, private router: Router,
    private authService: AuthService) {
    this.usuario = new Usuarios();
   }

  ngOnInit(): void {

    setTimeout(()=>{
      if(this.inputUser) this.inputUser.nativeElement.focus();
    },300);

    if(this.authService.isAuthenticated()){
      this.router.navigate(['/menu']);
    }

  }


  login(): void{
    if(this.usuario.username == null ||this.usuario.password == null){
      alert("Rellene todos los campos");
    }

    this.authService.login(this.usuario).subscribe(response =>{

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/menu']);

    }, err =>{
      if(err.status == 400){
        alert("Las Credenciales son incorrectas")
      }
      if(err.status == 404){
        alert("Cargando servidor, intente de nuevo")
      }
    });
  }

}
