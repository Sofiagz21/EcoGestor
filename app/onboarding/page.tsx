"use client";

import { Button, Form, Input, Select, DatePicker, Skeleton } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import { format, startOfDay, isValid } from "date-fns";

export default function OnboardingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);

  const [usuario, setUsuario] = useState<AuthResponse | null>(null);
  const [gameHasResiduo, setGameHasResiduo] = useState<boolean>();
  const [isGameAccountReady, setIsGameAccountReady] = useState<boolean>();
  
  
  function handleRegisterWaste() {
    // Aquí va el código para manejar el registro de residuos
  }
  
  function handleRegisterWasteRoute() {
    // Aquí va el código para manejar el registro de una ruta de residuos
  }
  
  function handleRegisterQualityControl() {
    // Aquí va el código para manejar el registro de un control de calidad
  }

  // Register farm, lot and crop for players
  const SetPlayerAccount = async () => {
    if (!usuario) return;

    // Send data to API
    const formPartida: FormData = new FormData();
    formPartida.append("IdUsuario", usuario.idUsuario.toString());
    formPartida.append("Name", "Granjero de Green Peel Adventure");

    try {
      const resp = await axiosInstance.post("/api/Partida", formPartida);

      if (resp.status === 201) {
        console.log("Partida Creada", resp.data);
        const formPartida: FormData = new FormData();

        // Now try to create a lot
        formPartida.append("IdPartida", resp.data.idPartida.toString());
        formPartida.append("FechaInicioPartida", "");
        formPartida.append("FechaFinPartida", "");
        formPartida.append("IdNivel", "1");
        formPartida.append("UbicacionJugador", "Granja de Sergio Y Sofia");
        formPartida.append("Puntuacion", "0");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getEstadosResiduos = async () => {
    try {
      const response = await axiosInstance.get("/api/EstadoResiduos");
      const estadosResiduos = response.data;
      setEstadosResiduos(estadosResiduos);
    } catch (error) {
      console.error("Error al obtener los estados de residuos:", error);
    }
  };

  const onFinish = async (values: any) => {
    if (!usuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append("IdUsuario", usuario.toString());
    form.append("NombreResiduo", values.nombreResiduo);

    // Verificar si la fecha es válida antes de formatearla
    const fechaRegistro = values.fechaRegistro.toDate();
    if (isValid(fechaRegistro)) {
      form.append("FechaRegistro", format(fechaRegistro, "yyyy-MM-dd"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    form.append("CantidadRegistrada", values.cantidadRegistrada);
    form.append("IdEstadoResiduos", values.idEstadoResiduo);

    try {
      const res = await axiosInstance.post("/api/Residuos", form);
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
    getEstadosResiduos();
  }, []);

  useEffect(() => {
    console.log(usuario);
  }, [usuario]);

  return (
    <div className="w-screen h-screen flex justify-center items-center p-8">
      <div
        className={`${
          usuario && usuario.idRolUsuario === 1 ? "lg:w-1/2" : "lg:w-1/4"
        } h-full flex justify-center items-center`}
      >
        {usuario && usuario.idRolUsuario === 1 ? (
          <div>
            <h2>Bienvenido agro</h2>
          </div>
        ) : usuario &&
          usuario.idRolUsuario === 2 &&
          (gameHasResiduo || isGameAccountReady) ? (
          <div>
            <h2>Agricultor</h2>
          </div>
        ) : usuario &&
          usuario.idRolUsuario === 2 &&
          gameHasResiduo !== undefined &&
          isGameAccountReady !== undefined &&
          !gameHasResiduo &&
          !isGameAccountReady ? (
          <div>
            <h2>JUGADOR</h2>
          </div>
        ) : (
          <Skeleton.Image style={{ width: 400, height: 400 }} active />
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-brown text-3xl lg:text-4xl font-extrabold">
          {usuario && usuario.idRolUsuario === 1 ? (
            "Empecemos registrando tu finca"
          ) : usuario &&
            usuario.idRolUsuario === 2 &&
            (gameHasResiduo || isGameAccountReady) ? (
            "¡Tu cuenta para jugar está lista!"
          ) : usuario &&
            usuario.idRolUsuario === 2 &&
            gameHasResiduo !== undefined &&
            isGameAccountReady !== undefined &&
            !gameHasResiduo &&
            !isGameAccountReady ? (
            "Estamos configurando tu cuenta..."
          ) : (
            <Skeleton.Input block active />
          )}
        </h1>
        <div className="text-brown text-sm lg:text-base">
          {usuario && usuario.idRolUsuario === 1 ? (
            <>
              Agrega a continuación los datos de tu finca para comenzar a usar
              la plataforma.&nbsp;
              <b>
                Podrás cambiar la información o agregar más fincas
                posteriormente.
              </b>
            </>
          ) : usuario &&
            usuario.idRolUsuario === 2 &&
            (gameHasResiduo || isGameAccountReady) ? (
            <>
              ¡Ya puedes jugar a Green Peel Adventure!&nbsp;
              <b>Abre el juego e inicia sesión con esta cuenta.</b>
            </>
          ) : usuario &&
            usuario.idRolUsuario === 2 &&
            gameHasResiduo !== undefined &&
            isGameAccountReady !== undefined &&
            !gameHasResiduo &&
            !isGameAccountReady ? (
            <>Este proceso sólo tomará un momento</>
          ) : (
            <Skeleton active className="mx-8 lg:mx-0" />
          )}
        </div>
        {usuario && usuario.idRolUsuario === 1 && (
          <div>
          <h2>¿Qué deseas realizar hoy?</h2>
          <Button type="primary" onClick={handleRegisterWaste}>Registrar residuos</Button>
          <Button type="primary" onClick={handleRegisterWasteRoute}>Registrar una ruta de residuos</Button>
          <Button type="primary" onClick={handleRegisterQualityControl}>Registrar un control de calidad</Button>
        </div>
        )}
      </div>
    </div>
  );
}
