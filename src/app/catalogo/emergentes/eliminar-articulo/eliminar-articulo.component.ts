import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Articulos } from 'src/app/models/articulos.model';
import { ArticulosService } from 'src/app/services/articulos.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-eliminar-articulo',
  templateUrl: './eliminar-articulo.component.html',
  styleUrls: ['./eliminar-articulo.component.css']
})
export class EliminarArticuloComponent implements OnInit {

  articulo: Articulos;
  articuloSeleccionado: string;
  @ViewChild("inputHidden") inputHidden: ElementRef;

  constructor(private articulosService: ArticulosService, private route: ActivatedRoute, private router: Router, private emiter: EventEmitterService) { }

  ngOnInit(): void {

    setTimeout(() => {
      if(this.inputHidden){
        this.inputHidden.nativeElement.focus();
      }
    }, 300);

    this.route.queryParams.subscribe( params =>{
      this.articuloSeleccionado = params['articuloSeleccionado']
    })

    this.articulosService.getArticulo(parseInt(this.articuloSeleccionado)).subscribe(response =>{
      this.articulo = response as Articulos
    })




  }

  eliminarArticulo(){
    this.articulosService.deleteArticulo(this.articulo.idArticulos).subscribe(response=>{
      console.log("El articulo: " + this.articulo.nombre + " ha sido eliminado con exito")
      this.emiter.notificarUpload.emit(this.articulo);
    })


    this.router.navigate(['menu/catalogo'])

  }

}
