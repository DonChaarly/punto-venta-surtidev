import { Component, OnInit } from '@angular/core';
import { Roles } from '../models/Roles.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {


  font_courgette: string = 'Courgette';
  font_roboto: string = 'Roboto Condensed';

  rol: Roles = new Roles();

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.rol = this.auth.rol;
  }

}
