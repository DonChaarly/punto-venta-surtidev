import { Articulos } from './articulos.model';
import { Ventas } from './Ventas.model';

export class Detallesventasarticulos{


    public idDetallesVentasArticulos: number;
    public articulo: Articulos;
    public venta: Ventas;
    public cantidad: number;
    public precioUnitario: number;
    public importe: number;


}
