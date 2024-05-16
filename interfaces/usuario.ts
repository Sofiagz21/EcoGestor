interface Usuario{
    nombresUsuario: string;
    apellidosUsuario: string;
    username?: string;
    emailUsuario: string;
    password: string;
}


interface UsuarioResponse extends Omit<Usuario, 'password'> {
    idRolUsuario: number;
    idUsuario: number;
    rolUsuario?: RolUsuario;
    password?: string;
}