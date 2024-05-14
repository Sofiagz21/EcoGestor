interface Usuario{
    idUsuario: number;
    idRolUsuario: number;
    nombresUsuario: string;
    apellidosUsuario: string;
    emailUsuario: string;
    username?: string;
    password?: string;
    isNotDeleted?: boolean;
    
    rolUsuario? : UserType;

}