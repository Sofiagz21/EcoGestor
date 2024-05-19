interface RutaRecolecta{
    puntoInicio: string,
    puntoFin: string,
    idEstadoRuta?: number,
    idVehiculo?: number,
    fechaRecoleccion?: Date,

}

interface RutaRecolectaResponse extends RutaRecolecta{
    idUsuario: number,
    idRutaRecolecta: number,
    usuario: UsuarioResponse,
    estadoRuta?: EstadoRuta,
    vehiculo?: VehiculoResponse, 
}