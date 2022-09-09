import { Detallesventasarticulos } from 'src/app/models/Detallesventasarticulos';
import { Cajas } from "./cajas.model";
import { Clientes } from "./Clientes.model";
import { Usuarios } from "./Usuarios.model";

export class Ventas{


    public idVentas: number;
    public folio: string;
    public usuario: Usuarios;
    public cliente: Clientes;
    public caja: Cajas;
    public fecha: string;
    public enEspera: Boolean;
    public articulos: Detallesventasarticulos[];
    public total: number;



}
