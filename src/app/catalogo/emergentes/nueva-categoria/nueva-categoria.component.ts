import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { Categorias } from 'src/app/models/Categorias.model';
import { Component, OnInit } from '@angular/core';
import { ArticulosService } from 'src/app/services/articulos.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css']
})
export class NuevaCategoriaComponent implements OnInit {

  categoria: Categorias = new Categorias();
  departamentos: Departamentos[]=[];
  departamento: number;
  subsciption: Subscription;



  constructor(private articulosService: ArticulosService, private router: Router, private route: ActivatedRoute,
    private emiter: EventEmitterService  ) {
   }

  ngOnInit(): void {

    this.inicializarVariables();


    this.subsciption = this.emiter.notificarUpload.subscribe(departamento =>{

      if(departamento instanceof Departamentos){
        this.categoria.departamento = departamento
        this.departamentos.push(departamento)
        this.departamento = this.departamentos.length -1

      }
    })
  }

  /*--------------INICIALIZANDO VARIBLES--------------- */
  inicializarVariables(){
    this.articulosService.getDepartamentos().subscribe(response =>{
      this.departamentos = response as Departamentos[];
    })
  }

  /*----------------CAMBIO DE DEPARTAMENTO------------------ */
  cambiarDepartamento(){
    this.categoria.departamento = this.departamentos[this.departamento];
  }

  /*-----------------------CREACION DE CATEGORIA-------------- */
  guardarCambios(){
    this.articulosService.createCategoria(this.categoria).subscribe(response =>{

      this.categoria.idCategorias = (response.categoria as Categorias).idCategorias
      console.log("Se ha creado la categoria: " + this.categoria.nombre + " con exito");
      this.subsciption.unsubscribe();
      this.emiter.notificarUpload.emit(this.categoria);
      this.router.navigate(['../'], {relativeTo: this.route, queryParams:{}})
    })


  }

}
