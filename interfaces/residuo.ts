interface Residuo{
    nombreResiduo: string,
    fechaRegistro: Date,
    cantidadRegistrada: string,
    idEstadoResiduo?: number,
}


interface ResiduoResponse extends Residuo{
    idUsuario:number,
    idResiduo: number,
    estadoResiduo?: EstadoResiduo;
    usuario: UsuarioResponse,
}