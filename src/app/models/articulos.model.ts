import { Detallesprovedoresarticulos } from './Detallesprovedoresarticulos.model';
import { Categorias } from "./Categorias.model";
import { Promociones } from "./Promociones.model";
import { Provedores } from "./Provedores.model";

export class Articulos {


    public idArticulos: number;
    public codigo: string;
    public nombre: string;
    public inventarioMin: number;
    public inventarioMax: number;
    public precio1: number;
    public precio2: number;
    public existencias: number;
    public ultimoPrecioCompra: number;
    public vecesComprado: number;
    public modificacionPrecio: Boolean;
    public categoria: Categorias;
    public provedores: Detallesprovedoresarticulos[];
    public promociones: Promociones[];

    public  getPrecioPromedio(): number{
      let precioPromedio: number = 0;
      let totalPrecios: number = 0;
      if(this.provedores != null){
        this.provedores.forEach(provedor =>{
          totalPrecios += provedor.ultPrecio;
        })
        precioPromedio = totalPrecios / this.provedores.length;
      }
      return precioPromedio;

    }





}



