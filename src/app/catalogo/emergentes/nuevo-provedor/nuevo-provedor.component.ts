import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Provedores } from 'src/app/models/Provedores.model';
import { ComprasService } from 'src/app/services/compras.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-nuevo-provedor',
  templateUrl: './nuevo-provedor.component.html',
  styleUrls: ['./nuevo-provedor.component.css']
})
export class NuevoProvedorComponent implements OnInit {

  provedor: Provedores = new Provedores();

  constructor(private comprasService: ComprasService, private router: Router, private route: ActivatedRoute,
    private emiter: EventEmitterService) { }

  ngOnInit(): void {
  }

  crearProvedor(){

    this.comprasService.createProvedor(this.provedor).subscribe(response =>{
      console.log("Se ha creado el provedor: " + this.provedor.nombre + " con exito");
      this.provedor.idProvedores = response.provedor.idProvedores
      this.emiter.notificarUpload.emit(this.provedor);
    })

    this.router.navigate(['../'], {relativeTo: this.route});


  }

}
