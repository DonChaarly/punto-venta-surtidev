import { Detallescomprasarticulos } from './Detallescomprasarticulos.model';
import { Cajas } from './cajas.model';
import { Articulos } from './articulos.model';
import { Provedores } from './Provedores.model';
import { Usuarios } from './Usuarios.model';
export class Compras{


    public idCompras: number;
    public folio: string;
    public provedor: Provedores;
    public usuario: Usuarios;
    public caja: Cajas;
    public fecha: string;
    public enEspera: Boolean;
    public articulos: Detallescomprasarticulos[];
    public total: number;


}

 