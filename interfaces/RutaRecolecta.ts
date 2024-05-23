interface RutaRecolecta{
    puntoInicio: string,
    puntoFinalizacion: string,
    idEstadoRuta?: number,
    idVehiculo?: number,
    idResiduo?: number,
    fechaRecoleccion: Date,

}

interface RutaRecolectaResponse extends RutaRecolecta{
    idUsuario: number,
    idRutaRecolecta: number,
    usuario: UsuarioResponse,
    estadoRuta?: EstadoRuta,
    residuo?: ResiduoResponse,
    vehiculo?: VehiculoResponse, 
}