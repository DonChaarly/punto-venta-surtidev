import { Provedores } from 'src/app/models/Provedores.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nuevo-departamento',
  templateUrl: './nuevo-departamento.component.html',
  styleUrls: ['./nuevo-departamento.component.css']
})
export class NuevoDepartamentoComponent implements OnInit {

  departamento: Departamentos = new Departamentos();

  constructor(private ArticulosService: ArticulosService, private emiter: EventEmitterService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  guardarCambios(){
    this.ArticulosService.createDepartamento(this.departamento).subscribe(response =>{

      console.log("El departamento: " + this.departamento.nombre + " ha sido creado con exito");
      this.departamento.idDepartamentos = response.departamento.idDepartamentos
      this.emiter.notificarUpload.emit(this.departamento);
    })

    this.router.navigate(['../'], {relativeTo: this.route})
  }

}
