
import { Component, OnInit } from '@angular/core';
import { Articulos } from 'src/app/models/articulos.model';
import { Cajas } from 'src/app/models/cajas.model';
import { Clientes } from 'src/app/models/Clientes.model';
import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Ventas } from 'src/app/models/Ventas.model';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Clientes[] = [];
  cliente: Clientes;


  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {
  }

}
