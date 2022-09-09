import { Component, OnInit } from '@angular/core';
import { Provedores } from 'src/app/models/Provedores.model';
import { ComprasService } from 'src/app/services/compras.service';

@Component({
  selector: 'app-provedores',
  templateUrl: './provedores.component.html',
  styleUrls: ['./provedores.component.css']
})
export class ProvedoresComponent implements OnInit {

  provedores: Provedores[] = [];
  provedor: Provedores;

  constructor(private comprasService: ComprasService) { }

  ngOnInit(): void {
  }

}
