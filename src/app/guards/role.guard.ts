import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Roles } from '../models/Roles.model';
import { EmpleadosService } from '../services/empleados.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router){}

  canActivate(


    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    //Verificamos que el usuario tenga una autenticacion
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/']);
      return false;
    }

    let role: boolean;
    let rol = this.authService.rol;

    //Verificamos los permisos para cada pagina
    if(next.data['cancelarVenta']){
      role = next.data['cancelarVenta'] as boolean;
      if(rol.cancelarVenta == role){
        return true;
      }
    }
    else if(next.data['cancelarCompra']){
      role = next.data['cancelarCompra'] as boolean;
      if(rol.cancelarCompra == role){
        return true;
      }
    }

    if(next.data['seccionCatalogo']){
      role = next.data['seccionCatalogo'] as boolean;
      if(rol.seccionCatalogo == role){
        return true;
      }
    }
    else if(next.data['agregarArticulo']){
      role = next.data['agregarArticulo'] as boolean;
      if(rol.agregarArticulo == role){
        return true;
      }
    }
    else if(next.data['eliminarArticulo']){
      role = next.data['eliminarArticulo'] as boolean;
      if(rol.eliminarArticulo == role){
        return true;
      }
    }
    else if(next.data['editarArticulo']){
      role = next.data['editarArticulo'] as boolean;
      if(rol.editarArticulo == role){
        return true;
      }
    }
    else if(next.data['exportarArticulos']){
      role = next.data['exportarArticulos'] as boolean;
      if(rol.exportarArticulos == role){
        return true;
      }
    }
    else if(next.data['importarArticulos']){
      role = next.data['importarArticulos'] as boolean;
      if(rol.importarArticulos == role){
        return true;
      }
    }
    else if(next.data['seccionConsultas']){
      role = next.data['seccionConsultas'] as boolean;
      if(rol.seccionConsultas == role){
        return true;
      }
    }
    else if(next.data['cambiarFechaConsulta']){
      role = next.data['cambiarFechaConsulta'] as boolean;
      if(rol.cambiarFechaConsulta == role){
        return true;
      }
    }
    else if(next.data['seccionVentas']){
      role = next.data['seccionVentas'] as boolean;
      if(rol.seccionVentas == role){
        return true;
      }
    }
    else if(next.data['realizarVenta']){
      role = next.data['realizarVenta'] as boolean;
      if(rol.realizarVenta == role){
        return true;
      }
    }
    else if(next.data['cambiarPrecio']){
      role = next.data['cambiarPrecio'] as boolean;
      if(rol.cambiarPrecio == role){
        return true;
      }
    }
    else if(next.data['preguntarImprimir']){
      role = next.data['preguntarImprimir'] as boolean;
      if(rol.preguntarImprimir == role){
        return true;
      }
    }
    else if(next.data['seccionReportes']){
      role = next.data['seccionReportes'] as boolean;
      if(rol.seccionReportes == role){
        return true;
      }
    }
    else if(next.data['cambiarFechaReporte']){
      role = next.data['cambiarFechaReporte'] as boolean;
      if(rol.cambiarFechaReporte == role){
        return true;
      }
    }
    else if(next.data['seccionCompras']){
      role = next.data['seccionCompras'] as boolean;
      if(rol.seccionCompras == role){
        return true;
      }
    }
    else if(next.data['seccionConfiguraciones']){
      role = next.data['seccionConfiguraciones'] as boolean;
      if(rol.seccionConfiguraciones == role){
        return true;
      }
    }
    else if(next.data['seccionOtros']){
      role = next.data['seccionOtros'] as boolean;
      if(rol.seccionOtros == role){
        return true;
      }
    }

    //En caso de que no se tenga permisos se regresa al menu
    this.router.navigate(['/menu']);
    return false

  }






}
