import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorias } from 'src/app/models/Categorias.model';
import { Departamentos } from 'src/app/models/Departamentos.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-categoria-detalles',
  templateUrl: './categoria-detalles.component.html',
  styleUrls: ['./categoria-detalles.component.css']
})
export class CategoriaDetallesComponent implements OnInit {

  departamentos: Departamentos[] = [];
  departamento: number;
  categoria: Categorias = new Categorias();
  @ViewChild("inputKey") inputKey: ElementRef;

  constructor(private articulosService: ArticulosService, private router: Router, private emiter: EventEmitterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(()=>{
      if(this.inputKey) this.inputKey.nativeElement.focus();
    })

    this.obtenerDepartamentos();

    this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.articulosService.getCategoria(params['id']).subscribe(response =>{
          this.categoria = response as Categorias;
          this.articulosService.getDepartamentos().subscribe(response =>{
            this.departamentos = response as Departamentos[];
            this.departamento = this.departamentos.findIndex(departament =>{
              return departament.idDepartamentos == this.categoria.departamento.idDepartamentos;
            });
          })
        })
      }else{
        this.obtenerDepartamentos();
      }
    })
  }

  obtenerDepartamentos(){
    this.articulosService.getDepartamentos().subscribe(response =>{
      this.departamentos = response as Departamentos[];
    })
  }

  eventokey(event: any){
    if(event.key == "Escape"){
      this.emiter.notificarUpload.emit('nada');
      this.router.navigate(['menu/otros']);
    }
  }

  guardarCategoria(){
    if(this.categoria.idCategorias != null){
      this.categoria.departamento = this.departamentos[this.departamento];
      this.articulosService.updateCategoria(this.categoria).subscribe(response =>{
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      });
    }else{
      this.categoria.departamento = this.departamentos[this.departamento];
      this.articulosService.createCategoria(this.categoria).subscribe(response =>{
        console.log("Se creo la categoria: " + this.categoria.nombre);
        this.emiter.notificarUpload.emit('actualizar');
        this.router.navigate(['menu/otros']);
      })
    }
  }

}
