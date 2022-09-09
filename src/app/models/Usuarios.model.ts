import { Empleados } from './Empleados.model';
import { Roles } from './Roles.model';

export class Usuarios{



    public idUsuarios: number;
    public username: string;
    public empleado: Empleados;
    public rol: Roles;
    public password: string;
    public enabled: Boolean;



}
