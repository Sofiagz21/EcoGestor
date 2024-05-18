interface Partida{
    fechaInicioPartida: Date,
    fechaFinPartida: Date,
    ubicacionJugador: String,
    idNivel: number,
    puntuacion: String,
}

interface PartidaResponse extends Partida{
    idUsuario: number,
    idPartida: number,
    usuario: UsuarioResponse,
    nivel?: Nivel,

}
