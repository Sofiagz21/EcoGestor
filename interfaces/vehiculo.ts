interface Vehiculo{
    marcaVehiculo: string;
    modeloVehiculo: string;
    placaVehiculo: string;
    idTipoVehiculo?: number;
}

interface VehiculoResponse extends Vehiculo{
    idUsuario: number;
    idVehiculo: number;
    tipoVehiculo?: TipoVehiculo;
    usuario: UsuarioResponse;
}