"use client";

import { Button, Form, Input, Select, DatePicker, Skeleton } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import { format, startOfDay, isValid } from "date-fns";
import Image from "next/image";

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
    <div
      className="w-screen h-screen p-8"
      style={{ backgroundColor: "#D8E3CA" }}
    >
      <div className="w-full">
        <div className="bg-white border-[#E0F0CA] p-6 rounded-md shadow-md mb-8 w-full flex items-center p-10">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-3xl font-extrabold mb-2">
              Bienvenido a EcoGestor
            </h2>
            <p className="text-brown text-base lg:text-base mb-4 pt-4">
              EcoGestor es tu herramienta para gestionar residuos y optimizar
              tus procesos agrícolas.
            </p>
          </div>
          <div className="flex items-center flex-shrink-0 lg:block hidden">
            <Image
              src="/img/compost.svg"
              alt="EcoGestor"
              width={180} // increased size
              height={180} // increased size
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {usuario && usuario.idRolUsuario === 1 && (
          <div className="bg-white p-6 rounded-md shadow-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              ¿Qué deseas hacer en EcoGestor?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button type="primary" onClick={handleRegisterWaste}>
                Registrar residuos
              </Button>
              <Button type="primary" onClick={handleRegisterWasteRoute}>
                Registrar una ruta de residuos
              </Button>
              <Button type="primary" onClick={handleRegisterQualityControl}>
                Registrar un control de calidad
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
