interface Residuo{
    idUsuario: number,
    nombreResiduo: string,
    fechaRegistro: Date,
    cantidadRegistrada: string
}


interface ResiduoResponse extends Residuo{
    idResiduo: number,
    idEstadoResiduo: number,
    
    usuario: UsuarioResponse,
    estadoResiduo?: EstadoResiduo;
}