interface ControlCalidad{
    FechaControl: Date,
    idResiduo?: Date,
    idMetodoControl?: number,
    observaciones: string,
}

interface ControlCalidadResponse extends ControlCalidad{
    idUsuario: number,
    idControlCalidad: number,
    idMetodoControl?: number,
    usuario: UsuarioResponse,
    residuo: ResiduoResponse,
    metodoControl: MetodoControl,
}